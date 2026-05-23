// Client for the recipe AI endpoint.
//
// BACKEND CONTRACT
// ----------------
// POST `${URL}/recipe/`
// Body: {
//   source: "cart" | "store",
//   storeId?: string,        // present when source === "store"
//   items: [{                // the available items the AI should consider
//     _id: string,
//     name: string,
//     ref_price: number,
//     quantity: number,
//     expiry: string (ISO),
//   }]
// }
// Response: {
//   recipes: [{
//     id: string,              // stable id for this recipe in this response
//     name: string,
//     difficulty: "Easy" | "Medium" | "Hard",
//     time_minutes: number,
//     serves: number,
//     step_count: number,
//     image_url?: string,
//     steps: [{ title: string, description: string }],
//     // ingredients link back to the available items by _id when matched,
//     // or describe pantry items the user already has when item_id is null.
//     ingredients: [{
//       item_id: string | null,
//       name: string,            // display name
//       quantity: string,        // e.g. "2 cloves", "1 cup"
//     }]
//   }]
// }
//
// On the backend, Claude (Anthropic API, claude-sonnet-4-6) is a good fit
// because tool_use / structured JSON output is reliable. The prompt should
// instruct it to prefer items closer to expiry.

import { MOCK_ITEMS, getItemById } from "./mock-data.js";

// Configure this for your environment.
// const URL = "http://localhost:3000"; // e.g. "https://api.stillfresh.example.com"
const URL = import.meta.env.VITE_API_URL

const ENDPOINT = `${URL}/recipe/`;

// Set to true to bypass the network and use mock recipes for local dev.
const USE_MOCK = false;

// ---------- Cache ----------
// Session-scoped, 1 hour TTL.
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_KEY = "still_fresh_recipe_cache";

//loads cache
function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// saves cache
function saveCache(cache) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota errors
  }
}

// builds unique cache key from source
function cacheKey({ source, storeId, items }) {
  const ids = items
    .map((i) => i._id)
    .sort()
    .join(",");
  return `${source}:${storeId || ""}:${ids}`;
}

// ---------- Rate limiting (client side) ----------
// Backend MUST also rate limit. This is UX, not security.
// Rules: minimum 30s between refreshes, max 10 manual refreshes per hour.
const RL_KEY = "still_fresh_recipe_rl";
const RL_COOLDOWN_MS = 30 * 1000;
const RL_HOURLY_MAX = 10;
const RL_WINDOW_MS = 60 * 60 * 1000;

// loads rate limit state 
function loadRateLimit() {
  try {
    const raw = localStorage.getItem(RL_KEY);
    return raw ? JSON.parse(raw) : { last: 0, history: [] };
  } catch {
    return { last: 0, history: [] };
  }
}

// saves rate limit state
function saveRateLimit(rl) {
  try {
    localStorage.setItem(RL_KEY, JSON.stringify(rl));
  } catch {
    // ignore
  }
}

// check if refresh is allowed based on cooldown and hourly limit 
export function checkRateLimit() {
  const rl = loadRateLimit();
  const now = Date.now();
  const cooldownRemaining = Math.max(0, rl.last + RL_COOLDOWN_MS - now);
  const recent = rl.history.filter((t) => now - t < RL_WINDOW_MS);
  if (cooldownRemaining > 0) {
    return {
      allowed: false,
      reason: `Please wait ${Math.ceil(cooldownRemaining / 1000)}s before refreshing again.`,
      cooldownRemaining,
    };
  }
  if (recent.length >= RL_HOURLY_MAX) {
    const oldest = Math.min(...recent);
    const waitMs = RL_WINDOW_MS - (now - oldest);
    return {
      allowed: false,
      reason: `Refresh limit reached. Try again in ${Math.ceil(waitMs / 60000)} min.`,
      cooldownRemaining: waitMs,
    };
  }
  return { allowed: true, cooldownRemaining: 0 };
}

function recordRefresh() {
  const rl = loadRateLimit();
  const now = Date.now();
  rl.last = now;
  rl.history = [...rl.history.filter((t) => now - t < RL_WINDOW_MS), now];
  saveRateLimit(rl);
}

// ---------- Public API ----------

/**
 * Fetch recipes, using cache unless forceRefresh is true.
 * @param {Object} opts
 * @param {"cart"|"store"} opts.source
 * @param {string} [opts.storeId]
 * @param {Array} opts.items     items conforming to itemSchema (must include _id)
 * @param {boolean} [opts.forceRefresh]
 */
export async function fetchRecipes({
  source,
  storeId,
  items,
  forceRefresh = false,
}) {
  if (!items || items.length === 0) {
    return { recipes: [], cached: false };
  }

  const key = cacheKey({ source, storeId, items });
  const cache = loadCache();
  const now = Date.now();

  if (!forceRefresh) {
    const hit = cache[key];
    if (hit && now - hit.timestamp < CACHE_TTL_MS) {
      return { recipes: hit.recipes, cached: true };
    }
  } else {
    const rl = checkRateLimit();
    if (!rl.allowed) {
      const err = new Error(rl.reason);
      err.code = "RATE_LIMITED";
      throw err;
    }
    recordRefresh();
  }

  const body = {
    source,
    storeId,
    items: items.map((i) => ({
      _id: i._id,
      name: i.name,
      ref_price: i.ref_price,
      quantity: i.quantity,
      expiry: i.expiry,
    })),
  };

  let recipes;
  if (USE_MOCK) {
    recipes = await mockRecipes(body);
  } else {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      if (res.status === 429) {
        const err = new Error(
          "Server rate limit reached. Please try again later.",
        );
        err.code = "RATE_LIMITED";
        throw err;
      }
      throw new Error(`Request failed: ${res.status}`);
    }
    const data = await res.json();
    recipes = data.recipes || [];
  }

  cache[key] = { timestamp: now, recipes };
  saveCache(cache);

  return { recipes, cached: false };
}

/**
 * Look up a single recipe from the cache by id. Used by detail/instructions
 * pages so we don't re-call the AI for already-shown recipes.
 */
export function findCachedRecipe(recipeId) {
  const cache = loadCache();
  for (const key of Object.keys(cache)) {
    const entry = cache[key];
    const found = entry.recipes.find((r) => r.id === recipeId);
    if (found) return found;
  }
  return null;
}

// ---------- Mock recipe generator (dev only) ----------
async function mockRecipes(body) {
  // Simulate network latency.
  await new Promise((r) => setTimeout(r, 600));

  const names = body.items.map((i) => i.name);
  const has = (n) => names.some((x) => x.includes(n));

  const all = [
    {
      id: "rcp_caprese",
      name: "Caprese Sandwich",
      difficulty: "Easy",
      time_minutes: 10,
      serves: 2,
      requires: ["tomato", "basil", "mozzarella", "ciabatta"],
      steps: [
        {
          title: "Slice",
          description: "Slice the tomato and mozzarella into thin rounds.",
        },
        {
          title: "Assemble",
          description: "Layer tomato, mozzarella, and fresh basil on ciabatta.",
        },
        {
          title: "Finish",
          description:
            "Drizzle with olive oil, season with salt and pepper, and serve.",
        },
      ],
      ingredients: [
        {
          name: "tomato",
          item_id: findItemId(body.items, "tomato"),
          quantity: "2 medium",
        },
        {
          name: "fresh basil",
          item_id: findItemId(body.items, "basil"),
          quantity: "8 leaves",
        },
        {
          name: "mozzarella",
          item_id: findItemId(body.items, "mozzarella"),
          quantity: "150 g",
        },
        {
          name: "ciabatta loaf",
          item_id: findItemId(body.items, "ciabatta"),
          quantity: "1 small loaf",
        },
        {
          name: "olive oil",
          item_id: findItemId(body.items, "olive oil"),
          quantity: "1 tbsp",
        },
        { name: "salt & pepper", item_id: null, quantity: "to taste" },
      ],
    },
    {
      id: "rcp_bolognese",
      name: "Spaghetti Bolognese",
      difficulty: "Medium",
      time_minutes: 35,
      serves: 4,
      requires: ["spaghetti", "beef", "tomato", "onion", "garlic"],
      steps: [
        {
          title: "Sauté aromatics",
          description:
            "Dice the onion and mince the garlic. Sauté in olive oil until soft, about 5 minutes.",
        },
        {
          title: "Brown the beef",
          description:
            "Add ground beef and cook, breaking it up, until browned.",
        },
        {
          title: "Add tomatoes",
          description:
            "Stir in chopped tomatoes, season with salt, pepper, and herbs. Simmer 20 minutes.",
        },
        {
          title: "Cook pasta",
          description:
            "Boil spaghetti until al dente. Drain, reserving a little pasta water.",
        },
        {
          title: "Combine and serve",
          description:
            "Toss pasta with the sauce, adding pasta water as needed. Serve hot.",
        },
      ],
      ingredients: [
        {
          name: "spaghetti",
          item_id: findItemId(body.items, "spaghetti"),
          quantity: "400 g",
        },
        {
          name: "ground beef",
          item_id: findItemId(body.items, "ground beef"),
          quantity: "500 g",
        },
        {
          name: "tomato",
          item_id: findItemId(body.items, "tomato"),
          quantity: "4 medium, chopped",
        },
        {
          name: "yellow onion",
          item_id: findItemId(body.items, "onion"),
          quantity: "1 large, diced",
        },
        {
          name: "garlic",
          item_id: findItemId(body.items, "garlic"),
          quantity: "3 cloves, minced",
        },
        {
          name: "olive oil",
          item_id: findItemId(body.items, "olive oil"),
          quantity: "2 tbsp",
        },
        { name: "salt & pepper", item_id: null, quantity: "to taste" },
      ],
    },
    {
      id: "rcp_lemon_chicken",
      name: "Lemon Garlic Chicken",
      difficulty: "Easy",
      time_minutes: 25,
      serves: 2,
      requires: ["chicken", "lemon", "garlic"],
      steps: [
        {
          title: "Season",
          description:
            "Pat chicken breast dry and season with salt and pepper.",
        },
        {
          title: "Sear",
          description:
            "Heat olive oil in a pan over medium-high heat. Sear chicken 4-5 minutes each side until golden.",
        },
        {
          title: "Make pan sauce",
          description:
            "Lower heat, add minced garlic and lemon juice. Spoon over chicken.",
        },
        {
          title: "Rest and serve",
          description:
            "Let rest 3 minutes, then slice and serve with pan sauce.",
        },
      ],
      ingredients: [
        {
          name: "chicken breast",
          item_id: findItemId(body.items, "chicken"),
          quantity: "2 pieces",
        },
        {
          name: "lemon",
          item_id: findItemId(body.items, "lemon"),
          quantity: "1 large",
        },
        {
          name: "garlic",
          item_id: findItemId(body.items, "garlic"),
          quantity: "4 cloves, minced",
        },
        {
          name: "olive oil",
          item_id: findItemId(body.items, "olive oil"),
          quantity: "2 tbsp",
        },
        { name: "salt & pepper", item_id: null, quantity: "to taste" },
      ],
    },
    {
      id: "rcp_peppers",
      name: "Stuffed Bell Peppers",
      difficulty: "Medium",
      time_minutes: 45,
      serves: 4,
      requires: ["bell pepper", "beef", "onion", "garlic", "tomato"],
      steps: [
        {
          title: "Prep peppers",
          description: "Cut tops off bell peppers and remove seeds. Set aside.",
        },
        {
          title: "Make filling",
          description:
            "Sauté onion and garlic, then brown the ground beef. Stir in chopped tomato.",
        },
        {
          title: "Stuff",
          description:
            "Fill each pepper with the beef mixture. Place upright in a baking dish.",
        },
        {
          title: "Bake",
          description:
            "Bake at 190°C / 375°F for 30 minutes until peppers are tender.",
        },
      ],
      ingredients: [
        {
          name: "bell pepper",
          item_id: findItemId(body.items, "bell pepper"),
          quantity: "4 large",
        },
        {
          name: "ground beef",
          item_id: findItemId(body.items, "ground beef"),
          quantity: "400 g",
        },
        {
          name: "yellow onion",
          item_id: findItemId(body.items, "onion"),
          quantity: "1, diced",
        },
        {
          name: "garlic",
          item_id: findItemId(body.items, "garlic"),
          quantity: "2 cloves",
        },
        {
          name: "tomato",
          item_id: findItemId(body.items, "tomato"),
          quantity: "2, chopped",
        },
        { name: "salt & pepper", item_id: null, quantity: "to taste" },
      ],
    },
  ];

  // Only return recipes whose required items are present in this set.
  return all
    .filter((r) => r.requires.every((req) => has(req)))
    .map((r) => {
      // eslint-disable-next-line no-unused-vars
      const { requires, ...rest } = r;
      return { ...rest, step_count: r.steps.length };
    });
}

function findItemId(items, needle) {
  const hit = items.find((i) => i.name.includes(needle));
  return hit ? hit._id : null;
}

export { MOCK_ITEMS };

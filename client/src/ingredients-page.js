import { findCachedRecipe } from "/recipe-api.js";
import { DiscountList } from "/components/discount-card.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const URL = import.meta.env.VITE_API_URL


const els = {
  loading: document.getElementById("loading-state"),
  content: document.getElementById("ingredients-content"),
  error: document.getElementById("error-state"),
  name: document.getElementById("recipe-name"),
  serves: document.getElementById("recipe-serves"),
  cost: document.getElementById("recipe-cost"),
  availableList: document.getElementById("available-list"),
  noAvailable: document.getElementById("no-available"),
  pantrySection: document.getElementById("pantry-section"),
  pantryList: document.getElementById("pantry-list"),
  startLink: document.getElementById("start-recipe-link"),
  backLink: document.getElementById("back-link"),
};

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

function capitalize(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Calculate discount based on days until expiry
function getDiscount(expiryDate) {
  const days = Math.max(
    0,
    Math.round((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
  );
  return days <= 1 ? 0.5 : days <= 2 ? 0.35 : days <= 4 ? 0.2 : 0.1;
}

// Fetch real item data from backend by ID
async function fetchItemById(itemId) {
  try {
    const response = await fetch(`${URL}}/items/${itemId}`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.item || null;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// Fetch business/store data by ID
async function fetchBusinessById(businessId) {
  try {
    const response = await fetch(
      `${URL}/business/${businessId}`,
      {
        credentials: "include",
      },
    );
    const data = await response.json();
    return data.business || null;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
}

function toDiscountCardShape(item, store, quantityLabel) {
  const discount = getDiscount(item.expiry);
  const before = item.ref_price;
  const after = +(before * (1 - discount)).toFixed(2);

  return {
    _id: item._id,
    name: capitalize(item.name),
    img: `https://placehold.co/72x72/2BA84A/ffffff?text=${encodeURIComponent(item.name[0].toUpperCase())}`,
    distance: store ? store.address : "—",
    before,
    after,
    expires: item.expiry,
    storeName: store?.username,
    needed: quantityLabel,
  };
}

// Cost is sum of discounted prices for matched items
function computeCost(available) {
  return available.reduce((total, card) => total + card.after, 0).toFixed(2);
}

async function render(recipe) {
  els.name.textContent = recipe.name;
  els.serves.textContent = `Serves ${recipe.serves}`;
  els.backLink.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
  els.startLink.href = `instructions.html?id=${encodeURIComponent(recipe.id)}`;

  const available = [];
  const pantry = [];

  for (const ing of recipe.ingredients || []) {
    if (ing.item_id) {
      const item = await fetchItemById(ing.item_id);
      if (item) {
        const store = await fetchBusinessById(item.business);
        available.push(toDiscountCardShape(item, store, ing.quantity));
        continue;
      }
    }
    pantry.push(ing);
  }

  els.cost.textContent = computeCost(available);

  if (available.length === 0) {
    show(els.noAvailable);
  } else {
    hide(els.noAvailable);
    new DiscountList(els.availableList, available).render();
  }

  if (pantry.length > 0) {
    show(els.pantrySection);
    els.pantryList.innerHTML = pantry
      .map(
        (ing) => `
          <li class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5">
            <span class="text-[#2D3A3A]">${escapeHtml(capitalize(ing.name))}</span>
            <span class="text-sm text-gray-500">${escapeHtml(ing.quantity)}</span>
          </li>
        `,
      )
      .join("");
  }

  hide(els.loading);
  show(els.content);
}

async function init() {
  if (!recipeId) {
    hide(els.loading);
    show(els.error);
    return;
  }
  const recipe = findCachedRecipe(recipeId);
  if (!recipe) {
    hide(els.loading);
    show(els.error);
    return;
  }
  await render(recipe);
}

init();

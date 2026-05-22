import { RecipeList } from "./components/recipe-card.js";
import { fetchRecipes, checkRateLimit } from "./recipe-api.js";
const URL = import.meta.env.VITE_API_URL


// ---------- Real data fetchers ----------
async function fetchUserCart() {
  try {
    const response = await fetch(`${URL}/deal/cart`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.cart || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

async function fetchStores() {
  try {
    const response = await fetch(`${URL}/business/all`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.businesses || [];
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
}

async function fetchStoreItems(storeId) {
  try {
    const response = await fetch(
      `${URL}/business/${storeId}/items`,
      { credentials: "include" },
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching store items:", error);
    return [];
  }
}

// ---------- DOM refs ----------
const els = {
  cartSection: document.getElementById("cart-section"),
  cartCount: document.getElementById("cart-count"),
  cartRecipes: document.getElementById("cart-recipes"),
  storeSection: document.getElementById("store-section"),
  storeSelect: document.getElementById("store-select"),
  storeRecipes: document.getElementById("store-recipes"),
  loading: document.getElementById("loading-state"),
  empty: document.getElementById("empty-state"),
  error: document.getElementById("error-state"),
  errorMsg: document.getElementById("error-message"),
  refreshBtn: document.getElementById("refresh-btn"),
  refreshLabel: document.getElementById("refresh-btn-label"),
  toast: document.getElementById("toast"),
};

const SELECTED_STORE_KEY = "still_fresh_selected_store";

// ---------- UI helpers ----------
function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.remove("opacity-0");
  els.toast.classList.add("opacity-100");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove("opacity-100");
    els.toast.classList.add("opacity-0");
  }, 2500);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ---------- Store selector ----------
async function populateStoreSelect() {
  const businesses = await fetchStores();

  if (!businesses.length) {
    els.storeSelect.innerHTML = `<option value="">No stores available</option>`;
    return null;
  }

  const saved = localStorage.getItem(SELECTED_STORE_KEY);
  const selected = businesses.find((b) => b._id === saved) || businesses[0];

  els.storeSelect.innerHTML = businesses
    .map(
      (b, i) =>
        `<option value="${b._id}" ${b._id === selected?._id ? "selected" : ""}>
          ${escapeHtml(b.username)} · ${escapeHtml(b.address || "No address")}
          ${i === 0 ? " (closest)" : ""}
        </option>`,
    )
    .join("");

  return selected?._id;
}

// ---------- Main load ----------
async function loadAll({ forceRefresh = false } = {}) {
  hide(els.error);
  hide(els.empty);
  show(els.loading);
  hide(els.cartSection);
  els.storeRecipes.innerHTML = "";

  const cart = await fetchUserCart();
  const storeId = await populateStoreSelect();
  const storeItems = storeId ? await fetchStoreItems(storeId) : [];

  try {
    const [cartResult, storeResult] = await Promise.all([
      cart.length > 0
        ? fetchRecipes({ source: "cart", items: cart, forceRefresh })
        : Promise.resolve({ recipes: [], cached: false }),
      storeItems.length > 0
        ? fetchRecipes({
            source: "store",
            storeId,
            items: storeItems,
            forceRefresh,
          })
        : Promise.resolve({ recipes: [], cached: false }),
    ]);

    hide(els.loading);

    // Cart section
    if (cart.length > 0) {
      show(els.cartSection);
      els.cartCount.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"} in cart`;
      new RecipeList(els.cartRecipes, cartResult.recipes).render();
    }

    // Store section always renders so the selector stays visible
    new RecipeList(els.storeRecipes, storeResult.recipes).render();

    // Overall empty state only if nothing anywhere
    if (
      cartResult.recipes.length === 0 &&
      storeResult.recipes.length === 0 &&
      cart.length === 0
    ) {
      show(els.empty);
    }
  } catch (err) {
    hide(els.loading);
    if (err.code === "RATE_LIMITED") {
      showToast(err.message);
    } else {
      show(els.error);
      els.errorMsg.textContent = err.message || "Something went wrong.";
    }
  }
}

// ---------- Refresh button ----------
function updateRefreshAvailability() {
  const rl = checkRateLimit();
  if (rl.allowed) {
    els.refreshBtn.disabled = false;
    els.refreshLabel.textContent = "Refresh";
  } else {
    els.refreshBtn.disabled = true;
    const secs = Math.ceil(rl.cooldownRemaining / 1000);
    els.refreshLabel.textContent = secs < 90 ? `${secs}s` : "Wait";
  }
}

function startRefreshClock() {
  updateRefreshAvailability();
  setInterval(updateRefreshAvailability, 1000);
}

// ---------- Wire up ----------
els.storeSelect.addEventListener("change", (e) => {
  localStorage.setItem(SELECTED_STORE_KEY, e.target.value);
  loadAll();
});

els.refreshBtn.addEventListener("click", () => {
  const rl = checkRateLimit();
  if (!rl.allowed) {
    showToast(rl.reason);
    return;
  }
  loadAll({ forceRefresh: true });
});

loadAll();
startRefreshClock();

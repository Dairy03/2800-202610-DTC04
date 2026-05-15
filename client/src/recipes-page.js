import { RecipeList } from "./components/recipe-card.js";
import { fetchRecipes, checkRateLimit } from "./recipe-api.js";
import {
  MOCK_STORES,
  getClosestStore,
  getItemsForStore,
  getCart,
} from "./mock-data.js";

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

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function populateStoreSelect() {
  // Closest first, then by distance.
  const sorted = [...MOCK_STORES].sort((a, b) => a.distance - b.distance);
  const saved = localStorage.getItem(SELECTED_STORE_KEY);
  const selected = sorted.find((s) => s._id === saved) || sorted[0];

  els.storeSelect.innerHTML = sorted
    .map(
      (s, i) =>
        `<option value="${s._id}" ${s._id === selected._id ? "selected" : ""}>${escapeHtml(s.name)} · ${s.distance} km${i === 0 ? " (closest)" : ""}</option>`
    )
    .join("");

  return selected._id;
}

async function loadAll({ forceRefresh = false } = {}) {
  hide(els.error);
  hide(els.empty);
  show(els.loading);
  hide(els.cartSection);
  els.storeRecipes.innerHTML = "";

  const cart = getCart();
  const storeId = els.storeSelect.value;
  const storeItems = getItemsForStore(storeId);

  try {
    const [cartResult, storeResult] = await Promise.all([
      cart.length > 0
        ? fetchRecipes({ source: "cart", items: cart, forceRefresh })
        : Promise.resolve({ recipes: [], cached: false }),
      storeItems.length > 0
        ? fetchRecipes({ source: "store", storeId, items: storeItems, forceRefresh })
        : Promise.resolve({ recipes: [], cached: false }),
    ]);

    hide(els.loading);

    // Cart section
    if (cart.length > 0) {
      show(els.cartSection);
      els.cartCount.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"} in cart`;
      new RecipeList(els.cartRecipes, cartResult.recipes).render();
    }

    // Store section always renders so the selector stays visible.
    new RecipeList(els.storeRecipes, storeResult.recipes).render();

    // Overall empty state only if nothing anywhere.
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

function updateRefreshAvailability() {
  const rl = checkRateLimit();
  if (rl.allowed) {
    els.refreshBtn.disabled = false;
    els.refreshLabel.textContent = "Refresh";
  } else {
    els.refreshBtn.disabled = true;
    const secs = Math.ceil(rl.cooldownRemaining / 1000);
    if (secs < 90) {
      els.refreshLabel.textContent = `${secs}s`;
    } else {
      els.refreshLabel.textContent = "Wait";
    }
  }
}

function startRefreshClock() {
  updateRefreshAvailability();
  setInterval(updateRefreshAvailability, 1000);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ---------- Wire up ----------
populateStoreSelect();

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

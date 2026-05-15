import { findCachedRecipe } from "./recipe-api.js";
import { getItemById, MOCK_STORES } from "./mock-data.js";
import { DiscountList } from "./components/discount-card.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

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

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

// Discount math is mocked here. In production this comes from the
// item's actual sale price; ref_price is the regular price.
// We assume "after" = ref_price * (1 - discount) based on expiry proximity.
function toDiscountCardShape(item, quantityLabel) {
  const expiry = new Date(item.expiry);
  const days = Math.max(0, Math.round((expiry - new Date()) / (1000 * 60 * 60 * 24)));
  // Bigger discount the closer to expiry.
  const discount = days <= 1 ? 0.5 : days <= 2 ? 0.35 : days <= 4 ? 0.2 : 0.1;
  const before = item.ref_price;
  const after = +(before * (1 - discount)).toFixed(2);

  const store = MOCK_STORES.find((s) => s._id === item.business);

  return {
    _id: item._id,
    name: capitalize(item.name),
    img: `https://placehold.co/72x72/2BA84A/ffffff?text=${encodeURIComponent(item.name[0].toUpperCase())}`,
    distance: store ? `${store.distance} km` : "—",
    before,
    after,
    expires: item.expiry,
    storeName: store?.name,
    needed: quantityLabel,
  };
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

function computeCost(recipe) {
  let total = 0;
  for (const ing of recipe.ingredients || []) {
    if (!ing.item_id) continue;
    const item = getItemById(ing.item_id);
    if (item) total += item.ref_price;
  }
  return total.toFixed(2);
}

function render(recipe) {
  els.name.textContent = recipe.name;
  els.serves.textContent = `Serves ${recipe.serves}`;
  els.cost.textContent = computeCost(recipe);
  els.backLink.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
  els.startLink.href = `instructions.html?id=${encodeURIComponent(recipe.id)}`;

  // Split ingredients into "available discounted items" vs "pantry/staples"
  const available = [];
  const pantry = [];

  for (const ing of recipe.ingredients || []) {
    if (ing.item_id) {
      const item = getItemById(ing.item_id);
      if (item) {
        available.push(toDiscountCardShape(item, ing.quantity));
        continue;
      }
    }
    pantry.push(ing);
  }

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
        `
      )
      .join("");
  }

  hide(els.loading);
  show(els.content);
}

function init() {
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
  render(recipe);
}

init();

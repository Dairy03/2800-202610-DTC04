import { findCachedRecipe } from "./recipe-api.js";
import { getItemById } from "./mock-data.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const els = {
  loading: document.getElementById("loading-state"),
  content: document.getElementById("recipe-content"),
  error: document.getElementById("error-state"),
  name: document.getElementById("recipe-name"),
  serves2: document.getElementById("recipe-serves-2"),
  time: document.getElementById("recipe-time"),
  difficulty: document.getElementById("recipe-difficulty"),
  stepCount: document.getElementById("recipe-step-count"),
  cost: document.getElementById("recipe-cost"),
  startLink: document.getElementById("start-recipe-link"),
  ingredientsLink: document.getElementById("view-ingredients-link"),
  image: document.getElementById("recipe-image"),
  imageFallback: document.getElementById("recipe-image-fallback"),
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function computeCost(recipe) {
  // Cost comes from front end data, per requirements.
  // Sum ref_price for items we can resolve; pantry items (item_id: null) are skipped.
  let total = 0;
  for (const ing of recipe.ingredients || []) {
    if (!ing.item_id) continue;
    const item = getItemById(ing.item_id);
    if (item) total += item.ref_price;
  }
  return total.toFixed(2);
}

function difficultyClasses(d) {
  const map = {
    Easy: "bg-[#2BA84A] text-white",
    Medium: "bg-orange-500 text-white",
    Hard: "bg-red-600 text-white",
  };
  return map[d] || map.Easy;
}

function render(recipe) {
  els.name.textContent = recipe.name;
  els.serves2.textContent = `Serves ${recipe.serves}`;
  els.time.textContent = recipe.time_minutes;
  els.difficulty.textContent = recipe.difficulty;
  els.difficulty.className = `inline-block text-sm font-semibold px-4 py-1 rounded-full ${difficultyClasses(recipe.difficulty)}`;
  els.stepCount.textContent = recipe.step_count ?? (recipe.steps?.length || 0);
  els.cost.textContent = computeCost(recipe);

  if (recipe.image_url) {
    els.image.src = recipe.image_url;
    els.image.alt = recipe.name;
    els.image.classList.remove("hidden");
    els.imageFallback.classList.add("hidden");
  }

  els.startLink.href = `instructions.html?id=${encodeURIComponent(recipe.id)}`;
  els.ingredientsLink.href = `ingredients.html?id=${encodeURIComponent(recipe.id)}`;

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

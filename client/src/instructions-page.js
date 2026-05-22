import { findCachedRecipe } from "./recipe-api.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const els = {
  loading: document.getElementById("loading-state"),
  content: document.getElementById("instructions-content"),
  error: document.getElementById("error-state"),
  name: document.getElementById("recipe-name"),
  steps: document.getElementById("steps-container"),
  ingredientsLink: document.getElementById("ingredients-link"),
  backLink: document.getElementById("back-link"),
};

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function render(recipe) {
  els.name.textContent = recipe.name;
  els.backLink.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
  els.ingredientsLink.href = `ingredients.html?id=${encodeURIComponent(recipe.id)}`;

  const steps = recipe.steps || [];
  els.steps.innerHTML = steps
    .map(
      (step, i) => `
        <div>
          <h2 class="text-2xl font-bold text-[#2D3A3A]">Step ${i + 1}: ${escapeHtml(step.title)}</h2>
          <p class="text-gray-500 mt-2 leading-relaxed">${escapeHtml(step.description)}</p>
        </div>
      `
    )
    .join("");

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

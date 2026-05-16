// Recipe card used in the recipes list page.
// Visually matches the existing Item card style in the wireframe.

export class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;
  }

  #difficultyBadge() {
    const d = this.recipe.difficulty || "Easy";
    const map = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-orange-100 text-orange-800",
      Hard: "bg-red-100 text-red-800",
    };
    return `<span class="text-xs font-medium px-2.5 py-1 rounded-full ${map[d] || map.Easy}">${d.toLowerCase()}</span>`;
  }

  render() {
    const { id, name, time_minutes, step_count, image_url } = this.recipe;

    const card = document.createElement("div");
    card.className =
      "relative flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl p-2 w-full hover:border-green-600 transition-colors duration-150";

    const imageHtml = image_url
      ? `<img src="${image_url}" alt="${escapeHtml(name)}" loading="lazy" class="w-20 h-20 rounded-lg object-cover shrink-0 bg-gray-400" />`
      : `<div class="w-20 h-20 rounded-lg shrink-0 bg-gray-400 flex items-center justify-center text-white text-[10px] font-bold text-center px-1">RECIPE<br/>IMAGE</div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="flex flex-col items-start ml-2 flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate w-full">${escapeHtml(name)}</h3>
        <div class="flex items-center gap-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#2BA84A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="text-xs font-semibold text-[#2BA84A]">${time_minutes} minutes</span>
          <span class="text-xs text-gray-400 ml-2">${step_count} steps</span>
        </div>
      </div>
      <div class="absolute bottom-3 right-3">${this.#difficultyBadge()}</div>
    `;

    const link = document.createElement("a");
    link.href = `recipe.html?id=${encodeURIComponent(id)}`;
    link.className = "block";
    link.appendChild(card);
    return link;
  }
}

export class RecipeList {
  constructor(selector, recipes = []) {
    this.container =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    this.recipes = recipes;
  }

  render() {
    this.container.innerHTML = "";
    this.container.className = "flex flex-col gap-3 w-full";
    if (this.recipes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "text-sm text-gray-500 text-center py-6";
      empty.textContent = "No recipes match these items.";
      this.container.appendChild(empty);
      return;
    }
    this.recipes.forEach((r) => {
      this.container.appendChild(new RecipeCard(r).render());
    });
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

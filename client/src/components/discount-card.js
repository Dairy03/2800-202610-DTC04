// This component already exists in the codebase. It's included here so the
// ingredients page can be tested standalone. Remove this file and import from
// the existing location when integrating.

export class DiscountCard {
  constructor(item) {
    this.item = item;
  }

  // calculates how many days the item expires
  #daysUnitlExpiry() {
    const now = new Date();
    const expiry = new Date(this.item.expires);
    return Math.round((expiry - now) / (1000 * 60 * 60 * 24));
  }

  // expiry badge changes color based on days until expiry
  #expiryBadge(days) {
    if (days <= 0) return { label: "Expires today", cls: "bg-red-100 text-red-800" };
    if (days === 1) return { label: "Exp 1d", cls: "bg-red-100 text-red-800" };
    if (days === 2) return { label: "Exp 2d", cls: "bg-orange-100 text-orange-800" };
    return { label: `Exp ${days}d`, cls: "bg-green-100 text-green-800" };
  }

  // builds and renders the discount cards
  render() {
    const { name, img, distance, before, after } = this.item;
    const days = this.#daysUnitlExpiry();
    const badge = this.#expiryBadge(days);
    const saving = (before - after).toFixed(2);

    const card = document.createElement("div");
    card.className =
      "relative flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl p-2 w-full max-h-32 hover:border-green-600 transition-colors duration-150";
    card.innerHTML = `
      <div class="">
        <img
          src="${img}"
          alt="${name}"
          loading="lazy"
          class="w-18 h-18 rounded-lg object-cover shrink-0 bg-green-400"
        />
      </div>

      <div class="flex flex-col items-start ml-4">
        <h3 class="text-xl items-start font-semibold text-gray-900 truncate">${name}</h3>
        <p class="text-xs self-start text-gray-400">
          Store name
        </p>
        <p class="text-xs self-start text-gray-400">
          ${distance} away
        </p>
        <div class="flex flex-row gap-1 items-end">
          <span class="text-base font-semibold text-gray-900">$${after.toFixed(2)}</span>
          <span class="text-xs text-gray-400 line-through">$${before.toFixed(2)}</span>
          <span class="text-xs font-medium text-green-700">Save $${saving}</span>
        </div>
      </div>

      <div class="flex flex-col items-end shrink-0 pr-2">
        <span class="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}">${badge.label}</span>
      </div>
    `;

    const acard = document.createElement("a");
    acard.href = "item-page.html";
    acard.append(card);
    return acard;
  }
}

export class DiscountList {
  constructor(selector, items = []) {
    this.container =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    this.items = items;
  }

  // clears container and renders all discount cards
  render() {
    this.container.innerHTML = "";
    this.container.className = "flex flex-col gap-3 px-2 w-full max-w-md mx-auto";
    this.items.forEach((item) => {
      this.container.appendChild(new DiscountCard(item).render());
    });
  }
}

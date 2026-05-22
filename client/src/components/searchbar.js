import { itemStore } from "/store/itemStore.js";

const FILTER_MAP = {
  "All": "",
  "Fresh Produce": "fp",
  "Meat & Seafood": "ms",
  "Dairy & Eggs": "de",
  "Bakery": "bk",
  "Snacks & Sweets": "ss",
};

const SORT_MAP = {
  "food": "price",
  "expiry": "expiry",
  "distance": "distance",
};

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.selectedFilters = new Set();
    this.currentSort = "expiry";
    this.renderSearchBar();
  }

  connectedCallback() {
    this.attachSortLogic();
    this.attachFilterLogic();
    this.attachSearchLogic();
  }

  fetchItems() {
    const filters = [...this.selectedFilters].join("-") || "";
    itemStore.getState().fetchItems({
      search: this.currentSearch || "",
      filters,
      order: this.currentSort,
    });
  }

  attachSortLogic() {
    let sortOpen = false;
    const sortPanel = this.querySelector("#sort-panel");
    const sortBtn = this.querySelector("#sort-btn");
    const sortRows = ["s-food", "s-expiry", "s-distance"];

    sortBtn.addEventListener("click", () => {
      sortOpen = !sortOpen;
      sortPanel.classList.toggle("hidden", !sortOpen);
    });

    sortRows.forEach((id) => {
      this.querySelector(`#${id}`).addEventListener("click", () => {
        sortRows.forEach((r) => {
          const row = this.querySelector(`#${r}`);
          row.classList.remove("font-medium", "text-gray-900");
          row.classList.add("text-gray-500");
          row.querySelector("i").style.opacity = "0";
        });
        const el = this.querySelector(`#${id}`);
        el.classList.add("font-medium", "text-gray-900");
        el.classList.remove("text-gray-500");
        el.querySelector("i").style.opacity = "1";

        const sortKey = id.replace("s-", "");
        this.currentSort = SORT_MAP[sortKey] || "expiry";
        this.fetchItems();

        setTimeout(() => {
          sortOpen = false;
          sortPanel.classList.add("hidden");
        }, 120);
      });
    });

    document.addEventListener("click", (e) => {
      if (sortOpen && !e.target.closest("#sort-panel") && !e.target.closest("#sort-btn")) {
        sortOpen = false;
        sortPanel.classList.add("hidden");
      }
    });
  }

  attachFilterLogic() {
    const chips = this.querySelectorAll(".filter-chip");

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const label = chip.textContent.trim();
        const code = FILTER_MAP[label];

        if (label === "All") {
          // Clear all filters
          this.selectedFilters.clear();
          chips.forEach((c) => {
            c.dataset.selected = "false";
            c.classList.remove("bg-gray-500", "text-white", "border-gray-500");
            c.classList.add("bg-white", "text-gray-700", "border-gray-200");
          });
          chip.dataset.selected = "true";
          chip.classList.add("bg-gray-500", "text-white", "border-gray-500");
          chip.classList.remove("bg-white", "text-gray-700", "border-gray-200");
        } else {
          // Deselect "All"
          const allChip = chips[0];
          allChip.dataset.selected = "false";
          allChip.classList.remove("bg-gray-500", "text-white", "border-gray-500");
          allChip.classList.add("bg-white", "text-gray-700", "border-gray-200");

          // Toggle this filter
          const isSelected = chip.dataset.selected === "true";
          if (isSelected) {
            this.selectedFilters.delete(code);
            chip.dataset.selected = "false";
            chip.classList.remove("bg-gray-500", "text-white", "border-gray-500");
            chip.classList.add("bg-white", "text-gray-700", "border-gray-200");
          } else {
            this.selectedFilters.add(code);
            chip.dataset.selected = "true";
            chip.classList.add("bg-gray-500", "text-white", "border-gray-500");
            chip.classList.remove("bg-white", "text-gray-700", "border-gray-200");
          }

          // If nothing selected, reselect "All"
          if (this.selectedFilters.size === 0) {
            allChip.dataset.selected = "true";
            allChip.classList.add("bg-gray-500", "text-white", "border-gray-500");
            allChip.classList.remove("bg-white", "text-gray-700", "border-gray-200");
          }
        }

        this.fetchItems();
      });
    });
  }

  attachSearchLogic() {
    const input = this.querySelector("#sb");
    let debounceTimer;

    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.currentSearch = input.value.trim();
        this.fetchItems();
      }, 300);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearTimeout(debounceTimer);
        this.currentSearch = input.value.trim();
        this.fetchItems();
      }
    });
  }

  renderSearchBar() {
    this.innerHTML = `
      <div class="flex flex-col gap-3 w-full max-w-xl mx-auto p-4">
        <div class="relative flex items-center">
          <i class="ti ti-search absolute left-4 text-gray-400 text-base pointer-events-none" aria-hidden="true"></i>
          <input
            id="sb"
            type="text"
            placeholder="Search groceries..."
            autocomplete="off"
            class="w-full h-12 pl-11 pr-24 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 placeholder:text-gray-400"
          />
          <button
            id="sort-btn"
            aria-label="Sort"
            class="absolute right-2 flex items-center gap-1.5 px-3 h-9 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
          >
            <i class="ti ti-arrows-sort text-base" aria-hidden="true"></i>
            Sort
          </button>
        </div>

        <div id="sort-panel" class="hidden w-full">
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div id="s-food" class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition">Food<i class="ti ti-check text-base opacity-0" aria-hidden="true"></i></div>
            <div id="s-expiry" class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition">Expiry<i class="ti ti-check text-base" aria-hidden="true"></i></div>
            <div id="s-distance" class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition">Distance<i class="ti ti-check text-base opacity-0" aria-hidden="true"></i></div>
          </div>
        </div>

        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-gray-500 text-white border border-gray-500 transition" data-selected="true">All</button>
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition" data-selected="false">Fresh Produce</button>
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition" data-selected="false">Meat & Seafood</button>
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition" data-selected="false">Dairy & Eggs</button>
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition" data-selected="false">Bakery</button>
          <button class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition" data-selected="false">Snacks & Sweets</button>
        </div>

        <style>
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
      </div>
    `;
  }
}

customElements.define("search-bar", SearchBar);
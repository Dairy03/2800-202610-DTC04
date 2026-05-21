class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.renderSearchBar();
  }

renderSearchBar() {
  this.innerHTML = `
    <div class="flex flex-col gap-3 w-full max-w-xl mx-auto">

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
          onclick="toggleSort()"
          aria-label="Sort"
          class="absolute right-2 flex items-center gap-1.5 px-3 h-9 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition"
        >
          <i id="sort-icon" class="ti ti-arrows-sort text-base" aria-hidden="true"></i>
          Sort
        </button>
      </div>

      <div id="sort-panel" class="hidden w-full">
        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div id="s-food"     onclick="selectSort(this,'Food')"     class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition">Food<i id="ic-food"     class="ti ti-check text-base" aria-hidden="true"></i></div>
          <div id="s-expiry"   onclick="selectSort(this,'Expiry')"   class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition">Expiry<i id="ic-expiry"   class="ti ti-check text-base opacity-0" aria-hidden="true"></i></div>
          <div id="s-distance" onclick="selectSort(this,'Distance')" class="sort-row flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm text-gray-500 hover:bg-gray-50 transition">Distance<i id="ic-distance" class="ti ti-check text-base opacity-0" aria-hidden="true"></i></div>
        </div>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onclick="selectFilter(this)" data-selected="true"  class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-gray-500 text-white border border-gray-500 transition">All</button>
        <button onclick="selectFilter(this)" data-selected="false" class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Fresh Produce</button>
        <button onclick="selectFilter(this)" data-selected="false" class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Meat & Seafood</button>
        <button onclick="selectFilter(this)" data-selected="false" class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Dairy & Eggs</button>
        <button onclick="selectFilter(this)" data-selected="false" class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Bakery</button>
        <button onclick="selectFilter(this)" data-selected="false" class="filter-chip shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-gray-300 transition">Snacks & Sweets</button>
      </div>

      <style>
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      </style>

    </div>
`
}

}

customElements.define("searchbar", SearchBar);

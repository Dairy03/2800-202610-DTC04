class SearchFilter extends HTMLElement {
  constructor() {
    super();
    this.renderSearchFilter();
  }

  renderSearchFilter() {
    this.innerHTML = `
    <form class="shadow-md rounded px-8 pt-6 pb-8 mb-4 items-center">
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="search" name="search" placeholder="Search groceries..." ><br>



      <div class="relative max-w-sm flex w-full flex-col">
  <nav class="flex min-w-80 flex-row gap-1 p-2">
    <div
      role="button"
      class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 border"
    >
      <label
        for="all-horizontal"
        class="flex w-full cursor-pointer items-center px-3 py-2"
      >
        <div class="inline-flex items-center">
          <label class="relative flex items-center cursor-pointer" for="all-horizontal">
            <input
              name="framework-horizontal"
              type="radio"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
              id="all-horizontal"
              checked
            />
            <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          </label>
          <label class="ml-2 text-slate-600 cursor-pointer text-sm" for="all-horizontal">
            All
          </label>
        </div>
      </label>
    </div>

    <div
      role="button"
      class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 border"
    >
      <label
        for="recent-horizontal"
        class="flex w-full cursor-pointer items-center px-3 py-2"
      >
        <div class="inline-flex items-center">
          <label class="relative flex items-center cursor-pointer" for="recent-horizontal">
            <input
              name="framework-horizontal"
              type="radio"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
              id="recent-horizontal"
            />
            <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          </label>
          <label class="ml-2 text-slate-600 cursor-pointer text-sm" for="recent-horizontal">
            Recent
          </label>
        </div>
      </label>
    </div>

    <div
      role="button"
      class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 border"
    >
      <label
        for="produce-horizontal"
        class="flex w-full cursor-pointer items-center px-3 py-2"
      >
        <div class="inline-flex items-center">
          <label class="relative flex items-center cursor-pointer" for="produce-horizontal">
            <input
              name="framework-horizontal"
              type="radio"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
              id="produce-horizontal"
            />
            <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          </label>
          <label class="ml-2 text-slate-600 cursor-pointer text-sm" for="produce-horizontal">
            Produce
          </label>
        </div>
      </label>
    </div>


     <div
      role="button"
      class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 border"
    >
      <label
        for="dairy-horizontal"
        class="flex w-full cursor-pointer items-center px-3 py-2"
      >
        <div class="inline-flex items-center">
          <label class="relative flex items-center cursor-pointer" for="dairy-horizontal">
            <input
              name="framework-horizontal"
              type="radio"
              class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
              id="dairy-horizontal"
            />
            <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          </label>
          <label class="ml-2 text-slate-600 cursor-pointer text-sm" for="dairy-horizontal">
            Dairy
          </label>
        </div>
      </label>
    </div>
  </nav>
</div>

    </form>
  `;
  }
}

customElements.define("search-filter", SearchFilter);

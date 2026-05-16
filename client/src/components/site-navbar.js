class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
  }

renderNavbar() {
  this.innerHTML = `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#EEEEEE]" id="bottom-nav">
      <div class="flex flex-nowrap justify-around items-center p-2 text-[#248232]">
        <a href="home.html" class="inline-block text-center">
          <img src="./images/home-sprite.png" class="h-6 mx-auto" alt="Home" />
          <p class="text-sm">Home</p>
        </a>
        <a href="map.html" class="inline-block">
          <img src="./images/map-sprite.png" class="h-6 mx-auto" alt="Map" />
          <p class="text-sm">Map</p>
        </a>
        <a href="recipes.html" class="inline-block">
          <img src="./images/recipes-sprite.png" class="h-6 mx-auto" alt="Recipes" />
          <p class="text-sm">Recipes</p>
        </a>
        <a href="mydeals.html" class="inline-block">
          <img src="./images/my-deals-sprite.png" class="h-6 mx-auto" alt="My Deals" />
          <p class="text-sm">My Deals</p>
        </a>
      </div>
    </nav>
  `;
}

}

customElements.define("site-navbar", SiteNavbar);

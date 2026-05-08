class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
  }

renderNavbar() {
  this.innerHTML = `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#EEEEEE]" id="bottom-nav">
      <div class="flex flex-nowrap justify-around items-center p-2">
        <a href="home.html" class="inline-block">
          <img src="./images/home-sprite.png" class="h-9" alt="Home" />
        </a>
        <a href="" class="inline-block">
          <img src="./images/map-sprite.png" class="h-9" alt="Map" />
        </a>
        <a href="" class="inline-block">
          <img src="./images/recipes-sprite.png" class="h-9" alt="Recipes" />
        </a>
        <a href="" class="inline-block">
          <img src="./images/my-deals-sprite.png" class="h-9" alt="My Deals" />
        </a>
      </div>
    </nav>
  `;
}

}

customElements.define("site-navbar", SiteNavbar);

class SiteTopNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderTopNavbar();
  }

renderTopNavbar() {
  this.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[#FFFBF4]" id="top-nav">
      <div class="flex flex-nowrap justify-between items-center p-2">
        <img src="./images/profile-sprite.png" class="h-9 invisible"/>
        <h1 class="font-extrabold">Still Fresh</h1>
        <a href="" class="inline-block">
          <img src="./images/profile-sprite.png" class="h-9" alt="Recipes" />
        </a>
      </div>
    </nav>
  `;
}

}

customElements.define("site-top-navbar", SiteTopNavbar);

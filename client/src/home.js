import { DiscountList } from "/components/item-card.js";
import { tutorialStore } from "/store/tutorialStore.js";
import { authStore } from "/store/authStore.js";
import { itemStore } from "/store/itemStore.js";

authStore.subscribe((state) => {
  console.log(state);
  if (state.isCheckingAuth) {
    // loader
  } else if (state.isAuthenticated) {
    const user = state.user;

    if (user.tutorial_toggle) {
      tutorialStore.getState().start();
      // state.updateUser({ tutorial_toggle: false });
    }

    if (!state.userCoords) {
      state.getLocation();
    }

    itemStore.getState().fetchItems();
  } else {
    window.location.href = "/login-page.html";
  }
});

itemStore.subscribe((state) => {
  new DiscountList("#discounter", state.items).render();
});

authStore.getState().checkAuth();

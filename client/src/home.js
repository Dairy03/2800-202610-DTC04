import { DiscountList } from "./components/item-card.js";
import { tutorialStore } from "./store/tutorialStore.js";
import { authStore } from "./store/authStore.js";
import { itemStore } from "./store/itemStore.js";

authStore.subscribe((state) => {
  console.log('isCheckingAuth:', state.isCheckingAuth, 'isAuthenticated:', state.isAuthenticated);
  if (state.isCheckingAuth) {
    return;
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
    console.log('redirecting to login because not authenticated');
    window.location.href = "/login-page.html";
  }
});

itemStore.subscribe((state) => {
  new DiscountList("#discounter", state.items).render();
});

authStore.getState().checkAuth();

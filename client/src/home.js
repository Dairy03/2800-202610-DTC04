import { DiscountList } from "./components/item-card.js";
import { tutorialStore } from "./store/tutorialStore.js";
import { authStore } from "./store/authStore.js";
import { itemStore } from "./store/itemStore.js";

// re-runs when auth state changes 
authStore.subscribe((state) => {
  console.log('isCheckingAuth:', state.isCheckingAuth, 'isAuthenticated:', state.isAuthenticated);

  // waits until auth state is complete
  if (state.isCheckingAuth) {
    return;
  } else if (state.isAuthenticated) {
    const user = state.user;

    // starts tutorial if user has enabled it 
    if (user.tutorial_toggle) {
      tutorialStore.getState().start();
      /// state.updateUser({ tutorial_toggle: false });
    }

    // requests user location if not already retrieved
    if (!state.userCoords) {
      state.getLocation();
    }

    itemStore.getState().fetchItems();
  } else {
    // redirects to login if it is not authenticated
    console.log('redirecting to login because not authenticated');
    window.location.href = "/login-page.html";
  }
});

// re-renders discount list whenever items in store change
itemStore.subscribe((state) => {
  new DiscountList("#discounter", state.items).render();
});

authStore.getState().checkAuth();

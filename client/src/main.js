import { tutorialStore } from "./store/tutorialStore.js";
import { authStore } from "./store/authStore.js";

await authStore.getState().checkAuth();

const user = authStore.getState().user;
if (!user) throw new Error("Not authenticated");

if (user.tutorial_toggle) {
  authStore.getState().updateUser({ tutorial_toggle: false });
  tutorialStore.getState().start();
  window.addEventListener("resize", () => {
    if (tutorialStore.getState().active) tutorialStore.getState().render();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (tutorialStore.getState().active) tutorialStore.getState().render();
    },
    true,
  );
} else {
  authStore.getState().updateUser({ tutorial_toggle: false });
}

// document
//   .getElementById("start-tutorial-btn")
//   .addEventListener("click", () => tutorialStore.getState().start());

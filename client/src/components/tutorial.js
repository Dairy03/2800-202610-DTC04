import { tutorialStore } from "../store/tutorialStore";

document
  .getElementById("start-tutorial-btn")
  .addEventListener("click", () => tutorialStore.getState().start());
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

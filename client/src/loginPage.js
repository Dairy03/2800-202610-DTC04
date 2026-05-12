// Variables from:
// login-page
// login-form
// email
// password
// login-btn

import { authStore } from "./store/authStore";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { email, password } = Object.fromEntries(formData);
  const rememberMe = formData.has("rememberMe");

  try {
    await authStore.getState().login(email, password, rememberMe);
    // console.log(authStore.getState().user);
    window.location.href = "/index.html";
  } catch (error) {
    console.log(authStore.getState().error);
    console.log("Error sending POST to backend /login route: ", error);
  }
});

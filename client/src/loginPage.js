// Variables from:
// login-page
// login-form
// email
// password
// login-btn

import { authStore } from "./store/authStore";

document
  .getElementById("login-form")
  .addEventListener("submit", async (submitEvent) => {
    submitEvent.preventDefault();

    const userEmail = document.getElementById("email");
    const userPassword = document.getElementById("password");

    try {
      await authStore.getState().login({
        email: userEmail,
        password: userPassword,
        rememberMe: true,
      });
      console.log(authStore.getState().user);
      window.location.href = "/index.html";
    } catch (error) {
      console.log(authStore.getState().error)
      console.log("Error sending POST to backend /login route: ", error);
    }
  });

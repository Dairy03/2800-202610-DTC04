import { authStore } from "./store/authStore";

async function loginRequest(submitEvent) {
  submitEvent.preventDefault();
<<<<<<< Updated upstream
  const { email, password } = Object.fromEntries(
=======
  const { username, password } = Object.fromEntries(
>>>>>>> Stashed changes
    new FormData(submitEvent.target),
  );

  try {
<<<<<<< Updated upstream
    await authStore.getState().login(email, password);
=======
    await authStore.getState().login(username, password);
>>>>>>> Stashed changes
  } catch (error) {
    console.log(error);
    console.log(authStore.getState().error);
    return (window.location.href = "./login-page.html");
  }
  window.location.href = "./home.html";
}

document.getElementById("login-form").addEventListener("submit", loginRequest);

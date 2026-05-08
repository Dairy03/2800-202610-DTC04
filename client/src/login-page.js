import { authStore } from "./store/authStore";

async function loginRequest(submitEvent) {
  submitEvent.preventDefault();
  const { username, password } = Object.fromEntries(
    new FormData(submitEvent.target),
  );

  try {
    await authStore.getState().login(username, password);
  } catch (error) {
    console.log(error);
    console.log(authStore.getState().error);
    return (window.location.href = "./login-page.html");
  }
  window.location.href = "./home.html";
}

document.getElementById("login-form").addEventListener("submit", loginRequest);

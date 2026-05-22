import { authStore } from "/store/authStore";

async function loginRequest(submitEvent) {
  submitEvent.preventDefault();
  const { email, password } = Object.fromEntries(
    new FormData(submitEvent.target),
  );

  try {
    await authStore.getState().login(email, password);
  } catch (error) {
    console.log(error);
    console.log(authStore.getState().error);
    return (window.location.href = "/login-page.html");
  }
  window.location.href = "/index.html";
}

document.getElementById("login-form").addEventListener("submit", loginRequest);

import { authStore } from "/store/authStore";

// Form submission logic
async function formRequest(e) {
  e.preventDefault();
  const { fName, lName, username, email, password, password_confirm } =
    Object.fromEntries(new FormData(e.target));

  if (!(password === password_confirm)) {
    authStore.setState({ error: "Passwords do not match" });
    return;
  }

  try {
    await authStore
      .getState()
      .registerCustomer(fName, lName, username, email, password);
  } catch (error) {
    console.log(error);
    console.log(authStore.getState().error)
  }

  console.log(authStore.getState().user);
}

authStore.subscribe((state) => {
  // document.getElementById("error-message").textContent = state.error || "";
  // document.getElementById("submit-btn").disabled = state.isLoading;
});

document.getElementById("signup-form").addEventListener("submit", formRequest);

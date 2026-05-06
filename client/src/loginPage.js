// Variables from:
// login-page
// login-form
// email
// password
// login-btn

import axios from "axios";

document
  .getElementById("login-form")
  .addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();

    const userEmail = document.getElementById("email");
    const userPassword = document.getElementById("password");

    try {
      const response = axios.post("/login", {
        email: usesrEmail,
        password: userPassword,
      });

      window.location.href = "/index.html";
    } catch (error) {
      console.log("Error sending POST to backend /login route: ", error);
    }
  });

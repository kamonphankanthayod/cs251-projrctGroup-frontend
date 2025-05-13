document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = {
        firstName: document.querySelector('input[placeholder="John"]').value,
        lastName: document.querySelector('input[placeholder="Doe"]').value,
        email: document.querySelector('input[placeholder="Enter your email"]')
          .value,
        phone: document.querySelector('input[placeholder="012345678"]').value,
        address: document.querySelector('input[placeholder="Samuthparkan"]')
          .value,
        username: document.querySelector('input[placeholder="test"]').value,
        password: document.querySelector('input[placeholder="XXXXXXXX"]').value,
      };

      console.log("Registering user with:", formData);

      fetch("http://localhost:8080/member/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to create account.");
          }
        })
        .then((data) => {
          console.log("Register success:", data);
          alert("Account created successfully!");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert("An error occurred: " + error.message);
        });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.querySelector(
        'input[placeholder="Enter your username"]'
      ).value;
      const password = document.querySelector(
        'input[placeholder="XXXXXXXX"]'
      ).value;

      const loginData = {
        username: username,
        password: password,
      };

      console.log("Logging in with:", loginData);

      fetch("http://localhost:8080/member/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          console.log("Response status:", response.status);
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            throw new Error("Username or password is incorrect.");
          } else {
            throw new Error("An error occurred during login.");
          }
        })
        .then((data) => {
          console.log("Login success:", data);
          alert("Login successful!");
          window.location.href = "home.html";
        })
        .catch((error) => {
          console.error("Login error:", error);
          alert(error.message);
        });
    });
  }
});

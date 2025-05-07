document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = {
    firstName: document.querySelector('input[placeholder="John"]').value,
    lastName: document.querySelector('input[placeholder="Doe"]').value,
    email: document.querySelector('input[placeholder="Enter your email"]').value,
    phone: document.querySelector('input[placeholder="012345678"]').value,
    address: document.querySelector('input[placeholder="Samuthparkan"]').value,
    username: document.querySelector('input[placeholder="test"]').value,
    password: document.querySelector('input[placeholder="XXXXXXXX"]').value
  };

  fetch("https://your-backend.com/api/register", { // Backend Change
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to create account.");
    }
  })
  .then(data => {
    alert("Account created successfully!");
    window.location.href = "login.html";
  })
  .catch(error => {
    console.error("Error:", error);
    alert("An error occurred: " + error.message);
  });
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.querySelector('input[placeholder="Enter your username"]').value;
  const password = document.querySelector('input[placeholder="XXXXXXXX"]').value;

  const loginData = {
    username: username,
    password: password
  };

  fetch("https://your-backend.com/api/login", { // Backend Change
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      throw new Error("Username or password is incorrect.");
    } else {
      throw new Error("An error occurred during login.");
    }
  })
  .then(data => {
    alert("Login successful!");
    window.location.href = "home.html";
  })
  .catch(error => {
    alert(error.message);
    console.error("Error:", error);
  });
});


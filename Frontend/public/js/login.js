document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = {
    userName: document.querySelector('input[placeholder="John"]').value,  // Assuming you will update the placeholder
    fname: document.querySelector('input[placeholder="สมชาย"]').value,
    lname: document.querySelector('input[placeholder="ใจถึงพึ่งได้"]').value,
    email: document.querySelector('input[placeholder="Somchai@gmail.com"]').value,
    password: document.querySelector('input[placeholder="password123"]').value,
    phoneNumber: document.querySelector('input[placeholder="123-456-7890"]').value,
    address: document.querySelector('input[placeholder="ดาวอังคาร"]').value
  };

  fetch("http://localhost:8080/member/register", { // Update backend URL if necessary
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
    localStorage.setItem("memberId", data.id);
    window.location.href = "login.html";  // Redirect after successful registration
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
    userName: username,
    password: password
  };

  fetch("http://localhost:8080/member/login", { // Backend Change
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
    localStorage.setItem("memberId", data.id);
    window.location.href = "alreadyLoginHome.html";
  })
  .catch(error => {
    alert(error.message);
    console.error("Error:", error);
  });
});

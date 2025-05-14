document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.querySelector('input[placeholder="Enter your username"]').value;
  const password = document.querySelector('input[placeholder="XXXXXXXX"]').value;
  const loginData = {
    userName: username,
    password: password
  };
  console.log(loginData)
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
    console.log("Login Response:", data);
    localStorage.setItem("memberId", data.memberId);
    console.log(data.memberId)
    alert("Login successful!");
    window.location.href = "alreadyLoginHome.html";
  })
  .catch(error => {
    alert(error.message);
    console.error("Error:", error);
  });
});
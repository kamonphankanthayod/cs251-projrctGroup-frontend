document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = {
    userName: document.querySelector('input[placeholder="test"]').value,  // Assuming you will update the placeholder
    fname: document.querySelector('input[placeholder="John"]').value,
    lname: document.querySelector('input[placeholder="Doe"]').value,
    email: document.querySelector('input[placeholder="Enter your email"]').value,
    password: document.querySelector('input[placeholder="XXXXXXXX"]').value,
    phoneNumber: document.querySelector('input[placeholder="012345678"]').value,
    address: document.querySelector('input[placeholder="Samuthparkan"]').value
  };
  console.log(formData);

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

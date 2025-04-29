document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    alert(`Logging in as ${username}`);
  });
  
  document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = e.target.querySelector('input[placeholder="test"]').value;
    alert(`Account created for ${username}`);
  });
  
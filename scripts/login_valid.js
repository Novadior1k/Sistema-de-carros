function validateInput() {
    const phoneInput = document.getElementById("telefone");
    const inputValue = phoneInput.value;

  if (!/^\d+$/.test(inputValue)) {
    alert("Error: Input must be a number.");
  } else if (inputValue.length !== 11) {
    alert("Error: Input must have exactly 11 characters.");
  } else {
    alert("Input is valid.");
  }
}

function validateEmail() {
    const emailInput = document.getElementById("email");
        const emailValue = emailInput.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        console.log("Error: Invalid email address.");
    } 
    else {
        alert("Email is valid.");
    }
}

function validatePassword() {
  const passwordInput = document.getElementById("password");
  const passwordValue = passwordInput.value;

  if (passwordValue.length < 8) {
    alert("Error: Password must be at least 8 characters long.");
  } else {
    alert("Password is valid.");
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("loginPassword");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const loginPasswordToggle = document.querySelector(".login-password-toggle");

  // 👁️ Toggle visibility for login password
  loginPasswordToggle.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    loginPasswordToggle.textContent = type === "password" ? "👁️" : "🙈";
  });

  // ✅ Login button handler
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation for email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    } else if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("editorEmail", email); // store email if needed
        window.location.href = "Editor_Mainpage.html";
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  });

  // 🔁 Forgot Password - Go to separate page
  forgotPasswordLink.addEventListener("click", function () {
    window.location.href = "Forgot_Password.html";
  });
});

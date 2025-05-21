document.getElementById("loginBtn").addEventListener("click", async function () {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const role = document.getElementById("roleSelect").value;

    if (!email || !password || !role) {
        alert("Please enter all fields including role.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, role })
        });

        // Always parse the response to JSON
        const data = await response.json();

        if (response.ok) {
            // ✅ Save user info to localStorage
            localStorage.setItem("email", data.email);
            localStorage.setItem("authorName", data.name);
            localStorage.setItem("role", data.role);
            

            alert(`Welcome ${data.name}!`);

            // ✅ Redirect based on role
            if (data.role === "editor") {
                window.location.href = "Editor_Mainpage.html";
            } else if (data.role === "author") {
                window.location.href = "homepage.html";
            } else if (data.role === "ad_manager") {
                window.location.href = "admanager_homepage.html";
            } else {
                alert("Role not recognized.");
            }
        } else {
            alert("Login failed: " + (data.message || "Invalid credentials."));
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred while trying to log in.");
    }
});

// ✅ Optional: Toggle password visibility
document.querySelector(".login-password-toggle").addEventListener("click", function () {
    const passField = document.getElementById("loginPassword");
    passField.type = passField.type === "password" ? "text" : "password";
    this.textContent = passField.type === "password" ? "👁️" : "🙈";
});

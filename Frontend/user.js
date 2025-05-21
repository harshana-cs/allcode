document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSidebarLinks();
  fetchAndDisplayUsers();
});

function initSidebarLinks() {
  const menuItems = document.querySelectorAll('#admin-menu li');
  menuItems.forEach(item => {
    item.style.cursor = "pointer";
    item.addEventListener('click', () => {
      const link = item.getAttribute('data-link');
      window.location.href = link;
    });
  });
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const page = tab.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });
}

function fetchAndDisplayUsers() {
  const activeTab = document.querySelector(".tab.active").textContent.trim().toLowerCase();
  let role = activeTab.includes("author") ? "author" : activeTab.includes("editor") ? "editor" : "ad_manager";

  fetch(`http://localhost:5000/api/users/${role}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(users => {
      window.allUsers = users;
      displayUsers(users);
    })
    .catch(error => console.error("Error fetching users", error));
}

function displayUsers(users) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = users.map(user =>
    `<tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><button onclick="removeUser('${user._id}')">Remove</button></td>
    </tr>`
  ).join("");
}

function handleSidebarSearch() {
  const query = document.getElementById("sidebarSearchInput").value.trim().toLowerCase();
  const filteredUsers = window.allUsers.filter(user =>
    user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
  );
  displayUsers(filteredUsers);
}

function openModal() {
  document.getElementById("nameInput").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("passwordInput").value = "";
  document.getElementById("addUserModal").classList.remove("hidden");
}


function closeModal() {
  document.getElementById("addUserModal").classList.add("hidden");
}

// function generatePassword(length = 10) {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
//   return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
// }

function submitUser() {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  const activeTab = document.querySelector(".tab.active").textContent.trim().toLowerCase();
  let role = activeTab.includes("author") ? "author" : activeTab.includes("editor") ? "editor" : "ad_manager";

  fetch("http://localhost:5000/api/addUser", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password, role })
})
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      alert(`User added!\nName: ${data.user.name}\nEmail: ${data.user.email}`);
      closeModal();
      location.reload();
    })
    .catch(error => console.error("Error adding user", error));
}
function removeUser(userId) {
  fetch(`http://localhost:5000/api/removeUser/${userId}`, {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(() => location.reload())
    .catch(error => console.error("Error removing user", error));
}

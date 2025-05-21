document.addEventListener("DOMContentLoaded", () => {
  // Navigate to New Article page
  const createBox = document.querySelector(".create-box");
  if (createBox) {
    createBox.addEventListener("click", () => {
      window.location.href = "new.html";
    });
  }

  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const page = tab.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });

  // Sanitize HTML input (to remove tags)
  function sanitizeHTML(html) {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

 // Fetch draft articles from backend
const authorEmail = localStorage.getItem("email");
if (!authorEmail) {
  console.error("❌ Author email not found in localStorage.");
} else {
 fetch(`http://localhost:5000/api/author/author_draft?author=${encodeURIComponent(authorEmail)}`)

    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch drafts");
      return res.json();
    })
    .then(drafts => {
      const container = document.getElementById("drafts-container");
      container.innerHTML = '';

      if (drafts.length === 0) {
        container.innerHTML = '<div class="no-drafts">No draft articles available</div>';
        return;
      }

      drafts.forEach(draft => {
        const card = document.createElement("div");
        card.className = "draft-card";

        let coverImagePath = draft.coverImage && draft.coverImage.trim() !== ""
          ? `http://localhost:5000/${draft.coverImage.replace(/\\/g, "/")}`
          : "../assets/placeholder.jpg";

        const img = document.createElement("img");
        img.src = coverImagePath;
        img.alt = "Cover";
        img.className = "draft-cover";
        card.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = sanitizeHTML(draft.title);
        card.appendChild(title);

        const button = document.createElement("button");
        button.className = "continue-btn";
        button.setAttribute("data-id", draft._id);
        button.textContent = "Continue Writing";
        card.appendChild(button);

        container.appendChild(card);
      });

      // Add event listener for each "Continue Writing" button
      document.querySelectorAll(".continue-btn").forEach(button => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const id = e.target.getAttribute("data-id");
          if (id) {
            window.location.href = `new.html?id=${id}`;
          } else {
            console.error("No article ID found");
          }
        });
      });
    })
    .catch(err => {
      console.error("Error loading drafts:", err);
      const container = document.getElementById("drafts-container");
      container.innerHTML = '<div class="error-message">Failed to load drafts. Please try again later.</div>';
    });
}


  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');

  profileIcon.addEventListener('click', () => {
    profileDropdown.style.display =
      profileDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Hide dropdown if clicked outside
  document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.style.display = 'none';
    }
  });

  // Load email and role from localStorage
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const authorName= localStorage.getItem('name');

  console.log("Loaded from localStorage:", { email,authorName, role }); // Debug

  if (!email || !role) {
    profileDropdown.innerHTML = '<p>Not logged in</p>';
    return;
  }

  // Fetch user profile data from backend API
  fetch(`http://localhost:5000/api/login/profile/${encodeURIComponent(email)}`)
    .then(res => {
      console.log("Fetch response status:", res.status); // Debug response status
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
  console.log("Profile data received:", data);
  if (data.message) {
    profileDropdown.innerHTML = `<p>${data.message}</p>`;
  } else if (data.authorName && data.email && data.role) {
    
    profileDropdown.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Role:</strong> ${data.role}</p>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    profileDropdown.innerHTML = '<p>Profile data incomplete</p>';
  }
    })
    .catch(err => {
      console.error('Error fetching profile:', err);
      profileDropdown.innerHTML = '<p>Error fetching profile</p>';
    });
});

// Logout function
function logout() {
  localStorage.clear();
  window.location.href = 'Mainlogin.html';
}

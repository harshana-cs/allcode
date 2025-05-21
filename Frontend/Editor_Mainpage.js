document.addEventListener("DOMContentLoaded", function () {
  const pendingSection = document.querySelector(".section:nth-of-type(1)");
  const reviewedSection = document.querySelector(".section:nth-of-type(2)");
  const userIcon = document.querySelector(".user-icon");
  const modal = document.getElementById("profileModal");
  const logoutBtn = document.getElementById("logoutBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const emailDisplay = document.getElementById("editorEmailDisplay");

  if (!pendingSection || !reviewedSection) {
    console.error("❌ Error: Article sections missing in DOM.");
    return;
  }

 async function loadArticles() {
  try {
    const res = await fetch("http://localhost:5000/api/articles");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    let articles = await res.json();

    // Clear previous content
    pendingSection.querySelectorAll(".article").forEach(el => el.remove());
    reviewedSection.querySelectorAll(".article").forEach(el => el.remove());

    // Separate into pending and reviewed
    const pendingArticles = articles.filter(article => article.status?.toLowerCase() === "review");
    const reviewedArticles = articles.filter(article => {
      const status = article.status?.toLowerCase();
      return status === "approved" || status === "rejected";
    });

    if (!pendingArticles.length) {
      pendingSection.innerHTML = "<p>No pending articles</p>";
    } else {
      pendingArticles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const author = article.author || "Unknown Author";
        const title = article.title || "No Title";
        const id = article._id || "";

        articleDiv.innerHTML = `
          <div>
            <strong>${author}</strong><br>
            ${title}<br>
            <span class="status pending">Status: Pending</span>
          </div>
          <button class="view-button" data-id="${id}">View</button>
        `;

        pendingSection.appendChild(articleDiv);
      });
    }

    if (!reviewedArticles.length) {
      reviewedSection.innerHTML = "<p>No reviewed articles</p>";
    } else {
      reviewedArticles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        const author = article.author || "Unknown Author";
        const title = article.title || "No Title";
        const id = article._id || "";
        const status = article.status || "Unknown";

        const statusClass = status.toLowerCase() === "approved" ? "approved" : "rejected";

        articleDiv.innerHTML = `
          <div>
            <strong>${author}</strong><br>
            ${title}<br>
            <span class="status ${statusClass}">Status: ${status}</span>
          </div>
        `;

        reviewedSection.appendChild(articleDiv);
      });
    }

  } catch (error) {
    console.error("❌ Error fetching articles:", error);
    pendingSection.innerHTML = "<p>⚠️ Unable to fetch pending articles</p>";
    reviewedSection.innerHTML = "<p>⚠️ Unable to fetch reviewed articles</p>";
  }
}


  // Handle "View" button click
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-button")) {
      const articleId = e.target.getAttribute("data-id");
      if (!articleId) return console.error("❌ No article ID found");

      window.location.href = `Editor_Homepage.html?id=${articleId}`;
    }
  });

  loadArticles();

  const editorEmail = localStorage.getItem("email") || "unknown@editor.com";
const editorName = localStorage.getItem("authorName") || "Unknown";

document.getElementById("editorEmailDisplay").textContent = editorEmail;
document.getElementById("editorNameDisplay").textContent = editorName;

  userIcon.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("editorEmail");
      window.location.href = "Mainlogin.html";
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
    const articleList = document.querySelector(".article-list");
    const titleField = document.getElementById("article-title");
    const authorField = document.getElementById("article-author");
    const categoryField = document.getElementById("article-category");
    const statusField = document.getElementById("article-status");
    const dateField = document.getElementById("article-date");
    const editorTextArea = document.getElementById("article-description");

    const approveBtnRight = document.getElementById("approveButton");
    const userIcon = document.querySelector(".user-icon");
    const modal = document.getElementById("profileModal");
    const logoutBtn = document.getElementById("logoutBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const emailDisplay = document.getElementById("editorEmailDisplay");
    const searchInput = document.getElementById("articleSearchInput");
    const viewImagesBtn = document.querySelector(".view-images");
const imageDialog = document.getElementById("imageDialog");
const imageCardContainer = document.getElementById("imageCardContainer");
const closeImageDialog = document.getElementById("closeImageDialog");

    let articles = [];
    let currentArticleId = null;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedId = urlParams.get("id");
function displayStatus(status) {
  if (!status) return "Unknown Status";
  if (status.toLowerCase() === "review") return "Pending";
  return status;
}
    async function loadArticles() {
        try {
            const res = await fetch("http://localhost:5000/api/articles");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            // Filter out articles with status 'draft'
            articles = (await res.json()).filter(article => article.status.toLowerCase() !== "draft");
            articleList.innerHTML = "";
articles.forEach((article) => {
  const li = document.createElement("li");
  li.classList.add(article.status.toLowerCase());
  li.setAttribute("data-id", article._id);

  li.innerHTML = `
    <strong>${article.author || "Unknown Author"}</strong><br>
    <span>${article.title || "No Title"}</span><br>
    Status: <span class="status">${displayStatus(article.status)}</span>
  `;

  const viewBtn = document.createElement("button");
  viewBtn.classList.add("view-btn");
  viewBtn.setAttribute("data-id", article._id);
  viewBtn.textContent = "View";

  // Hide view button if article is approved
  const isApproved = article.status.toLowerCase() === "approved";
  if (isApproved) {
    viewBtn.style.display = "none";
  }

  // If selected article, hide its view button regardless of status
  if (article._id === selectedId) {
    li.classList.add("selected");
    showArticle(article);
    currentArticleId = article._id;
    viewBtn.style.display = "none";
  }

  li.appendChild(viewBtn);
  articleList.appendChild(li);
});


        } catch (error) {
            console.error("❌ Error fetching articles:", error);
            articleList.innerHTML = "<p>Failed to load articles.</p>";
        }
    }
function showArticle(article) {
    if (!article) return;

    function stripHTML(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }

    titleField.textContent = stripHTML(article.title) || "No Title";
    authorField.textContent = article.author || "Unknown Author";
    categoryField.textContent = article.category || "Uncategorized";
    statusField.textContent = article.status || "Unknown Status";

    // Format date nicely
    function formatDate(dateString) {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Date";
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
    dateField.textContent = `Date: ${formatDate(article.createdAt ?? article.date ?? "")}`;

    // Strip HTML tags from content before showing
    function stripHTML(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }
    editorTextArea.value = stripHTML(article.content || "");

    currentArticleId = article._id;
}


    articleList.addEventListener("click", async function (e) {
        const target = e.target;

        if (target.classList.contains("view-btn")) {
            const articleId = target.getAttribute("data-id");
            const selectedArticle = articles.find(a => a._id === articleId);
            if (!selectedArticle) return;

            showArticle(selectedArticle);

            const allItems = document.querySelectorAll(".article-list li");
            allItems.forEach(li => li.classList.remove("selected"));
            target.parentElement.classList.add("selected");

            allItems.forEach(li => {
                const btn = li.querySelector(".view-btn");
                if (btn) btn.style.display = "inline";
            });
            target.style.display = "none";
        }
    });

    approveBtnRight.addEventListener("click", async () => {
        console.log("Approving article with ID:", currentArticleId);
    if (!currentArticleId) {
        alert("No article selected to approve.");
        return;
    }

    const confirmApprove = confirm("Are you sure you want to approve this article?");
    if (!confirmApprove) return;

    try {
        const response = await fetch(`http://localhost:5000/api/articles/${currentArticleId}/approve`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to approve the article.");
        }

        alert("✅ Article approved successfully.");
        await loadArticles();

        // Refresh right side details
        const updatedArticle = articles.find(a => a._id === currentArticleId);
        if (updatedArticle) showArticle(updatedArticle);
    } catch (err) {
        console.error("❌ Error approving article:", err);
        alert("Failed to approve the article.");
    }
});


    document.getElementById("edit-article-btn").addEventListener("click", () => {
        if (!currentArticleId) {
            alert("No article selected to edit.");
            return;
        }

        window.location.href = `Artical_editor.html?id=${currentArticleId}`;
    });

    loadArticles();

    // Get email from localStorage (set during login)
    const editorEmail = localStorage.getItem("editorEmail") || "unknown@editor.com";
    emailDisplay.textContent = editorEmail;

    // Show modal when person icon is clicked
    userIcon.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // Hide modal
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("editorEmail");
            window.location.href = "login.html";
        }
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        const articleItems = document.querySelectorAll(".article-list li");
        articleItems.forEach(li => {
            const title = li.querySelector("span")?.textContent.toLowerCase() || "";
            const author = li.querySelector("strong")?.textContent.toLowerCase() || "";
            const status = li.querySelector(".status")?.textContent.toLowerCase() || "";

            if (title.includes(query) || author.includes(query) || status.includes(query)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });

viewImagesBtn.addEventListener("click", () => {
  if (!currentArticleId) {
    alert("No article selected.");
    return;
  }

  const selectedArticle = articles.find(article => article._id === currentArticleId);
  if (!selectedArticle) {
    alert("Selected article not found.");
    return;
  }

  const { coverImage, additionalImage1, additionalImage2 } = selectedArticle;

  const imageURLs = [
    { label: "Cover Image", url: coverImage },
    { label: "Additional Image 1", url: additionalImage1 },
    { label: "Additional Image 2", url: additionalImage2 }
  ];

  imageCardContainer.innerHTML = ""; // Clear previous content

  imageURLs.forEach(({ label, url }) => {
    const card = document.createElement("div");
    card.classList.add("image-card");

    const caption = document.createElement("p");
    caption.textContent = label;
    caption.style.fontWeight = "bold";
    caption.style.textAlign = "center";

    const img = document.createElement("img");
    img.src = url || "../assets/placeholder.jpg";
    img.alt = label;
    img.style.maxWidth = "100%";
    img.style.border = "1px solid #ccc";
    img.style.borderRadius = "8px";
    img.style.margin = "10px auto";
    img.style.display = "block";

    // ✅ Image loaded successfully
    img.onload = () => {
      console.log(`✅ ${label} loaded successfully from URL:`, img.src);
    };

    // ❌ Image failed to load
    img.onerror = () => {
      console.error(`❌ Failed to load ${label} from URL:`, img.src);
      img.src = "../assets/placeholder.jpg"; // fallback
      const errorNote = document.createElement("p");
      errorNote.textContent = "⚠️ Failed to load image.";
      errorNote.style.color = "red";
      errorNote.style.textAlign = "center";
      card.appendChild(errorNote);
    };

    card.appendChild(caption);
    card.appendChild(img);
    imageCardContainer.appendChild(card);
  });

  imageDialog.classList.remove("hidden");
});

closeImageDialog.addEventListener("click", () => {
  imageDialog.classList.add("hidden");

});
});
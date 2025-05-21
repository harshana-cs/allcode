document.addEventListener("DOMContentLoaded", async () => {
  const articleList = document.querySelector(".article-list");
  const titleField = document.getElementById("article-title");
  const authorField = document.getElementById("article-author");
  const categoryField = document.getElementById("article-category");
  const statusField = document.getElementById("article-status");
  const dateField = document.getElementById("article-date");
  const editorTextArea = document.getElementById("article-description");

  const approveBtnRight = document.getElementById("approveButton");
  const rejectBtnRight = document.getElementById("rejectButton");
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
    return status.toLowerCase() === "review" ? "Pending" : status;
  }

  async function loadArticles() {
    try {
      const res = await fetch("http://localhost:5000/api/articles");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      articles = (await res.json()).filter(a => a.status.toLowerCase() !== "draft");
      articleList.innerHTML = "";

      articles.forEach(article => {
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

  // ✅ Show "View" button only for 'review' (pending) status
  if (article.status.toLowerCase() !== "review") {
    viewBtn.style.display = "none";
  }

  if (article._id === selectedId) {
    li.classList.add("selected");
    showArticle(article);
    currentArticleId = article._id;
    viewBtn.style.display = "none"; // still hide if already selected
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

    const stripHTML = html => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const formatDate = dateString => {
      if (!dateString) return "Unknown Date";
      const date = new Date(dateString);
      return isNaN(date) ? "Invalid Date" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    };

    titleField.textContent = stripHTML(article.title) || "No Title";
    authorField.textContent = article.author || "Unknown Author";
    categoryField.textContent = article.category || "Uncategorized";
    statusField.textContent = article.status || "Unknown Status";
    dateField.textContent = `Date: ${formatDate(article.createdAt ?? article.date ?? "")}`;
    editorTextArea.value = stripHTML(article.content || "");
    currentArticleId = article._id;
  }

  articleList.addEventListener("click", e => {
    const target = e.target;
    if (target.classList.contains("view-btn")) {
      const articleId = target.getAttribute("data-id");
      const selectedArticle = articles.find(a => a._id === articleId);
      if (!selectedArticle) return;

      showArticle(selectedArticle);

      document.querySelectorAll(".article-list li").forEach(li => {
        li.classList.remove("selected");
        const btn = li.querySelector(".view-btn");
        if (btn) btn.style.display = "inline";
      });

      target.parentElement.classList.add("selected");
      target.style.display = "none";
    }
  });

  approveBtnRight.addEventListener("click", async () => {
    if (!currentArticleId) return alert("No article selected to approve.");

    const confirmApprove = confirm("Are you sure you want to approve this article?");
    if (!confirmApprove) return;

    try {
      const response = await fetch(`http://localhost:5000/api/articles/${currentArticleId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to approve the article.");
      alert("✅ Article approved successfully.");
      await loadArticles();

      const updatedArticle = articles.find(a => a._id === currentArticleId);
      if (updatedArticle) showArticle(updatedArticle);
    } catch (err) {
      console.error("❌ Error approving article:", err);
      alert("Failed to approve the article.");
    }
  });
  
rejectBtnRight.addEventListener("click", async () => {
  if (!currentArticleId) return alert("No article selected to reject.");

  const confirmReject = confirm("Are you sure you want to reject this article?");
  if (!confirmReject) return;

  try {
    const response = await fetch(`http://localhost:5000/api/articles/${currentArticleId}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Failed to reject the article.");
    alert("❌ Article rejected successfully.");
    await loadArticles();

    const updatedArticle = articles.find(a => a._id === currentArticleId);
    if (updatedArticle) showArticle(updatedArticle);
  } catch (err) {
    console.error("❌ Error rejecting article:", err);
    alert("Failed to reject the article.");
  }
});

  document.getElementById("edit-article-btn").addEventListener("click", () => {
    if (!currentArticleId) return alert("No article selected to edit.");
    window.location.href = `Artical_editor.html?id=${currentArticleId}`;
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".article-list li").forEach(li => {
      const title = li.querySelector("span")?.textContent.toLowerCase() || "";
      const author = li.querySelector("strong")?.textContent.toLowerCase() || "";
      const status = li.querySelector(".status")?.textContent.toLowerCase() || "";
      li.style.display = title.includes(query) || author.includes(query) || status.includes(query) ? "" : "none";
    });
  });

  userIcon.addEventListener("click", () => modal.classList.remove("hidden"));
  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
  logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("editorEmail");
      window.location.href = "Mainlogin.html";
    }
  });

   const editorEmail = localStorage.getItem("email") || "unknown@editor.com";
const editorName = localStorage.getItem("authorName") || "Unknown";

document.getElementById("editorEmailDisplay").textContent = editorEmail;
document.getElementById("editorNameDisplay").textContent = editorName;

  viewImagesBtn.addEventListener("click", () => {
    if (!currentArticleId) return alert("No article selected.");

    const selectedArticle = articles.find(article => article._id === currentArticleId);
    if (!selectedArticle) return alert("Selected article not found.");

    const { coverImage, additionalImage1, additionalImage2 } = selectedArticle;

    const imageURLs = [
      { label: "Cover Image", url: coverImage },
      { label: "Additional Image 1", url: additionalImage1 },
      { label: "Additional Image 2", url: additionalImage2 }
    ];

    imageCardContainer.innerHTML = "";

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

      img.onerror = () => {
        console.error(`❌ Failed to load ${label} from URL:`, img.src);
        img.src = "../assets/placeholder.jpg";
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

  loadArticles();
});

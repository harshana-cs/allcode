document.addEventListener("DOMContentLoaded", () => {
  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const page = tab.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });

  // Fetch review articles
  fetch("http://localhost:5000/api/articles/author_review")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch review articles");
      return res.json();
    })
    .then(articles => {
      const container = document.getElementById("reviews-container");
      if (!container) {
        console.error("Container with ID 'reviews-container' not found.");
        return;
      }

      container.innerHTML = ''; // clear existing content

      articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "review-card";

        const imgSrc = article.coverImage && article.coverImage.trim() !== ""
  ? article.coverImage
  : "../assets/placeholder.jpg";

        // Format updatedAt date nicely
        const date = new Date(article.updatedAt);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        card.innerHTML = `
          <img src="${imgSrc}" alt="Cover Image" class="review-cover" />
          <div class="review-content">
            <h3 class="review-title"></h3>
            <div class="review-date">Sent for review: ${formattedDate}</div>
          </div>
        `;
const tempDiv = document.createElement("div");
tempDiv.innerHTML = article.title;
const plainTitle = tempDiv.textContent || tempDiv.innerText || "";
        // Set textContent to sanitize title (remove HTML tags and formatting)
        const titleEl = card.querySelector(".review-title");
        titleEl.textContent = plainTitle;

        // Clicking card navigates to article view page
        card.addEventListener("click", () => {
          window.location.href = `view.html?id=${article._id}`;
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading review articles:", err);
    });
});
document.addEventListener("DOMContentLoaded", () => {
  // Tab navigation
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const page = tab.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });

  // Fetch review articles
  fetch("http://localhost:5000/api/author/author_review") // ✅ Fixed API route
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch review articles. Status: ${res.status}`);
      return res.json();
    })
    .then(articles => {
      const container = document.getElementById("reviews-container");
      if (!container) {
        console.error("❌ Container with ID 'reviews-container' not found.");
        return;
      }

      container.innerHTML = ''; // Clear existing content

      if (articles.length === 0) {
        container.innerHTML = "<p>No articles sent for review yet.</p>"; // ✅ Handle empty state
        return;
      }

      articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "review-card";

        const imgSrc = article.coverImage && article.coverImage.trim() !== ""
          ? article.coverImage
          : "../assets/placeholder.jpg";

        // Format updatedAt date nicely
        const date = new Date(article.updatedAt);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        card.innerHTML = `
          <img src="${imgSrc}" alt="Cover Image" class="review-cover" />
          <div class="review-content">
            <h3 class="review-title"></h3>
            <div class="review-date">Sent for review: ${formattedDate}</div>
          </div>
        `;

        // Sanitize and set the article title
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = article.title;
        const plainTitle = tempDiv.textContent || tempDiv.innerText || "";
        const titleEl = card.querySelector(".review-title");
        titleEl.textContent = plainTitle;

        // Clicking card navigates to article view page
        card.addEventListener("click", () => {
          window.location.href = `view.html?id=${article._id}`;
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("❌ Error loading review articles:", err);
    });
});
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:5000/api/articles"); // Ensure this matches your API
        const articles = await response.json();

        // Filter articles with status "Approved"
        const approvedArticles = articles.filter(article => article.status === "Approved");

        displayArticles(approvedArticles);
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
});

function displayArticles(articles) {
    const container = document.getElementById("articles-container");
    container.innerHTML = ""; // Clear previous content

    articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("article-card");

        card.innerHTML = `
            <img src="${article.coverImage}" alt="Cover">
            <h3>${article.newsTitle}</h3>
            <button onclick="previewArticle('${article._id}')">Preview</button>
            <button onclick="editArticle('${article._id}')">Edit</button>
            <button onclick="removeArticle('${article._id}')">Remove</button>

        `;
        
        container.appendChild(card);
    });
}

function previewArticle(id) {
    window.location.href = `preview.html?id=${id}`;
}

function editArticle(id) {
    window.location.href = `edit.html?id=${id}`;
}
async function removeArticle(id) {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone!")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Article removed successfully!");
            location.reload(); // Refresh the page to reflect the changes
        } else {
            alert("Error removing article. Please try again.");
        }
    } catch (error) {
        console.error("Error removing article:", error);
    }
}

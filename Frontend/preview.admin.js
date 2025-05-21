document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    try {
        const response = await fetch(`http://localhost:5000/api/articles/${id}`);
        const article = await response.json();

        document.getElementById("preview-container").innerHTML = `
            <h1>${article.newsTitle}</h1>
            <img src="${article.coverImage}" alt="Cover Image">
            <p>${article.newsDescription}</p>
            ${article.additionalImages.map(img => `<img src="${img}" width="200">`).join("")}
        `;
    } catch (error) {
        console.error("Error loading article:", error);
    }
});

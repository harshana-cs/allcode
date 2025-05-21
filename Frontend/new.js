document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id"); 
  console.log("Fetching article with ID:", articleId);

  if (articleId) {
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${articleId}`);
      if (!res.ok) throw new Error("Failed to load article data");

      const article = await res.json();

      // ✅ Load data into Quill editors
      titleQuill.root.innerHTML = article.title;
      contentQuill.root.innerHTML = article.content;

      // ✅ Load category selection
      document.getElementById("category-select").value = article.category;

      // ✅ Load Cover Image Preview
      if (article.coverImage) {
        const coverPath = `http://localhost:5000/${article.coverImage.replace(/\\/g, "/")}`;
        document.querySelector(".cover-image-preview").innerHTML =
          `<img src="${coverPath}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
      }

      // ✅ Load Additional Image Previews
      if (article.additionalImage1) {
        const img1Path = `http://localhost:5000/${article.additionalImage1.replace(/\\/g, "/")}`;
        document.getElementById("image1").parentElement.querySelector(".preview-container").innerHTML =
          `<img src="${img1Path}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
      }

      if (article.additionalImage2) {
        const img2Path = `http://localhost:5000/${article.additionalImage2.replace(/\\/g, "/")}`;
        document.getElementById("image2").parentElement.querySelector(".preview-container").innerHTML =
          `<img src="${img2Path}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
      }

    } catch (err) {
      console.error("❌ Error loading article:", err);
    }
  }

  // ✅ Setup Button Actions
  document.querySelector(".save-draft").addEventListener("click", () => submitArticle("draft"));
  document.querySelector(".send-review").addEventListener("click", () => submitArticle("review"));
});

const titleQuill = new Quill("#title-editor", {
  theme: "snow",
  placeholder: "Enter the news title...",
  modules: {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"]]
  }
});

const contentQuill = new Quill("#content-editor", {
  theme: "snow",
  placeholder: "Enter the news content...",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"]
    ]
  }
});

async function submitArticle(status) {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  const formData = new FormData();
  formData.append("title", titleQuill.root.innerHTML);
  formData.append("content", contentQuill.root.innerHTML);
  formData.append("category", document.getElementById("category-select").value);
  formData.append("status", status);
  formData.append("author", getAuthorName());


  const coverImage = document.getElementById("cover-image-input").files[0];
  const image1 = document.getElementById("image1").files[0];
  const image2 = document.getElementById("image2").files[0];

  if (coverImage) formData.append("coverImage", coverImage);
  if (image1) formData.append("additionalImage1", image1);
  if (image2) formData.append("additionalImage2", image2);

  try {
    const response = await fetch(
      articleId
        ? `http://localhost:5000/api/articles/${articleId}`
        : "http://localhost:5000/api/author/author_draft",
      {
        method: articleId ? "PUT" : "POST",
        body: formData,
      }
    );

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = JSON.parse(responseText);
    alert(result.message || "✅ Operation successful!");
  } catch (err) {
    console.error("Error submitting article:", err);
    alert("❌ Failed to submit article.");
  }
}
function getAuthorName() {
 return localStorage.getItem("authorName");
}


function previewCoverImage(event) {
  const container = document.querySelector(".cover-image-preview");
  const file = event.target.files[0];
  if (file) {
    container.innerHTML = `<img src="${URL.createObjectURL(file)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
  }
}

function previewImage(event, inputElement) {
  const previewContainer = inputElement.parentElement.querySelector(".preview-container");
  const file = event.target.files[0];
  if (file) {
    previewContainer.innerHTML = `<img src="${URL.createObjectURL(file)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
  }
}

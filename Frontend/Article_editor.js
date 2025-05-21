let currentArticleId = null;
let currentAuthor = '';
let currentCategory = '';
let coverImageUrl = '';
let additionalImage1Url = '';
let additionalImage2Url = '';
let editorInstance = null;

function getArticleIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function stripTags(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

document.addEventListener("DOMContentLoaded", () => {
  ClassicEditor
    .create(document.querySelector('#editor'), {
      toolbar: [
        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
        'imageUpload', 'blockQuote', 'insertTable', 'undo', 'redo'
      ],
    })
    .then(editor => {
      editorInstance = editor;
      loadArticle();
    })
    .catch(error => {
      console.error("CKEditor error:", error);
    });

  const editorContainer = document.querySelector("#editor");
  editorContainer.addEventListener("drop", e => {
    e.preventDefault();
    const html = e.dataTransfer.getData("text/html");
    editorInstance.model.change(writer => {
      const viewFragment = editorInstance.data.processor.toView(html);
      const modelFragment = editorInstance.data.toModel(viewFragment);
      editorInstance.model.insertContent(modelFragment);
    });
  });

  editorContainer.addEventListener("dragover", e => e.preventDefault());
});

function loadArticle() {
  currentArticleId = getArticleIdFromURL();
  if (!currentArticleId) {
    alert("❌ No article ID provided.");
    return;
  }

  fetch(`http://localhost:5000/api/articles/${currentArticleId}`)
    .then(response => {
      if (!response.ok) throw new Error("Article not found.");
      return response.json();
    })
    .then(article => {
      document.getElementById("titleInput").value = stripTags(article.title || '');
      editorInstance.setData(article.content || '');

      currentAuthor = article.author || 'Unknown Author';

      currentCategory = article.category || 'Uncategorized';
      const categoryInput = document.getElementById("categoryInput");
      if (categoryInput) categoryInput.value = currentCategory;

      coverImageUrl = article.coverImage || '';
      additionalImage1Url = article.additionalImage1 || '';
      additionalImage2Url = article.additionalImage2 || '';

      const imageGallery = document.getElementById("imageGallery");
      imageGallery.innerHTML = "";

      const images = [
        { label: "Cover Image", url: coverImageUrl },
        { label: "Additional Image 1", url: additionalImage1Url },
        { label: "Additional Image 2", url: additionalImage2Url }
      ];

      images.forEach(({ label, url }) => {
        if (url) {
          const img = document.createElement("img");
          img.src = url;
          img.alt = label;
          img.draggable = true;
          img.style.height = "100px";
          img.style.borderRadius = "8px";
          img.title = `Drag to insert: ${label}`;
          imageGallery.appendChild(img);

          img.addEventListener("dragstart", e => {
            const imgHTML = `<div class="image-with-text">
                              <img src="${img.src}" alt="${label}" />
                              <span>${label}</span>
                            </div>`;
            e.dataTransfer.setData("text/html", imgHTML);
          });
        }
      });
    })
    .catch(err => {
      console.error("Failed to load article:", err);
      alert("⚠️ Failed to load article.");
    });
}

function saveArticle() {
  let updatedTitle = document.getElementById("titleInput").value.trim();
  updatedTitle = stripTags(updatedTitle);

  const updatedContent = editorInstance.getData().trim();
  const author = currentAuthor;

  const categoryInput = document.getElementById("categoryInput");
  const category = categoryInput ? categoryInput.value.trim() : currentCategory;

  if (!updatedTitle || !updatedContent) {
    alert("⚠️ Title and content cannot be empty.");
    return;
  }

  const payload = {
    title: updatedTitle,
    content: updatedContent,
    author: author,
    category: category,
    coverImage: coverImageUrl,
    additionalImage1: additionalImage1Url,
    additionalImage2: additionalImage2Url
  };

  console.log("Sending update payload:", payload);

  // ✅ Use PUT with current article ID
  fetch(`http://localhost:5000/api/articles/${currentArticleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed with status " + res.status);
      return res.json();
    })
    .then(data => {
      if (data.message?.includes('updated')) {
        alert("✅ Article updated successfully.");
      } else {
        alert("⚠️ Something unexpected happened.");
        console.warn(data);
      }
    })
    .catch(err => {
      console.error("Update failed:", err);
      alert("❌ Failed to save edited article.");
    });
}

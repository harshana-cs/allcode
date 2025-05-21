// Initialize Quill Editors
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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".discard").addEventListener("click", () => submitArticle("discard"));
  document.querySelector(".save").addEventListener("click", () => submitArticle("save"));
});

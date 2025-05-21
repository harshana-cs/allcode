document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      const page = tab.getAttribute("data-page");
      if (page) {
        window.location.href = page; // Redirect to the corresponding page
      }
    });
  });
});

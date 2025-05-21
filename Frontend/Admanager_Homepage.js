document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const continueButton = document.querySelector('.continue-btn');
    const uploadArea = document.querySelector('.image-upload-area');
    const uploadTab = document.getElementById('upload-tab');
    const viewTab = document.getElementById('view-tab');
    const userIcon = document.getElementById('userIcon');
    const profileModal = document.getElementById('profileModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    let selectedImageFile = null;

    // Redirect to View Ads page
    if (viewTab) {
        viewTab.addEventListener('click', function () {
            window.location.href = 'Admanager_manager.html';
        });
    }

    // Prefill form if draft exists
    const draft = JSON.parse(localStorage.getItem('adDataDraft'));
    if (draft) {
        document.querySelector('.form-control[placeholder="Ad Title"]').value = draft.title;
        document.querySelector('.form-control[placeholder="Ad website link"]').value = draft.websiteLink;
        document.getElementById('positionSelect').value = draft.position;

        const radios = document.querySelectorAll('input[name="duration"]');
        radios.forEach(r => {
            if (draft.duration.includes(r.nextSibling.textContent.trim())) {
                r.checked = true;
            }
        });

        uploadArea.style.backgroundImage = `url('${draft.imageBase64}')`;
        uploadArea.style.backgroundSize = 'cover';
        uploadArea.style.backgroundPosition = 'center';

        // Convert base64 to File object
        fetch(draft.imageBase64)
            .then(res => res.blob())
            .then(blob => {
                selectedImageFile = new File([blob], "restored-image.jpg", { type: blob.type });
            });
    }

    // Image upload handling
    if (uploadArea) {
        uploadArea.addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            fileInput.click();

            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    selectedImageFile = file;
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        uploadArea.style.backgroundImage = `url('${e.target.result}')`;
                        uploadArea.style.backgroundSize = 'cover';
                        uploadArea.style.backgroundPosition = 'center';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert("Please select a valid image file.");
                }
            });
        });
    }

    // Continue button click handler
    if (continueButton) {
        continueButton.addEventListener('click', function () {
            const title = document.querySelector('.form-control[placeholder="Ad Title"]')?.value;
            const websiteLink = document.querySelector('.form-control[placeholder="Ad website link"]')?.value;
            const position = document.getElementById('positionSelect')?.value;
            const durationInput = document.querySelector('input[name="duration"]:checked');
            const duration = durationInput ? durationInput.nextSibling.textContent.trim() : null;

            if (!title || !websiteLink || !position || !duration || !selectedImageFile) {
                alert("Please fill in all fields and upload an image before proceeding.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const adData = {
                    title: title,
                    websiteLink: websiteLink,
                    position: position,
                    duration: duration,
                    imageBase64: e.target.result
                };

                localStorage.setItem('adData', JSON.stringify(adData));
                localStorage.setItem('adDataDraft', JSON.stringify(adData));

                window.location.href = 'Admanager_Summary.html';
            };
            reader.readAsDataURL(selectedImageFile);
        });
    }

    // Profile modal toggle and user info
    // Load from localStorage or use defaults
const authorName = localStorage.getItem("authorName") || "Ram Shrestha";
const email = localStorage.getItem("email") || "example@example.com";

editorNameDisplay.textContent = authorName;
editorEmailDisplay.textContent = email;
    userIcon?.addEventListener('click', () => {
        profileModal?.classList.toggle('hidden');
    });

    cancelBtn?.addEventListener('click', () => {
        profileModal?.classList.add('hidden');
    });

    logoutBtn?.addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem("authorName");
            localStorage.removeItem("email");
            window.location.href = "Mainlogin.html";
        }
    });

});

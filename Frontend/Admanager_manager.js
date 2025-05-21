document.addEventListener('DOMContentLoaded', async function () {
    const liveAdsSection = document.querySelector('.live-ads');
    const recentAdsSection = document.querySelector('.recent-ads');
    const uploadTab = document.getElementById('upload-tab');

    // Redirect to homepage.html when "Upload Ad" tab is clicked
    if (uploadTab) {
        uploadTab.addEventListener('click', () => {
            window.location.href = 'Admanager_Homepage.html';
        });
    }

    // Reset ad sections
    liveAdsSection.innerHTML = '<h2>Live Ads</h2>';
    recentAdsSection.innerHTML = '<h2>Recent Ads</h2>';

    try {
        const res = await fetch('http://localhost:5000/api/ads');
        const ads = await res.json();

        const today = new Date();

        ads.forEach(ad => {
            const createdDate = new Date(ad.createdAt);
            const daysPassed = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
            const isActive = daysPassed < ad.duration;

            const adItem = document.createElement('div');
            adItem.classList.add('ad-item');

            const formattedDate = createdDate.toLocaleDateString();

            if (isActive) {
                adItem.innerHTML = `
                    <p><strong>${formattedDate}</strong></p>
                    <p>${ad.title}</p>
                    <p><span class="location ${ad.position?.toLowerCase()}">${ad.position}</span></p>
                    <p>Time Remaining: <span class="time-remaining">${daysPassed}/${ad.duration} days</span></p>
                `;
                liveAdsSection.appendChild(adItem);
            } else {
                adItem.innerHTML = `
                    <p><strong>${formattedDate}</strong></p>
                    <p>${ad.title}</p>
                    <p><span class="location ${ad.position?.toLowerCase()}">${ad.position}</span></p>
                    <p>Expired after: ${ad.duration} Days</p>
                `;
                recentAdsSection.appendChild(adItem);
            }
        });
    } catch (err) {
        console.error('Error fetching ads:', err);
    }
});
// Toggle profile modal
const userIcon = document.getElementById('userIcon');
const profileModal = document.getElementById('profileModal');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Dummy editor email (you can set this dynamically later)
document.getElementById('editorEmailDisplay').textContent = 'editor@example.com';

userIcon.addEventListener('click', () => {
    profileModal.classList.toggle('hidden');
});

cancelBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
});

// Logout
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("editorEmail");
      window.location.href = "login.html";
    }
  });
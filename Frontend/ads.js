document.addEventListener("DOMContentLoaded", async () => {
    const adsContainer = document.getElementById("ads-container");

    // Fetch ads from backend
    const response = await fetch("http://localhost:5000/ads");
    const ads = await response.json();

    ads.forEach(ad => {
        const adCard = document.createElement("div");
        adCard.classList.add("ad-card");

        adCard.innerHTML = `
<img src="http://localhost:5000${ad.imageUrl}" alt="${ad.title}" class="ad-image"/>
            <h3>${ad.title}</h3>
            <p>Duration: ${ad.duration} days</p>
            <a href="${ad.websiteLink}" target="_blank">Visit Ad</a>
            <button class="remove-btn" data-id="${ad._id}">Remove</button>
        `;

        adsContainer.appendChild(adCard);

        console.log("Image URL:", ad.imageUrl);

    });

    // Remove ad functionality
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const adId = button.getAttribute("data-id");
            await fetch(`http://localhost:5000/ads/${adId}`, { method: "DELETE" });
            button.parentElement.remove();
        });
    });
});

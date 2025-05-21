// Function to show modal
const dateElement = document.getElementById("date");
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  dateElement.textContent = formattedDate;

  // Get location using IP geolocation API
  const locationElement = document.getElementById("location");
  fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(data => {
      locationElement.textContent = `${data.city}, ${data.country_name}`;
    })
    .catch(error => {
      console.error("Error fetching location:", error);
      locationElement.textContent = "Location unavailable";
    });
function showModal() {
    document.getElementById('noResultsModal').style.display = 'block';
  
    // Close the modal automatically after 3 seconds
    setTimeout(function() {
      closeModal();
    }, 3000); // 3000ms = 3 seconds
  }
  
  // Function to close modal
  function closeModal() {
    document.getElementById('noResultsModal').style.display = 'none';
  }
  
  
  function searchNews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        // Check if the search term is empty
        if (searchTerm === "") {
          // Display a message prompting the user to enter something
          alert("Please enter something");
          return; // Stop the function if nothing is entered
      }
    const categories = document.querySelectorAll('.news-category');
    let resultsFound = false;
  
    // Loop through all categories to match the search term
    categories.forEach(category => {
        const categoryId = category.id.toLowerCase();
      
        if (categoryId.includes(searchTerm)) {
            // If category ID matches the search term, show the category
            category.style.display = 'block';
            resultsFound = true;
        } else {
            // Hide categories that don't match
            category.style.display = 'none';
        }
        
        // Now filter articles within the visible category based on search
        const articles = category.querySelectorAll('.news-item');
        articles.forEach(article => {
            const title = article.querySelector('h4').innerText.toLowerCase();
            const content = article.querySelector('.short-desc').innerText.toLowerCase();

            // If the article's title or content matches the search term, show the article
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                article.style.display = 'block';
                resultsFound = true;
            } else {
                article.style.display = 'none';
            }
        });
    });

    // If no results found, show the modal
    if (!resultsFound) {
        showModal();
    } else {
        closeModal();
    }
}

  
  
  window.addEventListener('DOMContentLoaded', function() {
    loadCategory('home');
  });
  
  function filterByCategory(category) {
    // Hide all categories
    const allCategories = document.querySelectorAll('.news-category');
    allCategories.forEach(cat => cat.style.display = 'none');
  
    // Show the selected category
    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
      selectedCategory.style.display = 'block';
    }
    
    // Reset the search input to make sure it filters within the selected category
    document.getElementById('searchInput').value = ''; // Optional
    searchNews(); // Trigger search function to filter within the selected category
  }


// Load Category (Placeholder function)
function loadCategory(category) {
    console.log(`Loading category: ${category}`);
}

// Open and close the authentication modal
function openAuthModal() {
    document.getElementById("authModal").style.display = "flex";

    // Initially hide all forms and show only the login form
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const passwordResetMessage = document.getElementById("passwordResetMessage");

    loginForm.style.display = "block";
    signupForm.style.display = "none"; // Initially hide signup form
    forgotPasswordForm.style.display = "none"; // Initially hide forgot password form
    passwordResetMessage.style.display = "none"; // Initially hide password reset confirmation
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

// Switch between login, signup, and forgot password forms
function toggleForm(formType) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const passwordResetMessage = document.getElementById("passwordResetMessage");

    // Hide all forms first
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    forgotPasswordForm.style.display = "none";
    passwordResetMessage.style.display = "none";

    // Show the selected form
    if (formType === 'signup') {
        signupForm.style.display = "block";
    } else if (formType === 'forgotPassword') {
        forgotPasswordForm.style.display = "block";
    } else if (formType === 'passwordResetMessage') {
        passwordResetMessage.style.display = "block";
    } else {
        loginForm.style.display = "block";
    }
}

// Toggle the password visibility
function togglePassword(inputId, iconElement) {
    const inputField = document.getElementById(inputId);
    const icon = iconElement;

    // Toggle password visibility
    if (inputField.type === "password") {
        inputField.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        inputField.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}
function validateLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailError.textContent = "";
    passwordError.textContent = "";

    let isValid = true;

    if (email === "") {
        emailError.textContent = "Please enter your email";
        isValid = false;
    }

    if (password === "") {
        passwordError.textContent = "Please enter your password";
        isValid = false;
    }

    if (!isValid) return false;

    // Now, send the login data to the backend
    loginUser(email, password);

    return true;
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    validateLogin();
});
// function showPopup(message, type = "success") {
//     const popup = document.getElementById("popupMessage");
//     const popupText = document.getElementById("popupText");

//     popupText.textContent = message;
//     popup.className = `popup show ${type}`;

//     setTimeout(() => {
//         popup.classList.remove("show");
//     }, 3000); // Auto hide after 3 seconds
// }

async function loginUser(email, password) {
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to login');
        }

        // 🎉 Show success popup
        Swal.fire({
            title: "Login Successful!",
            text: "Welcome back!",
            icon: "success",
            confirmButtonColor: "#3085d6"
        }).then(() => {
            // Redirect to index2.html after the success popup is closed
            window.location.href = "index2.html";
        });

    } catch (error) {
        // ❌ Show error popup
        Swal.fire({
            title: "Login Failed!",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#3085d6"
        });
    }
}

// function validateLogin() {
//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;
//     const emailError = document.getElementById("emailError");
//     const passwordError = document.getElementById("passwordError");

//     emailError.textContent = "";
//     passwordError.textContent = "";

//     let isValid = true;

//     if (email === "") {
//         emailError.textContent = "Please enter your email";
//         isValid = false;
//     }

//     if (password === "") {
//         passwordError.textContent = "Please enter your password";
//         isValid = false;
//     }

//     if (!isValid) return false;

//     // Now, send the login data to the backend
//     loginUser(email, password);

//     return true;
// }
// document.getElementById("loginForm").addEventListener("submit", function (e) {
//     e.preventDefault();
//     validateLogin();
// });
// async function loginUser(email, password) {
//     try {
//         console.log("➡️ Sending login data:", { email, password }); // Log the data to verify
//         const response = await fetch("http://localhost:5000/api/auth/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to login');
//         }

//         const result = await response.json();
//         console.log("Login response:", result);
//     } catch (error) {
//         console.error("Error during login:", error);
//     }
// }


// async function handleSignup() {
//     const name = document.querySelector('#signupForm input[placeholder="Full Name"]').value;
//     const phone = document.querySelector('#signupForm input[placeholder="Enter Your Phone Number"]').value;
//     const email = document.querySelector('#signupForm input[placeholder="Enter Your Email"]').value;
//     const password = document.getElementById("signupPassword").value;
//     const confirmPassword = document.getElementById("signupConfirmPassword").value;

//     if (!name || !phone || !email || !password || !confirmPassword) {
//         Swal.fire("Error", "Please fill in all fields.", "error");
//         return;
//     }

//     if (password !== confirmPassword) {
//         Swal.fire("Error", "Passwords do not match.", "error");
//         return;
//     }

//     // Validate email format
//     const emailPattern = /\S+@\S+\.\S+/;
//     if (!emailPattern.test(email)) {
//         Swal.fire("Error", "Please enter a valid email address.", "error");
//         return;
//     }

//     // Check password length
//     if (password.length < 6) {
//         Swal.fire("Error", "Password must be at least 6 characters long.", "error");
//         return;
//     }

//     try {
//         const res = await fetch("http://localhost:5000/api/auth/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name, phone, email, password })
//         });

//         const data = await res.json();
//         if (res.ok) {
//             Swal.fire("Success!", "Signup successful!", "success");
//         } else {
//             Swal.fire("Error", data.message || "Signup failed", "error");
//         }
//     } catch (err) {
//         Swal.fire("Error", "Server error.", "error");
//     }
// }


// async function registerUser(email, password) {
//     try {
//         const response = await fetch("http://localhost:5000/api/auth/register", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (response.status === 201) {
//             alert("✅ User registered successfully!");
//         } else {
//             alert(data.message || "Registration failed.");
//         }
//     } catch (err) {
//         console.error("Error during registration:", err);
//         alert("Registration error");
//     }
// }



async function handleSignup() {
    const name = document.querySelector('#signupForm input[placeholder="Full Name"]').value;
    const phone = document.querySelector('#signupForm input[placeholder="Enter Your Phone Number"]').value;
    const email = document.querySelector('#signupForm input[placeholder="Enter Your Email"]').value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;

    if (!name || !phone || !email || !password || !confirmPassword) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match.", "error");
        return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
        Swal.fire("Error", "Please enter a valid email address.", "error");
        return;
    }

    if (password.length < 6) {
        Swal.fire("Error", "Password must be at least 6 characters long.", "error");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, password })
        });

        const data = await res.json();
        localStorage.setItem("userEmail", email); 
        if (res.ok) {
            Swal.fire({
                title: "Success!",
                text: "Signup successful!",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                // Redirect to index2.html
                window.location.href = "index2.html";
            });
        } else {
            Swal.fire("Error", data.message || "Signup failed", "error");
        }
    } catch (err) {
        Swal.fire("Error", "Server error.", "error");
    }
}
document.addEventListener("DOMContentLoaded", () => {
  const articleFeed = document.getElementById("article-feed");
  const fullContainer = document.getElementById("full-article-container");
  const backBtn = document.getElementById("back-btn");

  const fullTitle = document.getElementById("full-title");
  const fullImage = document.getElementById("full-image");
  const fullAuthorDate = document.getElementById("full-author-date");
  const fullDescriptionText = document.getElementById("full-description-text");

  const readMoreLinks = document.querySelectorAll(".read-more");

  readMoreLinks.forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault();

      const articleCard = this.closest(".article-card");

      fullTitle.innerText = articleCard.querySelector("h4").innerText;
      fullImage.src = articleCard.querySelector("img").src;
      fullAuthorDate.innerText = articleCard.querySelector(".time-country").innerText;
      fullDescriptionText.innerHTML = articleCard.querySelector(".full-description").innerHTML;

      articleFeed.style.display = "none";      // ✅ hide all article cards
      fullContainer.style.display = "block";   // ✅ show full article
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      fullContainer.style.display = "none";   // ✅ hide full article
      articleFeed.style.display = "flex";     // ✅ show article cards
    });
  }
});






async function loadApprovedNews() {
  try {
    const response = await fetch('http://localhost:5000/news/approved-news');
    const newsData = await response.json();

    const newsContainer = document.querySelector('.news-container');
    newsContainer.innerHTML = '';

    let fullNewsContainer = document.querySelector('.full-news');
    if (!fullNewsContainer) {
      fullNewsContainer = document.createElement("div");
      fullNewsContainer.classList.add("full-news");
      fullNewsContainer.style.display = "none";
      document.body.appendChild(fullNewsContainer);
    }

    newsData.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('news-item');
      newsItem.innerHTML = `
      <h4>${news.title}</h4>
      <img src="${news.coverImage || 'https://via.placeholder.com/150'}" alt="News Image">
      <p class="short-desc">${news.content.slice(0, 100)}...</p>
      <p class="time-country">Published by ${news.author} on ${new Date(news.createdAt).toLocaleDateString()}</p>
      <a href="#" class="read-more">Read More</a>
      <div class="full-content" style="display:none;">
        <p>${news.content}</p>
      </div>
    `;

      newsContainer.appendChild(newsItem);

      const readMoreLink = newsItem.querySelector('.read-more');
      const fullContent = newsItem.querySelector('.full-content');
      readMoreLink.addEventListener('click', function (event) {
        event.preventDefault();
        const isVisible = fullContent.style.display === "block";
        fullContent.style.display = isVisible ? "none" : "block";
        readMoreLink.textContent = isVisible ? "Read More" : "Read Less";
      });

      newsItem.addEventListener("click", function (event) {
        if (event.target.classList.contains("read-more")) return;

        fullNewsContainer.innerHTML = `
  <button id="back-btn">← Back</button>
  <div class="full-news-content">
    <h2>${news.title}</h2>
    <img src="${news.coverImage || 'https://via.placeholder.com/150'}" alt="News Image">
    <p class="time-country">Published by ${news.author} on ${new Date(news.createdAt).toLocaleDateString()}</p>
    <p>${news.content} More details about the news will appear here...</p>
  </div>
  <div id="popup-ad" class="popup-ad">
    <div class="popup-content">
      <button id="close-popup" class="close-btn">&times;</button>
      <a href="https://www.booking.com/" target="_blank">
        <img src="http://localhost:5000/uploads/1747234988889.jpg" alt="Advertisement">
      </a>
    </div>
  </div>
`;


        document.querySelector("main").style.display = "none";
        fullNewsContainer.style.display = "block";

        const popup = fullNewsContainer.querySelector('#popup-ad');
        const closeBtn = fullNewsContainer.querySelector('#close-popup');

        popup.style.display = 'flex';
        closeBtn.addEventListener('click', () => popup.style.display = 'none');
        setTimeout(() => popup.style.display = 'none', 7000);

        fullNewsContainer.querySelector('#back-btn').addEventListener('click', () => {
          fullNewsContainer.style.display = 'none';
          document.querySelector("main").style.display = "block";
        });
      });
    });

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

// Category filter function
function loadCategory(category) {
  const categories = document.querySelectorAll('.news-category');
  categories.forEach(cat => cat.style.display = 'none');

  const selectedCategory = document.getElementById(category);
  if (selectedCategory) {
    selectedCategory.style.display = 'block';
  }
}

// Load everything on page load
document.addEventListener("DOMContentLoaded", function () {
  loadApprovedNews();

  // Load top ad
  fetch('http://localhost:5000/api/ads/top')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch top ad');
      return response.json();
    })
    .then(ad => {
      const imageElement = document.getElementById('top-ad-image');
      const labelElement = document.getElementById('top-ad-label');

      imageElement.src = ad.imageUrl.startsWith('http') 
        ? ad.imageUrl 
        : `http://localhost:5000${ad.imageUrl}`;

      if (ad.websiteLink) {
        const link = document.createElement('a');
        link.href = ad.websiteLink;
        link.target = '_blank';
        imageElement.parentNode.replaceChild(link, imageElement);
        link.appendChild(imageElement);
      }

      if (ad.title) labelElement.textContent = ad.title;
    })
    .catch(error => console.error('Error loading top ad:', error));

  // Load bottom ad
  fetch('http://localhost:5000/api/ads/bottom')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch bottom ad');
      return response.json();
    })
    .then(ad => {
      const imageElement = document.getElementById('bottom-ad-image');
      const labelElement = document.getElementById('bottom-ad-label');

      imageElement.src = ad.imageUrl.startsWith('http') 
        ? ad.imageUrl 
        : `http://localhost:5000${ad.imageUrl}`;

      if (ad.websiteLink) {
        const link = document.createElement('a');
        link.href = ad.websiteLink;
        link.target = '_blank';
        imageElement.parentNode.replaceChild(link, imageElement);
        link.appendChild(imageElement);
      }

      if (ad.title) labelElement.textContent = ad.title;
    })
    .catch(error => console.error('Error loading bottom ad:', error));
});

    







// async function loadApprovedNews() {
//     try {
//       const response = await fetch('http://localhost:5000/news/approved-news'); // Fetching approved news
//       const newsData = await response.json();
  
//       // Assuming you have a container to display the news
//       const newsContainer = document.querySelector('.news-container');
//       newsContainer.innerHTML = ''; // Clear any previous content
  
//       // Loop through each news item and create HTML elements
//       newsData.forEach(news => {
//         const newsItem = document.createElement('div');
//         newsItem.classList.add('news-item');
//         newsItem.innerHTML = `
//           <h4>${news.newsTitle}</h4>
//           <img src="https://via.placeholder.com/150" alt="News Image"> <!-- Placeholder for images -->
//           <p class="short-desc">${news.newsDescription}</p>
//           <p class="time-country">Published by ${news.author} on ${new Date(news.date).toLocaleDateString()}</p>
//           <a href="#" class="read-more">Read More</a>
//           <div class="full-content" style="display:none;">
//             <p>${news.newsDescription}</p> <!-- Assuming full content is the same as the description -->
//           </div>
//         `;
  
//         // Append each news item to the container
//         newsContainer.appendChild(newsItem);
//       });
  
//       // Now you can bind the "Read More" functionality as well
//       const readMoreLinks = document.querySelectorAll('.read-more');
//       readMoreLinks.forEach((link) => {
//         link.addEventListener('click', function (event) {
//           event.preventDefault();
//           const fullContent = this.nextElementSibling; // The next element is the full content div
//           if (fullContent.style.display === "none" || fullContent.style.display === "") {
//             fullContent.style.display = "block";
//             this.textContent = "Read Less";
//           } else {
//             fullContent.style.display = "none";
//             this.textContent = "Read More";
//           }
//         });
//       });
//     } catch (error) {
//       console.error('Error fetching news:', error);
//     }
//   }

// function loadCategory(category) {
//     // Hide all news categories
//     const categories = document.querySelectorAll('.news-category');
//     categories.forEach(cat => cat.style.display = 'none');

//     // Show the selected category only if it exists
//     const selectedCategory = document.getElementById(category);
//     if (selectedCategory) {
//         selectedCategory.style.display = 'block';
//     }
// }

// // Function to show full content on clicking the 'Read More' link
// function showFullContent(newsId) {
//     var fullContent = document.getElementById('full-content-' + newsId);
    
//     // Toggle the display of the full content
//     if (fullContent.style.display === "none" || fullContent.style.display === "") {
//         fullContent.style.display = "block";  // Show the full content
//     } else {
//         fullContent.style.display = "none";  // Hide the full content
//     }
// }

// document.addEventListener("DOMContentLoaded", function () {
//     // Function to load the selected category
//     function loadCategory(category) {
//         const categories = document.querySelectorAll('.news-category');
//         categories.forEach(cat => cat.style.display = 'none'); // Hide all categories

//         const selectedCategory = document.getElementById(category);
//         if (selectedCategory) {
//             selectedCategory.style.display = 'block'; // Show the selected category
//         }
//     }

//     // Function to show full content on clicking the 'Read More' link
//     function showFullContent(newsId) {
//         var fullContent = document.getElementById('full-content-' + newsId);
        
//         // Toggle the display of the full content
//         if (fullContent.style.display === "none" || fullContent.style.display === "") {
//             fullContent.style.display = "block";  // Show the full content
//         } else {
//             fullContent.style.display = "none";  // Hide the full content
//         }
//     }

//     // Handling news item clicks and toggling full content
//     const newsItems = document.querySelectorAll(".news-item");
//     const fullNewsContainer = document.createElement("div");
//     fullNewsContainer.classList.add("full-news");
//     document.body.appendChild(fullNewsContainer);

//     newsItems.forEach((item) => {
//         item.addEventListener("click", function () {
//             const title = this.querySelector("h4").textContent;
//             const imgSrc = this.querySelector("img").src;
//             const description = this.querySelector(".short-desc").textContent;
//             const timeCountry = this.querySelector(".time-country").innerHTML;

//             fullNewsContainer.innerHTML = `
//                 <button id="back-btn">← Back</button>
//                 <div class="full-news-content">
//                     <h2>${title}</h2>
//                     <img src="${imgSrc}" alt="News Image">
//                     <p class="time-country">${timeCountry}</p>
//                     <p>${description} More details about the news will appear here...</p>
//                 </div>
//             `;

//             document.querySelector("main").style.display = "none"; // Hide main content
//             fullNewsContainer.style.display = "block"; // Show full news content

//             // Event listener for the back button
//             document.querySelector("#back-btn").addEventListener("click", function () {
//                 fullNewsContainer.style.display = "none";
//                 document.querySelector("main").style.display = "block"; // Show the main news list
//             });
//         });
//     });

//     // Handling 'Read More' links to toggle full content visibility
//     const readMoreLinks = document.querySelectorAll(".read-more");

//     readMoreLinks.forEach((link) => {
//         link.addEventListener("click", function () {
//             const fullContent = this.nextElementSibling; // Assuming the full content is the next sibling of the link

//             if (fullContent.style.display === "none" || fullContent.style.display === "") {
//                 fullContent.style.display = "block";
//                 this.textContent = "Read Less"; // Change link text to "Read Less"
//             } else {
//                 fullContent.style.display = "none";
//                 this.textContent = "Read More"; // Change link text to "Read More"
//             }
//         });
//     });
// });

getUserProfile();
// function loadCategory(category) {
//     // Hide all categories
//     const allCategories = document.querySelectorAll('.category-content');
//     allCategories.forEach(categorySection => {
//         categorySection.style.display = 'none';
//     });

//     // Show the selected category
//     const selectedCategory = document.getElementById(category);
//     if (selectedCategory) {
//         selectedCategory.style.display = 'block';
//     }

//     // Optional: You can load content dynamically based on the category.
//     // For example, an API call or change content based on the category.
//     updateContent(category);
// }

// function openModal(title, content, imageSrc) {
//     document.getElementById('modal-title').innerText = title;
//     document.getElementById('modal-content').innerText = content;
//     document.getElementById('modal-image').src = imageSrc;

//     // Display the modal
//     document.getElementById('news-modal').style.display = "block";
// }

// // Close modal when the close button is clicked
// document.getElementById('close-modal').onclick = function() {
//     document.getElementById('news-modal').style.display = "none";
// }

// // Close modal if the user clicks outside of the modal content
// window.onclick = function(event) {
//     if (event.target === document.getElementById('news-modal')) {
//         document.getElementById('news-modal').style.display = "none";
//     }
// }

// function showFullContent() {
//     document.querySelector('.summary-content').style.display = 'none';
//     document.querySelector('.full-content').style.display = 'block';
// }

// function hideFullContent() {
//     document.querySelector('.summary-content').style.display = 'block';
//     document.querySelector('.full-content').style.display = 'none';
// }
// // // API Keys and URLs
// const newsApiKey = '4c0824ec9fa144c496272bdb9d5ef991'; // News API Key (International)
// const nepaliApiKey = 'pub_76850b614c020cb2a7494b1a9df04eb08e0ed'; // Nepali API Key (Kathmandu & Culture)
// const nasaApiKey = 'wCRwO2GXG49O269XEBQTB5IOHP5sSIa4lyNBvQPe'; // NASA API Key (Earth Images)

// const newsApiUrl = 'https://newsapi.org/v2/top-headlines';
// const nepaliApiUrl = 'https://newsdata.io/api/1/news'; // Corrected endpoint for fetching Nepali news articles
// const nasaApiUrl = 'https://api.nasa.gov/planetary/earth/imagery'; // NASA Earth API

// // Fetch and display news based on the selected category
// function loadCategory(category) {
//     updateActiveNav(category); // Highlight active category
//     let url = '';

//     if (category === 'kathmandu' || category === 'culture') {
//         // Nepali API for Kathmandu & Culture
//         url = `${nepaliApiUrl}?apikey=${nepaliApiKey}&country=np`; // Corrected query to fetch news articles for Nepal
//     } else if (category === 'earth') {
//         // NASA API for Earth category (Image response)
//         url = `${nasaApiUrl}?lon=85.3240&lat=27.7172&dim=0.1&api_key=${nasaApiKey}`;
//     } else {
//         // News API for other categories
//         const categoryParam = getCategoryQuery(category);
//         url = `${newsApiUrl}?country=us${categoryParam}&apiKey=${newsApiKey}`;
//     }

//     console.log('Fetching URL:', url); // Debugging

//     fetch(url, { headers: { 'Accept': 'application/json' } })
//         .then(response => {
//             console.log('Raw response:', response);
//             if (!response.ok) {
//                 throw new Error(`API Error: ${response.status} - ${response.statusText}`);
//             }

//             // NASA API returns an image, so handle it differently
//             if (category === 'earth') {
//                 return response.blob(); // Convert response to binary image data
//             } else {
//                 return response.json(); // Convert to JSON for news APIs
//             }
//         })
//         .then(data => {
//             console.log('API Response:', data); // Debugging
//             let articles = [];

//             if (category === 'earth') {
//                 // Create object with image URL
//                 const imageUrl = URL.createObjectURL(data);
//                 articles = [{
//                     title: 'NASA Earth Image',
//                     urlToImage: imageUrl,
//                     description: 'Satellite image from NASA Earth Observatory.',
//                     url: imageUrl
//                 }];
//             } else {
//                 // Updated this part to handle the response correctly for Nepali news
//                 articles = data.results || data.articles || [];
//             }

//             displayNews(articles);
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             document.getElementById('content-area').innerHTML = `<p>Error loading news: ${error.message}</p>`;
//         });
// }

// // Function to determine the correct query for the category
// function getCategoryQuery(category) {
//     switch (category) {
//         case 'news': return '&category=general';
//         case 'sports': return '&category=sports';
//         case 'health': return '&category=health';
//         case 'arts': return '&q=arts';
//         case 'travel': return '&q=travel';
//         case 'earth': return '&q=earth';
//         case 'f1': return '&q=f1';
//         default: return '';
//     }
// }

// // Function to display news articles
// function displayNews(articles) {
//     const contentArea = document.getElementById('content-area');
//     contentArea.innerHTML = ''; // Clear previous content

//     // Check if articles are available
//     if (articles.length === 0) {
//         contentArea.innerHTML = `<p>No news available for this category.</p>`;
//         return;
//     }

//     // Featured Article Section (Use the first article as the featured one)
//     const featuredArticle = articles[0];

//     const featuredSection = document.createElement('div');
//     featuredSection.classList.add('featured-article');
//     featuredSection.innerHTML = `
//         <img src="${featuredArticle.urlToImage || 'https://via.placeholder.com/500'}" alt="Featured Image">
//         <div class="featured-text">
//             <h2>${featuredArticle.title}</h2>
//             <p>${featuredArticle.description || 'No description available.'}</p>
//             <a href="#" class="read-more" onclick="showFullNews('${featuredArticle.url}')">Read More</a>
//         </div>
//     `;
//     contentArea.appendChild(featuredSection);

//     // News Grid Section (for the rest of the articles)
//     const newsGrid = document.createElement('div');
//     newsGrid.classList.add('news-grid');

//     // Loop through the rest of the articles and display them in cards
//     articles.slice(1).forEach(article => {
//         const newsCard = document.createElement('div');
//         newsCard.classList.add('news-card');
//         newsCard.innerHTML = `
//             <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="News Image">
//             <h3>${article.title}</h3>
//             <p>${article.description || 'No description available.'}</p>
//             <a href="#" class="read-more" onclick="showFullNews('${article.url}')">Read More</a>
//         `;
//         newsGrid.appendChild(newsCard);
//     });

//     contentArea.appendChild(newsGrid);
// }

// // Function to show full news when a card is clicked
// function showFullNews(url) {
//     window.open(url, '_blank');
// }


// // Close the modal
// function closeModal() {
//     const modal = document.querySelector('.modal');
//     if (modal) {
//         modal.remove();
//     }
// }

// // Update the active class on the navigation links
// function updateActiveNav(category) {
//     const navLinks = document.querySelectorAll('.main-nav ul li a');
//     navLinks.forEach(link => {
//         if (link.innerText.toLowerCase() === category) {
//             link.classList.add('active');
//         } else {
//             link.classList.remove('active');
//         }
//     });
// }

// // Initial load (e.g., when the page is first opened)
// loadCategory('home');
 

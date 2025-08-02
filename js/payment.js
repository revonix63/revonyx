// Payment Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializePage();
    
    function initializePage() {
        // Get user name from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('name');
        
        if (userName) {
            document.getElementById('welcomeMessage').textContent = 
                `Hey ${userName}! Ready to get your personalized workout music?`;
        }
    }
    
    // Plan card hover effects
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});



// Show the popup
function openPopup(link) {
  document.getElementById('gumroad-frame').src = link;
  document.getElementById('gumroad-popup').style.display = 'flex';
}

// Close the popup
function closePopup() {
  document.getElementById('gumroad-popup').style.display = 'none';
}

// Listen for Gumroad purchase complete
window.addEventListener("message", function (event) {
  if (event.origin.includes("gumroad.com")) {
    if (event.data?.gumroad && event.data.gumroad.event === "purchase_complete") {
      closePopup();
      window.location.href = 'thankyou.html'; // Redirect to the thank you page
    }
  }
});



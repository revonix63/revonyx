// Thank You Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page with dynamic content
    initializeThankYouPage();
    
    // Start the process animation
    startProcessAnimation();
    
    // Add interactive elements
    setupInteractiveElements();
    
    function initializeThankYouPage() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('name');
        const planType = urlParams.get('plan');
        const paymentStatus = urlParams.get('payment');
        const deliveryMethod = urlParams.get('delivery');
        
        // Update personalized content
        if (userName) {
            document.getElementById('thankYouTitle').textContent = 
                `Awesome ${userName}! Your playlist is in the works.`;
        }
        
        // Update delivery method
        if (deliveryMethod) {
            const deliveryText = getDeliveryMethodText(deliveryMethod);
            document.getElementById('deliveryMethod').textContent = deliveryText;
        }
        
        // Update order details based on plan
        if (planType) {
            updateOrderSummary(planType);
        }
        
        // Show success message if payment was successful
        if (paymentStatus === 'success') {
            showPaymentSuccessMessage();
        }
    }
    
    function getDeliveryMethodText(method) {
        const methods = {
            'email': 'email',
            'telegram': 'Telegram',
            'instagram': 'Instagram DM'
        };
        return methods[method] || 'your chosen method';
    }
    
    function updateOrderSummary(planType) {
        const plans = {
            'starter': {
                name: 'Starter Boost',
                songs: '10 Personalized Tracks',
                price: '$5'
            },
            'pro': {
                name: 'Pro Pump',
                songs: '20 Personalized Tracks',
                price: '$9'
            },
            'beast': {
                name: 'Beast Mode',
                songs: '30 Personalized Tracks',
                price: '$17'
            }
        };
        
        const plan = plans[planType] || plans['pro'];
        
        document.getElementById('orderPlan').textContent = plan.name;
        document.getElementById('orderSongs').textContent = plan.songs;
        document.getElementById('orderTotal').textContent = plan.price;
    }
    
    function showPaymentSuccessMessage() {
        // Add a success banner or notification
        const successBanner = document.createElement('div');
        successBanner.className = 'payment-success-banner';
        successBanner.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>Payment confirmed! Your order is being processed.</span>
            </div>
        `;
        
        // Insert at the top of the page
        document.body.insertBefore(successBanner, document.body.firstChild);
        
        // Style the banner
        successBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 10000;
            animation: slideDown 0.5s ease-out;
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successBanner.style.animation = 'slideUp 0.5s ease-out';
            setTimeout(() => {
                successBanner.remove();
            }, 500);
        }, 5000);
    }
    
    function startProcessAnimation() {
        const steps = document.querySelectorAll('.step-item');
        let currentStep = 0;
        
        // Simulate process progression
        const progressInterval = setInterval(() => {
            // Remove active class from current step
            if (steps[currentStep]) {
                steps[currentStep].classList.remove('active');
            }
            
            // Move to next step
            currentStep++;
            
            // Add active class to new step
            if (steps[currentStep]) {
                steps[currentStep].classList.add('active');
            } else {
                // All steps completed, show completion message
                clearInterval(progressInterval);
                showProcessCompletion();
            }
        }, 3000); // Change step every 3 seconds
    }
    
    function showProcessCompletion() {
        // Add completion indicator
        const completionMessage = document.createElement('div');
        completionMessage.className = 'process-completion';
        completionMessage.innerHTML = `
            <div class="completion-content">
                <i class="fas fa-check-circle"></i>
                <span>All steps completed! Your playlist will be delivered soon.</span>
            </div>
        `;
        
        // Insert after process steps
        const processSteps = document.querySelector('.process-steps');
        processSteps.parentNode.insertBefore(completionMessage, processSteps.nextSibling);
        
        // Style the completion message
        completionMessage.style.cssText = `
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid rgba(40, 167, 69, 0.3);
            border-radius: 15px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
            animation: fadeInUp 0.5s ease-out;
        `;
        
        completionMessage.querySelector('.completion-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #28a745;
            font-weight: 600;
        `;
    }
    
    function setupInteractiveElements() {
        // Add hover effects to community buttons
        const communityBtns = document.querySelectorAll('.community-btn');
        communityBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-2px) scale(1)';
            });
        });
        
        // Add click tracking for analytics (optional)
        const trackableLinks = document.querySelectorAll('a[target="_blank"]');
        trackableLinks.forEach(link => {
            link.addEventListener('click', function() {
                const linkText = this.textContent.trim();
                console.log(`External link clicked: ${linkText}`);
                // Here you could send analytics data
            });
        });
        
        // Add copy functionality for support links
        const supportLinks = document.querySelectorAll('.support-btn');
        supportLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Optional: Show a tooltip or notification
                showTooltip(this, 'Opening support chat...');
            });
        });
        
        // Countdown timer for delivery (optional enhancement)
        startDeliveryCountdown();
    }
    
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        
        // Remove tooltip after 2 seconds
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }
    
    function startDeliveryCountdown() {
        const deliveryTime = new Date();
        deliveryTime.setHours(deliveryTime.getHours() + 2.5); // 2.5 hours from now
        
        const countdownElement = document.createElement('div');
        countdownElement.className = 'delivery-countdown';
        countdownElement.innerHTML = `
            <div class="countdown-content">
                <h4><i class="fas fa-clock"></i> Estimated Delivery</h4>
                <div class="countdown-timer" id="countdownTimer">
                    <span class="time-unit">
                        <span class="time-value" id="hours">02</span>
                        <span class="time-label">Hours</span>
                    </span>
                    <span class="time-separator">:</span>
                    <span class="time-unit">
                        <span class="time-value" id="minutes">30</span>
                        <span class="time-label">Minutes</span>
                    </span>
                </div>
            </div>
        `;
        
        // Insert after confirmation details
        const confirmationDetails = document.querySelector('.confirmation-details');
        confirmationDetails.parentNode.insertBefore(countdownElement, confirmationDetails.nextSibling);
        
        // Style the countdown
        countdownElement.style.cssText = `
            background: rgba(30, 144, 255, 0.1);
            border: 1px solid rgba(30, 144, 255, 0.3);
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            animation: fadeInUp 0.8s ease-out 0.3s both;
        `;
        
        // Update countdown every minute
        const countdownInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = deliveryTime - now;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = `
                    <div class="countdown-content">
                        <h4><i class="fas fa-check-circle"></i> Delivery Time!</h4>
                        <p>Your playlist should be delivered any moment now!</p>
                    </div>
                `;
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        }, 60000); // Update every minute
    }
    
    // Add some fun interactions
    function addEasterEggs() {
        // Konami code easter egg
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.code);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                triggerEasterEgg();
                konamiCode = [];
            }
        });
    }
    
    function triggerEasterEgg() {
        // Add some fun animation or message
        const easterEgg = document.createElement('div');
        easterEgg.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                z-index: 10000;
                animation: bounceIn 0.5s ease-out;
            ">
                <h3>🎵 Secret Unlocked! 🎵</h3>
                <p>You found the hidden music note! Your playlist will have an extra special touch!</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--primary-blue);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    margin-top: 15px;
                    cursor: pointer;
                ">Awesome!</button>
            </div>
        `;
        
        document.body.appendChild(easterEgg);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (easterEgg.parentNode) {
                easterEgg.remove();
            }
        }, 10000);
    }
    
    // Initialize easter eggs
    addEasterEggs();
    
    // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


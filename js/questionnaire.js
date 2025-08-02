// Questionnaire Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("zFoGYLDJJgXxUK8wM"); // EmailJS public key
    
    // Form elements
    const form = document.getElementById('questionnaireForm');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const currentStepSpan = document.getElementById('currentStep');
    const totalStepsSpan = document.getElementById('totalSteps');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Initialize
    totalStepsSpan.textContent = totalSteps;
    updateProgress();
    
    // Navigation event listeners
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    form.addEventListener('submit', handleSubmit);
    
    // Custom field handlers
    setupCustomFieldHandlers();
    
    function nextStep() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                hideStep(currentStep);
                currentStep++;
                showStep(currentStep);
                updateProgress();
                updateButtons();
            }
        }
    }
    
    function prevStep() {
        if (currentStep > 1) {
            hideStep(currentStep);
            currentStep--;
            showStep(currentStep);
            updateProgress();
            updateButtons();
        }
    }
    
    function showStep(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        step.style.display = 'block';
        setTimeout(() => {
            step.classList.add('active');
            step.classList.add('slide-in-right');
        }, 10);
    }
    
    function hideStep(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        step.classList.remove('active');
        step.classList.remove('slide-in-right');
        step.classList.remove('slide-in-left');
        setTimeout(() => {
            step.style.display = 'none';
        }, 300);
    }
    
    function updateProgress() {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
        currentStepSpan.textContent = currentStep;
    }
    
    function updateButtons() {
        // Previous button
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }
        
        // Next/Submit button
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else {
                clearFieldError(field);
            }
        });
        
        // Custom validation for specific steps
        if (currentStep === 1) {
            const nameField = document.getElementById('name');
            if (nameField.value.trim().length < 2) {
                isValid = false;
                showFieldError(nameField, 'Name must be at least 2 characters long');
            }
        }
        
        if (currentStep === 7) {
            const deliveryDetails = document.getElementById('deliveryDetails');
            const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked');
            
            if (deliveryMethod && deliveryDetails.value.trim()) {
                if (deliveryMethod.value === 'email') {
                    if (!isValidEmail(deliveryDetails.value)) {
                        isValid = false;
                        showFieldError(deliveryDetails, 'Please enter a valid email address');
                    }
                }
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff4757';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '5px';
        
        field.style.borderColor = '#ff4757';
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = 'rgba(30, 144, 255, 0.3)';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function setupCustomFieldHandlers() {
        // Workout Goal custom option
        const workoutGoalSelect = document.getElementById('workoutGoal');
        const customGoalInput = document.getElementById('customGoal');
        
        workoutGoalSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                customGoalInput.style.display = 'block';
                customGoalInput.required = true;
            } else {
                customGoalInput.style.display = 'none';
                customGoalInput.required = false;
                customGoalInput.value = '';
            }
        });
        
        // Workout Flow custom option
        const workoutFlowRadios = document.querySelectorAll('input[name="workout_flow"]');
        const customFlowInput = document.getElementById('customFlow');
        
        workoutFlowRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customFlowInput.style.display = 'block';
                    customFlowInput.required = true;
                } else {
                    customFlowInput.style.display = 'none';
                    customFlowInput.required = false;
                    customFlowInput.value = '';
                }
            });
        });
        
        // Delivery method handler
        const deliveryMethodRadios = document.querySelectorAll('input[name="delivery_method"]');
        const deliveryDetailsInput = document.getElementById('deliveryDetails');
        
        deliveryMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                updateDeliveryPlaceholder(this.value);
            });
        });
        
        function updateDeliveryPlaceholder(method) {
            switch(method) {
                case 'email':
                    deliveryDetailsInput.placeholder = 'Enter your email address';
                    break;
                case 'telegram':
                    deliveryDetailsInput.placeholder = 'Enter your Telegram username (e.g., @username)';
                    break;
                case 'instagram':
                    deliveryDetailsInput.placeholder = 'Enter your Instagram handle (e.g., @username)';
                    break;
            }
        }
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Collect form data
        const formData = collectFormData();
        
        // Send email via EmailJS
        emailjs.send('service_1fqv6bi', 'template_v7dje58', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Redirect to payment page
                window.location.href = 'payment.html?name=' + encodeURIComponent(formData.name);
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                loadingOverlay.style.display = 'none';
                alert('There was an error submitting your form. Please try again.');
            });
    }
    
    function collectFormData() {
        const formData = {};
        
        // Basic fields
        formData.name = document.getElementById('name').value.trim();
        formData.workout_goal = document.getElementById('workoutGoal').value;
        if (formData.workout_goal === 'other') {
            formData.workout_goal = document.getElementById('customGoal').value.trim();
        }
        
        // Workout flow
        const workoutFlowRadio = document.querySelector('input[name="workout_flow"]:checked');
        if (workoutFlowRadio) {
            if (workoutFlowRadio.value === 'custom') {
                formData.workout_flow = document.getElementById('customFlow').value.trim();
            } else {
                formData.workout_flow = workoutFlowRadio.value;
            }
        }
        
        formData.life_goal = document.getElementById('lifeGoal').value.trim();
        
        // Artists (combine into array, filter empty values)
        const artists = [
            document.getElementById('artist1').value.trim(),
            document.getElementById('artist2').value.trim(),
            document.getElementById('artist3').value.trim(),
            document.getElementById('artist4').value.trim(),
            document.getElementById('artist5').value.trim()
        ].filter(artist => artist !== '');
        
        formData.favorite_artists = artists.join(', ');
        formData.motivator = document.getElementById('motivator').value.trim();
        
        // Delivery method
        const deliveryMethodRadio = document.querySelector('input[name="delivery_method"]:checked');
        if (deliveryMethodRadio) {
            formData.delivery_method = deliveryMethodRadio.value;
            formData.delivery_details = document.getElementById('deliveryDetails').value.trim();
        }
        
        // Add timestamp
        formData.submitted_at = new Date().toISOString();
        
        return formData;
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (currentStep < totalSteps) {
                    nextStep();
                } else {
                    handleSubmit(e);
                }
            }
        }
    });
    
    // Auto-save to localStorage (optional)
    function saveProgress() {
        const formData = collectFormData();
        localStorage.setItem('revonyx_questionnaire_progress', JSON.stringify({
            step: currentStep,
            data: formData
        }));
    }
    
    function loadProgress() {
        const saved = localStorage.getItem('revonyx_questionnaire_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                // Optionally restore form data
                // This would require additional implementation
            } catch (e) {
                console.log('Could not load saved progress');
            }
        }
    }
    
    // Save progress on each step
    form.addEventListener('input', function() {
        setTimeout(saveProgress, 1000); // Debounce
    });
    
    // Clear progress on successful submission
    window.addEventListener('beforeunload', function() {
        if (currentStep === totalSteps) {
            localStorage.removeItem('revonyx_questionnaire_progress');
        }
    });
});


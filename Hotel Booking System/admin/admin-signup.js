// Admin Sign Up Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const adminSignupForm = document.getElementById('adminSignupForm');
    const messageContainer = document.getElementById('messageContainer');
    const message = document.getElementById('message');
    const messageText = document.getElementById('messageText');

    // Show message function
    function showMessage(text, type = 'info') {
        messageText.textContent = text;
        message.className = `message ${type} show`;

        // Hide message after 5 seconds
        setTimeout(() => {
            message.classList.remove('show');
        }, 5000);
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    // Form submission handler
    adminSignupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Basic validation
        if (!fullName || !email || !username || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Username validation
        if (username.length < 3) {
            showMessage('Username must be at least 3 characters long', 'error');
            return;
        }

        // Password validation
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }

        if (checkPasswordStrength(password) < 3) {
            showMessage('Password must contain uppercase, lowercase, and numbers', 'error');
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Terms acceptance
        if (!termsAccepted) {
            showMessage('Please accept the Terms & Conditions', 'error');
            return;
        }

        // Simulate signup process
        showMessage('Creating account...', 'info');

        // Simulate API call delay
        setTimeout(() => {
            // Check if username already exists (simple demo check)
            const existingUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
            const userExists = existingUsers.some(user => user.username === username || user.email === email);

            if (userExists) {
                showMessage('Username or email already exists', 'error');
                return;
            }

            // Create new admin user
            const newUser = {
                fullName,
                email,
                username,
                password, // In real app, this would be hashed
                createdAt: new Date().toISOString(),
                role: 'admin'
            };

            existingUsers.push(newUser);
            localStorage.setItem('adminUsers', JSON.stringify(existingUsers));

            showMessage('Account created successfully! You can now login.', 'success');

            // Redirect to login page after success
            setTimeout(() => {
                window.location.href = 'admin-login.html';
            }, 2000);

        }, 2000);
    });

    // Password visibility toggles
    function addPasswordToggle(inputId) {
        const passwordInput = document.getElementById(inputId);
        let passwordVisible = false;

        const passwordGroup = passwordInput.parentElement;
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'password-toggle';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
        toggleButton.style.cssText = `
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 16px;
            z-index: 3;
        `;

        passwordGroup.appendChild(toggleButton);

        toggleButton.addEventListener('click', function() {
            passwordVisible = !passwordVisible;
            passwordInput.type = passwordVisible ? 'text' : 'password';
            this.innerHTML = passwordVisible ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // Add password toggles for both password fields
    addPasswordToggle('password');
    addPasswordToggle('confirmPassword');

    // Real-time password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.cssText = `
        margin-top: 8px;
        font-size: 12px;
        color: #666;
    `;
    passwordInput.parentElement.appendChild(strengthIndicator);

    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        let strengthText = '';
        let strengthColor = '';

        switch(strength) {
            case 0:
            case 1:
                strengthText = 'Very Weak';
                strengthColor = '#ff4444';
                break;
            case 2:
                strengthText = 'Weak';
                strengthColor = '#ff8800';
                break;
            case 3:
                strengthText = 'Medium';
                strengthColor = '#ffaa00';
                break;
            case 4:
                strengthText = 'Strong';
                strengthColor = '#00aa00';
                break;
            case 5:
                strengthText = 'Very Strong';
                strengthColor = '#00aa00';
                break;
        }

        strengthIndicator.textContent = this.value ? `Password Strength: ${strengthText}` : '';
        strengthIndicator.style.color = strengthColor;
    });

    // Terms link handler
    const termsLink = document.querySelector('.terms-link');
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Terms & Conditions would open in a modal', 'info');
    });

    // Contact support handler
    const contactSupportLink = document.querySelector('.contact-support');
    contactSupportLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Support contact form would open here', 'info');
    });

    // Add some interactive effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Animate background shapes
    const shapes = document.querySelectorAll('.bg-shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });

    // Add loading state to button
    function setLoadingState(loading) {
        const button = document.querySelector('.admin-btn');
        const buttonText = button.querySelector('span');
        const buttonIcon = button.querySelector('i');

        if (loading) {
            button.disabled = true;
            buttonText.textContent = 'Creating Account...';
            buttonIcon.className = 'fas fa-spinner fa-spin';
        } else {
            button.disabled = false;
            buttonText.textContent = 'Create Account';
            buttonIcon.className = 'fas fa-user-plus';
        }
    }

    // Update form submission to use loading state
    adminSignupForm.addEventListener('submit', function(e) {
        setLoadingState(true);
        setTimeout(() => setLoadingState(false), 3000); // Reset after 3 seconds
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            adminSignupForm.dispatchEvent(new Event('submit'));
        }

        // Escape to clear form
        if (e.key === 'Escape') {
            adminSignupForm.reset();
            inputs.forEach(input => input.blur());
        }
    });

    // Auto-focus first input
    document.getElementById('fullName').focus();
});
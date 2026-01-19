// Admin Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminForm');
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

    // Form submission handler
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!username || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Simulate login process
        showMessage('Signing in...', 'info');

        // Simulate API call delay
        setTimeout(() => {
            // Simple demo credentials (in real app, this would be server-side)
            if (username === 'admin' && password === 'admin123') {
                showMessage('Login successful! Redirecting...', 'success');

                // Store login state if remember is checked
                if (remember) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminUsername', username);
                } else {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    sessionStorage.setItem('adminUsername', username);
                }

                // Redirect to admin dashboard (you can create this page later)
                setTimeout(() => {
                    // For now, just show success and stay on page
                    // window.location.href = 'admin-dashboard.html';
                    showMessage('Welcome to Admin Panel!', 'success');
                }, 1500);

            } else {
                showMessage('Invalid username or password', 'error');
            }
        }, 1500);
    });

    // Password visibility toggle (optional enhancement)
    const passwordInput = document.getElementById('password');
    let passwordVisible = false;

    // Add password toggle button
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

    // Check if already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        const username = localStorage.getItem('adminUsername') || sessionStorage.getItem('adminUsername');
        showMessage(`Welcome back, ${username}!`, 'success');
    }

    // Forgot password handler
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Password reset link sent to admin email', 'info');
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
            buttonText.textContent = 'Signing In...';
            buttonIcon.className = 'fas fa-spinner fa-spin';
        } else {
            button.disabled = false;
            buttonText.textContent = 'Sign In';
            buttonIcon.className = 'fas fa-arrow-right';
        }
    }

    // Update form submission to use loading state
    const originalSubmitHandler = adminForm.onsubmit;
    adminForm.addEventListener('submit', function(e) {
        setLoadingState(true);
        setTimeout(() => setLoadingState(false), 2000); // Reset after 2 seconds
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            adminForm.dispatchEvent(new Event('submit'));
        }

        // Escape to clear form
        if (e.key === 'Escape') {
            adminForm.reset();
            inputs.forEach(input => input.blur());
        }
    });

    // Auto-focus first input
    document.getElementById('username').focus();
});
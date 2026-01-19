// Admin Portal Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to option cards
    const optionCards = document.querySelectorAll('.option-card');

    optionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add click effects to option buttons
    const optionButtons = document.querySelectorAll('.option-btn');

    optionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a subtle click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Animate background shapes
    const shapes = document.querySelectorAll('.bg-shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });

    // Add some entrance animations
    const adminCard = document.querySelector('.admin-card');
    const adminHeader = document.querySelector('.admin-header');
    const portalOptions = document.querySelector('.portal-options');

    // Initial states
    adminCard.style.opacity = '0';
    adminCard.style.transform = 'translateY(30px)';
    adminHeader.style.opacity = '0';
    adminHeader.style.transform = 'translateY(20px)';
    portalOptions.style.opacity = '0';
    portalOptions.style.transform = 'translateY(20px)';

    // Animate in
    setTimeout(() => {
        adminCard.style.transition = 'all 0.6s ease-out';
        adminCard.style.opacity = '1';
        adminCard.style.transform = 'translateY(0)';
    }, 200);

    setTimeout(() => {
        adminHeader.style.transition = 'all 0.5s ease-out';
        adminHeader.style.opacity = '1';
        adminHeader.style.transform = 'translateY(0)';
    }, 400);

    setTimeout(() => {
        portalOptions.style.transition = 'all 0.5s ease-out';
        portalOptions.style.opacity = '1';
        portalOptions.style.transform = 'translateY(0)';
    }, 600);

    // Check if user is already logged in and redirect appropriately
    const isLoggedIn = localStorage.getItem('adminLoggedIn') || sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        const username = localStorage.getItem('adminUsername') || sessionStorage.getItem('adminUsername');
        // Could show a message or redirect to dashboard
        console.log(`User ${username} is already logged in`);
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Number keys for quick navigation
        if (e.key === '1') {
            window.location.href = 'admin-login.html';
        } else if (e.key === '2') {
            window.location.href = 'admin-signup.html';
        }

        // Escape to go back to home
        if (e.key === 'Escape') {
            window.location.href = '../index.html';
        }
    });

    // Add tooltips for keyboard shortcuts
    const loginCard = document.querySelector('.login-option');
    const signupCard = document.querySelector('.signup-option');

    if (loginCard && signupCard) {
        const loginTooltip = document.createElement('div');
        loginTooltip.textContent = 'Press 1';
        loginTooltip.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        loginCard.style.position = 'relative';
        loginCard.appendChild(loginTooltip);

        const signupTooltip = document.createElement('div');
        signupTooltip.textContent = 'Press 2';
        signupTooltip.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        signupCard.style.position = 'relative';
        signupCard.appendChild(signupTooltip);

        // Show tooltips on card hover
        loginCard.addEventListener('mouseenter', () => {
            loginTooltip.style.opacity = '1';
        });
        loginCard.addEventListener('mouseleave', () => {
            loginTooltip.style.opacity = '0';
        });

        signupCard.addEventListener('mouseenter', () => {
            signupTooltip.style.opacity = '1';
        });
        signupCard.addEventListener('mouseleave', () => {
            signupTooltip.style.opacity = '0';
        });
    }
});
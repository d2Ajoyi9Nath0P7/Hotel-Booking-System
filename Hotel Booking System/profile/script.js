// Menu toggle functionality
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    dropdownMenu.classList.remove('active');
});

// Tab switching functionality
const menuItems = document.querySelectorAll('.menu-item');
const tabContents = document.querySelectorAll('.tab-content');

menuItems.forEach(item => {
    item.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Remove active class from all menu items and tabs
        menuItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked item and corresponding tab
        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Handle dropdown item clicks
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
        dropdownMenu.classList.remove('active');
    });
});

// Handle logout
const logoutBtn = document.querySelector('.logout');
logoutBtn.addEventListener('click', function() {
    // You can add actual logout functionality here
    alert('Logout functionality');
    // window.location.href = '../login.html';
});

// Handle CTA buttons
const ctaBtns = document.querySelectorAll('.cta-btn');
ctaBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        window.location.href = '../2nd-page/index.html';
    });
});

// Handle edit button
const editBtn = document.querySelector('.edit-btn');
if (editBtn) {
    editBtn.addEventListener('click', function() {
        alert('Edit profile functionality coming soon');
    });
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

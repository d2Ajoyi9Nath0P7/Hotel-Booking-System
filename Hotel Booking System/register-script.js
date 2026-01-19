document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorDiv = document.getElementById('errorMessage');

    if (form) {
        form.addEventListener('submit', function (e) {
            const password = document.getElementById('pwd').value;
            const confirmPassword = document.getElementById('confirm_pwd').value;

            // আগের এরর মেসেজ মুছে ফেলা
            errorDiv.textContent = '';

            if (password !== confirmPassword) {
                e.preventDefault(); // পাসওয়ার্ড না মিললে PHP-তে ডেটা যাবে না
                errorDiv.textContent = "Error: Passwords do not match!";
                errorDiv.style.color = "red";
            } else {
                console.log("Validation successful. Submitting to register.php...");
                // Mark user as registered locally so booking can continue after registration
                localStorage.setItem('isRegistered', 'true');
                // এখানে e.preventDefault() নেই, তাই ফর্ম সরাসরি register.php-তে যাবে।
            }
        });
    }
});
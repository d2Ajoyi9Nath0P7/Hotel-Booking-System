// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() 
{
    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // Current user info
    // Current user info - PHP থেকে আসছে (index.php তে ইতিমধ্যে set করা আছে)
    const currentUserElement = document.getElementById('currentUser');
    const currentUser = currentUserElement ? currentUserElement.textContent : 'Admin';
    const currentRoleElement = document.querySelector('.user-role');
    const currentRole = currentRoleElement ? currentRoleElement.textContent : 'Super Admin';

    // Enhanced responsive sidebar management
    function updateSidebarForScreenSize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

        if (isMobile) {
            // On mobile, sidebar should be hidden by default
            sidebar.classList.add('collapsed');
            mainContent.classList.remove('expanded');
        } else if (isTablet) {
            // On tablet, sidebar behavior depends on user preference
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        } 
        else 
        {
            // On desktop, sidebar is visible by default
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }

    // Initialize sidebar state on load
    updateSidebarForScreenSize();

    // Sidebar toggle with enhanced mobile handling
    sidebarToggle.addEventListener('click', function() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // On mobile, toggle shows/hides sidebar overlay
            const isOpen = sidebar.classList.contains('mobile-open');
            sidebar.classList.toggle('mobile-open');
            mobileOverlay.classList.toggle('active', !isOpen);
        } else {
            // On tablet/desktop, toggle collapsed state
            const isCollapsed = sidebar.classList.contains('collapsed');
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');

            // Save preference for tablet
            localStorage.setItem('sidebarCollapsed', isCollapsed ? 'false' : 'true');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        }
    });

    // Close mobile overlay when clicked
    mobileOverlay.addEventListener('click', function() {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        updateSidebarForScreenSize();
        // Close mobile sidebar and overlay on resize if switching to larger screen
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        }
    });

    // Enhanced navigation with better mobile handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            showSection(section);

            // Update page title
            updatePageTitle(section);

            // Close sidebar on mobile/tablet after navigation
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('mobile-open');
                sidebar.classList.add('collapsed');
                mainContent.classList.remove('expanded');
                mobileOverlay.classList.remove('active');
            }
        });
    });

    // Show section function
    function showSection(sectionName) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');

            // Load section-specific data
            if (sectionName === 'properties') {
                loadProperties();
            }

            if (sectionName === 'users') {
                loadUsersTable();
            }

            if (sectionName === 'bookings') {
                loadBookingsTable();
            }
        }
    }

    // Update page title
    function updatePageTitle(section) {
        const titles = {
            overview: 'Dashboard Overview',
            analytics: 'Analytics & Reports',
            users: 'User Management',
            bookings: 'Booking Management',
            properties: 'Property Management',
            payments: 'Payment Management',
            content: 'Content Management',
            media: 'Media Library',
            reviews: 'Review Management',
            settings: 'System Settings',
            security: 'Security Center',
            logs: 'System Logs'
        };

        const subtitles = {
            overview: 'Welcome back, manage your system efficiently',
            analytics: 'Track performance and user engagement',
            users: 'Manage user accounts and permissions',
            bookings: 'Handle reservations and bookings',
            properties: 'Manage property listings and details',
            payments: 'Monitor transactions and payments',
            content: 'Edit website content and pages',
            media: 'Upload and manage media files',
            reviews: 'Moderate user reviews and ratings',
            settings: 'Configure system preferences',
            security: 'Manage security settings and access',
            logs: 'View system activity and logs'
        };

        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        document.getElementById('pageSubtitle').textContent = subtitles[section] || 'Manage your system efficiently';
    }

    // Logout functionality
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '../logout.php';
            }
        });
    }

    // Refresh functionality
    refreshBtn.addEventListener('click', function() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            loadDashboardData();
            showNotification('Dashboard refreshed successfully', 'success');
        }, 1500);
    });

    // Notifications panel
    notificationsBtn.addEventListener('click', function() {
        notificationsPanel.classList.toggle('active');
    });

    closeNotifications.addEventListener('click', function() {
        notificationsPanel.classList.remove('active');
    });

    // Loading functions
    function showLoading() {
        loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
                <span class="notification-time">Just now</span>
            </div>
        `;

        // Add to notifications list
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.insertBefore(notification, notificationsList.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Initialize dashboard
    function initDashboard() {
        loadDashboardData();
        initCharts();
        loadNotifications();
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Load dashboard data
    function loadDashboardData() {
        
        /*
        // Update stats
        document.getElementById('totalUsers').textContent = mockData.totalUsers.toLocaleString();
        document.getElementById('totalBookings').textContent = mockData.totalBookings.toLocaleString();
        document.getElementById('totalProperties').textContent = mockData.totalProperties.toLocaleString();
        document.getElementById('totalRevenue').textContent = `$${mockData.totalRevenue.toLocaleString()}`;
        */

        // Load recent activity
        loadRecentActivity();//

        // Load users table
        loadUsersTable();

        // Load bookings table
        loadBookingsTable();

        // Load properties grid
        loadPropertiesGrid();
    }

    // Load recent activity
    function loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '<p style="text-align:center;">Loading activities...</p>';

        // ডাটাবেস থেকে ডাটা নিয়ে আসার জন্য fetch ব্যবহার করুন
        fetch('get_recent_activity.php') // একটি নতুন PHP ফাইল লাগবে
            .then(response => response.json())
            .then(activities => {
                activityList.innerHTML = '';

                if (activities.length === 0) {
                    activityList.innerHTML = '<p>No recent activity found.</p>';
                    return;
                }

                activities.forEach(activity => {
                    const activityItem = document.createElement('div');
                    activityItem.className = `activity-item ${activity.type}`;
                    activityItem.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-${activity.type === 'user' ? 'user-plus' : 'calendar-check'}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                `;
                    activityList.appendChild(activityItem);
                });
            })
            .catch(err => {
                console.error(err);
                activityList.innerHTML = '<p>Error loading activity.</p>';
            });
    }


    // Initialize charts
    function initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // User Growth Chart
        const userCtx = document.getElementById('userChart');
        if (userCtx) {
            new Chart(userCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'New Users',
                        data: [65, 89, 80, 81, 96, 105],
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }





    // Load users table
    async function loadUsersTable() 
    {
        try 
        {
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Loading users...</td></tr>';

            const response = await fetch('/car-rental/api_users.php');
            const data = await response.json();

            if (data.success) 
            {
                const users = data.data;
                tbody.innerHTML = '';

                if (users.length === 0) 
                {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">No users found</td></tr>';
                    return;
                }

                users.forEach(user => 
                {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><span class="status-badge ${user.status}">${user.status}</span></td>
                    <td>${new Date(user.joinDate).toLocaleDateString()}</td>

                    <td>
                        <div class="action-buttons">
                            <button class="action-btn-small edit" onclick="editUser(${user.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>

                            <button class="action-btn-small delete" onclick="deleteUser(${user.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                `;
                    tbody.appendChild(row);
                });
            } 
            else 
            {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:red;">Error: ${data.message}</td></tr>`;
            }
        } 
        catch (error) 
        {
            console.error('Error loading users:', error);
            const tbody = document.getElementById('usersTableBody');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:red;">Error loading users</td></tr>';
        }
    }






    // --- Delete Functions ---



    // 1. Delete User
    async function handleUserDelete(userId)
    {
        if(confirm('Are you sure you want to delete this user? This action cannot be undone.')) 
        {
            try 
            {
                const response = await fetch('/car-rental/delete_handler.php', 
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete_user', id: userId })
                });

                const data = await response.json();
                console.log('delete_user response', data);

                if(data.success) 
                {
                    showNotification('User deleted successfully', 'success');
                    loadUsersTable(); // Table refresh korbe
                }
                else 
                {
                    showNotification(data.message || 'Error deleting user', 'error');
                }
            } 
            catch (error) 
            {
                showNotification('Server error occurred', 'error');
            }
        }
    }





    // 2. Delete Booking
    async function deleteBooking(bookingId) 
    {
        if(confirm('Are you sure you want to delete?')) 
        {
            try
            {
                const response = await fetch('/car-rental/admin/dashboard/delete_booking.php', //page reload nah kore data delete kore fetch diye
                {
                    method: 'POST',//server ekta POST request pathabe
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },//php packet er vetor json file e data ache
                    body: JSON.stringify({ action: 'delete_booking', id: bookingId })
                });

                const data = await response.json();
                console.log('delete_booking response', data);

                if (data.success) 
                {
                    showNotification('Booking deleted', 'success');
                    loadBookingsTable();// Table refresh korbe
                }
                else 
                {
                    alert('Error: ' + data.message);
                    alert('Failed to connect to the server');
                }
            }
            catch (error) 
            {
                showNotification('Error connecting to server', 'error');
            }
        }
    }

    //update booking
    async function updateBooking(bookingId, updatedData) {
        try 
        {
            const response = await fetch('/car-rental/admin/dashboard/update_booking.php', 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // এখানে ডিলিট করার বদলে আমরা ডেটাগুলো পাঠাচ্ছি
                body: JSON.stringify({
                    action: 'update_booking',
                    id: bookingId,
                    ...updatedData // এখানে ইউজারের নতুন নাম, ফোন বা অন্যান্য তথ্য থাকবে
                })
            });

            const data = await response.json();

            if(data.success) 
            {
                showNotification('Booking updated successfully', 'success');
                loadBookingsTable(); // টেবিল রিফ্রেশ করবে যাতে নতুন ডেটা দেখা যায়
                // এখানে মোডাল বন্ধ করার কোড লিখতে পারেন
            }
            else
            {
                alert('Error: ' + data.message);
            }
        }
        catch (error) 
        {
            showNotification('Error connecting to server', 'error');
        }
    }




    // 3. Delete Property
    async function deleteProperty(propertyId) {
        if (confirm('Warning: Deleting this property will also remove all related bookings. Continue?')) {
            try {
                const response = await fetch('/car-rental/delete_handler.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete_property', id: propertyId })
                });
                const data = await response.json();
                console.log('delete_property response', data);
                if (data.success) {
                    showNotification('Property removed', 'success');
                    loadProperties(); // Reload property grid/table
                }
            } catch (error) {
                console.error(error);
            }
        }
    }


    // ১. এডিট বাটন ক্লিক করলে মোডাল দেখাবে
    function editBooking(bookingId) 
    {
        document.getElementById('edit_booking_id').value = bookingId;
        document.getElementById('editModal').style.display = 'block';
    }

    // ২. মোডাল বন্ধ করা
    function closeModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    // ৩. সার্ভারে (PHP) আপডেট পাঠানো
    async function saveBookingUpdate() {
        const bId = document.getElementById('edit_booking_id').value;
        const bStatus = document.getElementById('edit_status').value;

        try {
            const response = await fetch('update_booking.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_booking',
                    id: bId,
                    status: bStatus
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Booking status updated successfully!');
                closeModal();
                loadBookingsTable(); // অ্যাডমিন টেবিল রিফ্রেশ হবে
            } else {
                alert('Update failed: ' + data.message);
            }
        } catch (error) {
            alert('Server error connecting to update_booking.php');
        }
    }



    //Problem atic Booking Table Load function
    // Load bookings table
    async function loadBookingsTable() 
    {
        const tbody = document.getElementById('bookingsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">Loading bookings...</td></tr>';

        try {
            const response = await fetch('get_bookings.php'); // আপনার PHP ফাইলটি কল করছে
            //console.log('fetch response', response);
            //console.log('fetch status', response.status);


            const bookings = await response.json();
            //console.log('fetch response',response);



            //debugger;

            tbody.innerHTML = ''; // ক্লিয়ার করা

            if (bookings.length === 0) 
            {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">No bookings found in database.</td></tr>';
                return;
            }

            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>#${booking.id}</td>
                <td>User ID: ${booking.user_id}</td> 
                <td>Property ID: ${booking.property_id}</td>
                <td>${booking.check_in_date}</td>
                <td>${booking.check_out_date}</td>
                <td>
                    <span class="status-badge ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </span>
                </td>
                <td>$${booking.total_price}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn-small edit" onclick="editBooking(${booking.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small delete" onclick="deleteBooking(${booking.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
                tbody.appendChild(row);
            });
        }
        catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center; padding:20px;">Failed to connect to get_bookings.php</td></tr>';
        }
    }

    // Load properties grid
    function loadPropertiesGrid() {
        // Call the new properties management function
        loadProperties();
    }



    document.addEventListener('DOMContentLoaded', function () {
        const saveBtn = document.getElementById('propertyModalSave');
        const propertyForm = document.getElementById('propertyForm');
        const modal = document.getElementById('propertyModal');

        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                // ১. ফর্ম ভ্যালিডেশন চেক
                if (!propertyForm.checkValidity()) {
                    propertyForm.reportValidity();
                    return;
                }

                // ২. ফর্ম ডাটা সংগ্রহ ও normalize করা
                const formData = new FormData(propertyForm);
                const propertyData = Object.fromEntries(formData.entries());

                // চেকবক্স হ্যান্ডেল করা
                propertyData.featured = document.getElementById('propertyFeatured').checked ? true : false;

                // Images এবং amenities টেক্সটএনা থেকে অ্যারে বানানো
                const imagesText = document.getElementById('propertyImages').value || '';
                propertyData.images = imagesText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                const amenitiesText = document.getElementById('propertyAmenities').value || '';
                propertyData.amenities = amenitiesText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                // Number conversions
                propertyData.price = parseFloat(propertyData.price) || 0;
                propertyData.bedrooms = propertyData.bedrooms ? parseInt(propertyData.bedrooms) : 0;
                propertyData.bathrooms = propertyData.bathrooms ? parseFloat(propertyData.bathrooms) : 0;
                propertyData.max_guests = propertyData.max_guests ? parseInt(propertyData.max_guests) : 1;
                propertyData.latitude = propertyData.latitude ? parseFloat(propertyData.latitude) : null;
                propertyData.longitude = propertyData.longitude ? parseFloat(propertyData.longitude) : null;

                console.log("Saving Property (normalized):", propertyData);

                // Disable save button and show loader
                saveBtn.disabled = true;
                saveBtn.classList.add('loading');
                showLoading();

                // ৩. সার্ভারে ডাটা পাঠানো (admin API)
                fetch('../api_properties.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(propertyData)
                })
                    .then(response => response.json())
                    .then(async (data) => {
                        hideLoading();
                        // Re-enable save button
                        saveBtn.disabled = false;
                        saveBtn.classList.remove('loading');

                        if (data.success) {
                            showNotification('Property added successfully', 'success');
                            modal.classList.remove('active'); // Close modal
                            propertyForm.reset();             // Clear form

                            // If server returned the inserted data, add it to the UI without full reload
                            if (data.data) {
                                // Prepend to local properties array and re-render
                                propertiesData.unshift(data.data);
                                renderPropertiesGrid();
                                updatePropertiesStats();
                            } else if (data.id) {
                                // Fallback: fetch new property from API
                                try {
                                    const resp = await fetch('../api_properties.php?id=' + encodeURIComponent(data.id), { credentials: 'same-origin' });
                                    const j = await resp.json();
                                    if (j.success && j.data) {
                                        propertiesData.unshift(j.data);
                                        renderPropertiesGrid();
                                        updatePropertiesStats();
                                    } else {
                                        loadProperties();
                                    }
                                } catch (e) {
                                    console.error('Failed fetching created property:', e);
                                    // Last resort: reload the properties list
                                    loadProperties();
                                }
                            } else {
                                // Unknown response — reload properties
                                loadProperties();
                            }
                        } else {
                            saveBtn.disabled = false;
                            saveBtn.classList.remove('loading');
                            showNotification('Error: ' + (data.message || 'Failed to add property'), 'error');
                        }
                    })
                    .catch(error => {
                        hideLoading();
                        saveBtn.disabled = false;
                        saveBtn.classList.remove('loading');
                        console.error('Error:', error);
                        showNotification('Something went wrong while saving property', 'error');
                    });
            });
        }

        // Cancel বাটনের কাজ
        document.getElementById('propertyModalCancel').onclick = function () {
            modal.classList.remove('active');
        };

        // --- Booking Modal Handlers ---
        function initBookingModal() {
            const addBookingBtn = document.getElementById('addBookingBtn');
            const bookingModal = document.getElementById('bookingModal');
            const bookingUser = document.getElementById('bookingUser');
            const bookingProperty = document.getElementById('bookingProperty');
            const bookingCheckIn = document.getElementById('bookingCheckIn');
            const bookingCheckOut = document.getElementById('bookingCheckOut');
            const bookingGuests = document.getElementById('bookingGuests');
            const bookingTotal = document.getElementById('bookingTotal');
            const bookingModalSave = document.getElementById('bookingModalSave');
            const bookingModalCancel = document.getElementById('bookingModalCancel');

            if(!addBookingBtn || !bookingModal) return;

            addBookingBtn.addEventListener('click', async function() {
                if(bookingUser) bookingUser.innerHTML = '<option>Loading...</option>';
                if(bookingProperty) bookingProperty.innerHTML = '<option>Loading...</option>';
                bookingModal.classList.add('active');

                try {
                    const [usersResp, propsResp] = await Promise.all([
                        fetch('/car-rental/api_users.php'),
                        fetch('/car-rental/admin/api_properties.php')
                    ]);

                    const usersData = await usersResp.json();
                    const propsData = await propsResp.json();

                    if(bookingUser) {
                        bookingUser.innerHTML = '<option value="">Select user</option>';
                        if(usersData && usersData.success && usersData.data) {
                            usersData.data.forEach(u => {
                                const opt = document.createElement('option');
                                opt.value = u.id;
                                opt.textContent = u.name + ' (' + u.email + ')';
                                bookingUser.appendChild(opt);
                            });
                        } else {
                            bookingUser.innerHTML = '<option value="">No users</option>';
                        }
                    }

                    if(bookingProperty) {
                        bookingProperty.innerHTML = '<option value="">Select property</option>';
                        if(propsData && propsData.success && Array.isArray(propsData.data)) {
                            propsData.data.forEach(p => {
                                const opt = document.createElement('option');
                                opt.value = p.id;
                                opt.textContent = p.title + ' - $' + (parseFloat(p.price) || 0).toFixed(2);
                                bookingProperty.appendChild(opt);
                            });
                        } else {
                            bookingProperty.innerHTML = '<option value="">No properties</option>';
                        }
                    }
                } catch (e) {
                    console.error('Error loading booking data', e);
                    showNotification('Error loading users or properties', 'error');
                }
            });

            function updateTotal() {
                if(!bookingProperty || !bookingCheckIn || !bookingCheckOut || !bookingTotal) return;
                const propId = bookingProperty.value;
                const inDate = bookingCheckIn.value;
                const outDate = bookingCheckOut.value;
                if(!propId || !inDate || !outDate) { bookingTotal.textContent = '$0.00'; return; }
                const nights = Math.round((new Date(outDate) - new Date(inDate))/(1000*60*60*24));
                if(nights <= 0) { bookingTotal.textContent = 'Invalid dates'; return; }

                fetch('/car-rental/admin/api_properties.php?id=' + encodeURIComponent(propId))
                    .then(r => r.json())
                    .then(d => {
                        if(d && d.success && d.data) {
                            const total = (parseFloat(d.data.price) || 0) * nights;
                            bookingTotal.textContent = '$' + total.toFixed(2) + ' (' + nights + ' nights)';
                        } else {
                            bookingTotal.textContent = '$0.00';
                        }
                    })
                    .catch(err => { console.error(err); bookingTotal.textContent = '$0.00'; });
            }

            if(bookingProperty) bookingProperty.addEventListener('change', updateTotal);
            if(bookingCheckIn) bookingCheckIn.addEventListener('change', updateTotal);
            if(bookingCheckOut) bookingCheckOut.addEventListener('change', updateTotal);

            if(bookingModalCancel) bookingModalCancel.addEventListener('click', function(){
                bookingModal.classList.remove('active');
                if(bookingTotal) bookingTotal.textContent = '$0.00';
            });

            if(bookingModalSave) bookingModalSave.addEventListener('click', async function(){
                if(!bookingUser || !bookingProperty || !bookingCheckIn || !bookingCheckOut) return;
                if(!bookingUser.value || !bookingProperty.value || !bookingCheckIn.value || !bookingCheckOut.value) {
                    showNotification('Please fill all fields', 'error');
                    return;
                }

                const payload = {
                    user_id: bookingUser.value,
                    property_id: bookingProperty.value,
                    check_in_date: bookingCheckIn.value,
                    check_out_date: bookingCheckOut.value,
                    guests: bookingGuests ? bookingGuests.value : 1
                };

                try {
                    const resp = await fetch('/car-rental/admin/dashboard/create_booking.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify(payload)
                    });

                    const result = await resp.json();

                    if(result && result.success) {
                        showNotification('Booking created successfully', 'success');
                        bookingModal.classList.remove('active');
                        if(bookingTotal) bookingTotal.textContent = '$0.00';
                        loadBookingsTable();
                    } else {
                        showNotification(result.error || result.message || 'Failed to create booking', 'error');
                    }
                } catch (e) {
                    console.error('Error creating booking', e);
                    showNotification('Server error creating booking', 'error');
                }
            });
        }
        initBookingModal();
    });

    // Load notifications
    function loadNotifications() {
        const notifications = [
            {
                type: 'info',
                title: 'System Update',
                message: 'New features have been deployed',
                time: '2 hours ago'
            },
            {
                type: 'warning',
                title: 'Server Maintenance',
                message: 'Scheduled maintenance tonight at 2 AM',
                time: '4 hours ago'
            },
            {
                type: 'error',
                title: 'Payment Failed',
                message: 'Booking #1234 payment failed',
                time: '6 hours ago'
            }
        ];

        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '';

        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.type}`;
            item.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-${notification.type === 'info' ? 'info-circle' : notification.type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            `;
            notificationsList.appendChild(item);
        });
    }

    // Update clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('currentTime').textContent = timeString;
    }

    // User management functions
    window.editUser = function(userId) {
        showNotification(`Editing user ${userId}`, 'info');
        // Open user modal with data
        openUserModal(userId);
    };

    window.deleteUser = async function(userId) {
        // Delegate to the server-backed delete function (keeps the confirmation and notification handling there)
        await handleUserDelete(userId);
    };

    // Booking management functions
    window.editBooking = function(bookingId) {
        showNotification(`Editing booking ${bookingId}`, 'info');
    };

    window.deleteBooking = async function (bookingId) {
        
        await deleteBooking(bookingId);
    };
    // User modal functions
    let currentEditingUserId = null;

    async function openUserModal(userId = null) {
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('userModalTitle');
        const firstNameInput = document.getElementById('userFirstName');
        const lastNameInput = document.getElementById('userLastName');
        const emailInput = document.getElementById('userEmail');
        const roleInput = document.getElementById('userRole');
        const statusInput = document.getElementById('userStatus');

        if (userId) {
            modalTitle.textContent = 'Edit User';
            currentEditingUserId = userId;
            // Load user data from API
            try {
                const resp = await fetch(`/car-rental/api_users.php?id=${userId}`, { credentials: 'same-origin' });
                const data = await resp.json();
                console.log('get user', data);
                if (data.success) {
                    const user = data.data;
                    // Split name into first/last heuristically
                    const parts = (user.name || '').split(' ');
                    firstNameInput.value = parts[0] || '';
                    lastNameInput.value = parts.slice(1).join(' ') || '';
                    emailInput.value = user.email || '';
                    roleInput.value = (user.role || 'user').toLowerCase();
                    statusInput.value = (user.status || 'active').toLowerCase();
                } else {
                    showNotification(data.message || 'Failed to load user', 'error');
                    return;
                }
            } catch (err) {
                console.error('Error loading user:', err);
                showNotification('Error loading user', 'error');
                return;
            }
        } else {
            modalTitle.textContent = 'Add New User';
            currentEditingUserId = null;
            // Clear form
            document.getElementById('userForm').reset();
        }

        modal.classList.add('active');
    }

    // Modal event listeners
    document.getElementById('userModalClose').addEventListener('click', () => {
        document.getElementById('userModal').classList.remove('active');
    });

    document.getElementById('userModalCancel').addEventListener('click', () => {
        document.getElementById('userModal').classList.remove('active');
    });

    document.getElementById('userModalSave').addEventListener('click', saveUser);

    async function saveUser() 
    {
        const firstName = document.getElementById('userFirstName').value.trim();
        const lastName = document.getElementById('userLastName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;

        const name = `${firstName}${lastName ? ' ' + lastName : ''}`.trim();

        if (!name || !email) {
            showNotification('Please fill in name and email', 'error');
            return;
        }

        try {
            let response, data;
            if (currentEditingUserId) {
                // Update existing user
                response = await fetch('/car-rental/api_users.php', {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentEditingUserId, name, email, role, status })
                });
                data = await response.json();
                console.log('update user response', data);

                if (data.success) {
                    showNotification('User updated successfully', 'success');
                    document.getElementById('userModal').classList.remove('active');
                    currentEditingUserId = null;
                    loadUsersTable();
                } else {
                    showNotification(data.message || 'Error updating user', 'error');
                }
            } else {
                // Create new user
                response = await fetch('/car-rental/api_users.php', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, role, status })
                });
                data = await response.json();
                console.log('create user response', data);
                if (data.success) {
                    showNotification('User created successfully', 'success');
                    document.getElementById('userModal').classList.remove('active');
                    loadUsersTable();
                } else {
                    showNotification(data.message || 'Error creating user', 'error');
                }
            }
        } catch (error) {
            console.error('Error creating/updating user:', error);
            showNotification('Server error creating/updating user', 'error');
        }
    }

    // Add user button
    document.getElementById('addUserBtn').addEventListener('click', () => 
    {
        openUserModal();
    });

    // Settings save
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        showNotification('Settings saved successfully', 'success');
    });

    // Export functions
    document.getElementById('exportUsersBtn').addEventListener('click', async () => {
        showLoading();
        try {
            const resp = await fetch('/car-rental/api_users.php', { credentials: 'same-origin' });
            const data = await resp.json();
            console.log('export users', data);

            if (!data.success) {
                showNotification(data.message || 'Failed to fetch users', 'error');
                return;
            }

            const users = data.data || [];
            if (users.length === 0) {
                showNotification('No users to export', 'warning');
                return;
            }

            // Build CSV
            const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Join Date'];
            const rows = users.map(u => {
                const id = u.id || '';
                const name = (u.name || '').replace(/"/g, '""');
                const email = (u.email || '').replace(/"/g, '""');
                const role = (u.role || 'User');
                const status = (u.status || 'active');
                const joinDate = (u.joinDate || '');
                return `${id},"${name}","${email}","${role}","${status}","${joinDate}"`;
            });

            const csv = headers.join(',') + '\n' + rows.join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const dateStr = new Date().toISOString().slice(0,10);
            a.download = `users-${dateStr}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            showNotification('Users exported successfully', 'success');
        } catch (err) {
            console.error('Error exporting users:', err);
            showNotification('Error exporting users', 'error');
        } finally {
            hideLoading();
        }
    });

    document.getElementById('exportBookingsBtn').addEventListener('click', () => {
        showNotification('Bookings exported successfully', 'success');
    });

    // Search functionality
    document.getElementById('userSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#usersTableBody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    document.getElementById('bookingSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#bookingsTableBody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Properties Management
    let propertiesData = [];
    let currentPropertyId = null;

    // Load properties
    async function loadProperties() 
    {
        try 
        {
            const response = await fetch('../api_properties.php');
            const data = await response.json();

            if(data.success) 
            {
                propertiesData = data.data;
                renderPropertiesGrid();
                updatePropertiesStats();
            }
            else 
            {
                showNotification('Failed to load properties', 'error');
            }
        } 
        catch (error) 
        {
            console.error('Error loading properties:', error);
            showNotification('Error loading properties', 'error');
        }
    }

    // Render properties grid
    function renderPropertiesGrid()
    {
        const grid = document.getElementById('propertiesGrid');
        grid.innerHTML = '';

        if (propertiesData.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-building"></i>
                    <h3>No Properties Found</h3>
                    <p>Get started by adding your first property</p>
                    <button class="btn-primary" onclick="openPropertyModal()">
                        <i class="fas fa-plus"></i> Add Property
                    </button>
                </div>
            `;
            return;
        }

        propertiesData.forEach(property => {
            const propertyCard = createPropertyCard(property);
            grid.appendChild(propertyCard);
        });
    }

    // Create property card
    function createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image">
                <img src="${property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${property.title}">
                <div class="property-status status-${property.status}">
                    ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
                ${property.featured ? '<div class="property-featured"><i class="fas fa-star"></i> Featured</div>' : ''}
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.city}, ${property.country}
                </p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} bed${property.bedrooms !== 1 ? 's' : ''}</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} bath${property.bathrooms !== 1 ? 's' : ''}</span>
                    <span><i class="fas fa-users"></i> ${property.max_guests} guest${property.max_guests !== 1 ? 's' : ''}</span>
                </div>
                <div class="property-rating">
                    <div class="rating-stars">
                        ${generateStars(property.rating)}
                    </div>
                    <span class="rating-text">${property.rating > 0 ? property.rating.toFixed(1) : 'No rating'} (${property.review_count} reviews)</span>
                </div>
                <div class="property-price">
                    <span class="price-amount">$${property.price}</span>
                    <span class="price-unit">/night</span>
                </div>
                <div class="property-actions">
                    <button class="btn-secondary btn-sm" onclick="viewProperty(${property.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-primary btn-sm" onclick="editProperty(${property.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger btn-sm" onclick="deleteProperty(${property.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    // Update properties statistics
    function updatePropertiesStats() {
        const totalProperties = propertiesData.length;
        const activeProperties = propertiesData.filter(p => p.status === 'active').length;
        const featuredProperties = propertiesData.filter(p => p.featured).length;
        const avgRating = propertiesData.length > 0 ?
            (propertiesData.reduce((sum, p) => sum + parseFloat(p.rating), 0) / propertiesData.length).toFixed(1) : 0;

        // Update stats in overview if they exist
        const totalPropertiesEl = document.getElementById('totalProperties');
        if (totalPropertiesEl) totalPropertiesEl.textContent = totalProperties;

        const activePropertiesEl = document.getElementById('activeProperties');
        if (activePropertiesEl) activePropertiesEl.textContent = activeProperties;

        const featuredPropertiesEl = document.getElementById('featuredProperties');
        if (featuredPropertiesEl) featuredPropertiesEl.textContent = featuredProperties;
    }

    // Open property modal for add/edit
    function openPropertyModal(propertyId = null) {
        currentPropertyId = propertyId;
        const modal = document.getElementById('propertyModal');
        const modalTitle = document.getElementById('propertyModalTitle');
        const form = document.getElementById('propertyForm');

        if (propertyId) {
            // Edit mode
            modalTitle.textContent = 'Edit Property';
            const property = propertiesData.find(p => p.id == propertyId);
            if (property) {
                populatePropertyForm(property);
            }
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Property';
            form.reset();
            document.getElementById('propertyImages').value = '';
            document.getElementById('propertyAmenities').value = '';
        }

        modal.classList.add('active');
    }

    // Populate form with property data
    function populatePropertyForm(property) {
        document.getElementById('propertyTitle').value = property.title;
        document.getElementById('propertyDescription').value = property.description;
        document.getElementById('propertyPrice').value = property.price;
        document.getElementById('propertyLocation').value = property.location;
        document.getElementById('propertyCity').value = property.city;
        document.getElementById('propertyCountry').value = property.country;
        document.getElementById('propertyType').value = property.property_type;
        document.getElementById('propertyBedrooms').value = property.bedrooms;
        document.getElementById('propertyBathrooms').value = property.bathrooms;
        document.getElementById('propertyMaxGuests').value = property.max_guests;
        document.getElementById('propertyStatus').value = property.status;
        document.getElementById('propertyFeatured').checked = property.featured;
        document.getElementById('propertyLatitude').value = property.latitude || '';
        document.getElementById('propertyLongitude').value = property.longitude || '';

        // Handle images
        if (property.images && Array.isArray(property.images)) {
            document.getElementById('propertyImages').value = property.images.join('\n');
        }

        // Handle amenities
        if (property.amenities && Array.isArray(property.amenities)) {
            document.getElementById('propertyAmenities').value = property.amenities.join('\n');
        }
    }

    // Save property
    async function saveProperty() {
        const formData = new FormData(document.getElementById('propertyForm'));

        const propertyData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            location: formData.get('location'),
            city: formData.get('city'),
            country: formData.get('country'),
            property_type: formData.get('property_type'),
            bedrooms: parseInt(formData.get('bedrooms')),
            bathrooms: parseFloat(formData.get('bathrooms')),
            max_guests: parseInt(formData.get('max_guests')),
            status: formData.get('status'),
            featured: formData.get('featured') === 'on',
            latitude: formData.get('latitude') ? parseFloat(formData.get('latitude')) : null,
            longitude: formData.get('longitude') ? parseFloat(formData.get('longitude')) : null,
            images: formData.get('images') ? formData.get('images').split('\n').filter(url => url.trim()) : [],
            amenities: formData.get('amenities') ? formData.get('amenities').split('\n').filter(a => a.trim()) : []
        };

        // Validate required fields
        const requiredFields = ['title', 'description', 'price', 'location', 'city', 'country', 'property_type'];
        for (const field of requiredFields) {
            if (!propertyData[field]) {
                showNotification(`Please fill in the ${field.replace('_', ' ')} field`, 'error');
                return;
            }
        }

        try {
            let response;
            if (currentPropertyId) {
                // Update existing property
                propertyData.id = currentPropertyId;
                response = await fetch('../api_properties.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(propertyData)
                });
            } else {
                // Create new property
                response = await fetch('../api_properties.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(propertyData)
                });
            }

            const data = await response.json();

            if (data.success) {
                showNotification(data.message, 'success');
                document.getElementById('propertyModal').classList.remove('active');
                loadProperties();
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error('Error saving property:', error);
            showNotification('Error saving property', 'error');
        }
    }

    // Delete property
    async function deleteProperty(propertyId) {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`../api_properties.php?id=${propertyId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                showNotification(data.message, 'success');
                loadProperties();
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting property', 'error');
            showNotification('Error deleting property', 'error');
        }
    }

    // View property details
    function viewProperty(propertyId) {
        const property = propertiesData.find(p => p.id == propertyId);
        if (!property) return;

        // Create a detailed view modal or redirect to property page
        const detailView = `
            <div class="property-detail-view">
                <div class="property-detail-header">
                    <h2>${property.title}</h2>
                    <div class="property-detail-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${property.location}, ${property.city}, ${property.country}</span>
                        <span><i class="fas fa-star"></i> ${property.rating.toFixed(1)} (${property.review_count} reviews)</span>
                    </div>
                </div>
                <div class="property-detail-images">
                    ${property.images && property.images.length > 0 ?
                        property.images.map(img => `<img src="${img}" alt="${property.title}">`).join('') :
                        '<img src="https://via.placeholder.com/600x400?text=No+Image" alt="No image">'
                    }
                </div>
                <div class="property-detail-content">
                    <div class="property-detail-section">
                        <h3>About this property</h3>
                        <p>${property.description}</p>
                    </div>
                    <div class="property-detail-section">
                        <h3>Details</h3>
                        <div class="property-specs">
                            <div class="spec-item">
                                <i class="fas fa-bed"></i>
                                <span>${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-bath"></i>
                                <span>${property.bathrooms} bathroom${property.bathrooms !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-users"></i>
                                <span>Up to ${property.max_guests} guest${property.max_guests !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-home"></i>
                                <span>${property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</span>
                            </div>
                        </div>
                    </div>
                    ${property.amenities && property.amenities.length > 0 ? `
                    <div class="property-detail-section">
                        <h3>Amenities</h3>
                        <div class="amenities-grid">
                            ${property.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                    <div class="property-detail-section">
                        <h3>Pricing</h3>
                        <div class="pricing-info">
                            <div class="price-display">
                                <span class="price-amount">$${property.price}</span>
                                <span class="price-unit">per night</span>
                            </div>
                            <div class="property-status-display status-${property.status}">
                                Status: ${property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                ${property.featured ? ' (Featured)' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Show in a modal or new window
        showPropertyDetailModal(detailView);
    }

    // Edit property
    function editProperty(propertyId) {
        openPropertyModal(propertyId);
    }

    // Show property detail modal
    function showPropertyDetailModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h3>Property Details</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Properties event listeners
    document.getElementById('addPropertyBtn').addEventListener('click', () => openPropertyModal());
    document.getElementById('propertyModalSave').addEventListener('click', saveProperty);
    document.getElementById('propertyModalCancel').addEventListener('click', () => {
        document.getElementById('propertyModal').classList.remove('active');
    });

    // Initialize dashboard
    initDashboard();

    // Show welcome message
    setTimeout(() => {
        showNotification(`Welcome back, ${currentUser}!`, 'success');
    }, 1000);
});
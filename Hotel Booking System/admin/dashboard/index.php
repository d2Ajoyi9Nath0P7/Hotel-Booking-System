<?php

ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();



if(!isset($_SESSION['admin_id'])) {
    header("Location: ../admin-login.html");
    exit();
}
$admin_username = $_SESSION['admin_username'];
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Car Rental System</title>
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <i class="fas fa-crown"></i>
                <span>Admin Panel</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-section">
                <h3>Dashboard</h3>
                <a href="#overview" class="nav-link active" data-section="overview">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Overview</span>
                </a>
                <a href="#analytics" class="nav-link" data-section="analytics">
                    <i class="fas fa-chart-line"></i>
                    <span>Analytics</span>
                </a>
            </div>

            <div class="nav-section">
                <h3>Management</h3>
                <a href="#users" class="nav-link" data-section="users">
                    <i class="fas fa-users"></i>
                    <span>Users</span>
                </a>



                <a href="#bookings" class="nav-link" data-section="bookings">
                    <i class="fas fa-calendar-check"></i>
                    <span>Bookings</span>
                </a>
                <a href="#properties" class="nav-link" data-section="properties">
                    <i class="fas fa-building"></i>
                    <span>Properties</span>
                </a>
                <a href="#payments" class="nav-link" data-section="payments">
                    <i class="fas fa-credit-card"></i>
                    <span>Payments</span>
                </a>
            </div>

            <div class="nav-section">
                <h3>Content</h3>
                <a href="#content" class="nav-link" data-section="content">
                    <i class="fas fa-edit"></i>
                    <span>Content</span>
                </a>
                <a href="#media" class="nav-link" data-section="media">
                    <i class="fas fa-images"></i>
                    <span>Media</span>
                </a>
                <a href="#reviews" class="nav-link" data-section="reviews">
                    <i class="fas fa-star"></i>
                    <span>Reviews</span>
                </a>
            </div>

            <div class="nav-section">
                <h3>System</h3>
                <a href="#settings" class="nav-link" data-section="settings">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
                <a href="#security" class="nav-link" data-section="security">
                    <i class="fas fa-shield-alt"></i>
                    <span>Security</span>
                </a>
                <a href="#logs" class="nav-link" data-section="logs">
                    <i class="fas fa-history"></i>
                    <span>Logs</span>
                </a>
            </div>
        </nav>

        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="user-details">
                    <!-- <span class="user-name" id="currentUser">Admin</span> -->
                     <span class="user-name" id="currentUser"><?php echo htmlspecialchars($admin_username); ?></span>
                    <span class="user-role">Super Admin</span>

                </div>
            </div>
            <button class="logout-btn" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" id="mobileOverlay"></div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Top Header -->
        <header class="top-header">
            <div class="header-left">
                <h1 id="pageTitle">Dashboard Overview</h1>
                <p id="pageSubtitle">Welcome back, manage your system efficiently</p>
            </div>
            <div class="header-right">
                <div class="header-actions">

                    <a href="../../Home.php" class="sidebar-toggle action-btn" title="Back to Home" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="fas fa-home"></i>
                    </a>

                    <button class="sidebar-toggle action-btn" id="sidebarToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <button class="action-btn" id="refreshBtn">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="action-btn" id="notificationsBtn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    <div class="time-display">
                        <i class="fas fa-clock"></i>
                        <span id="currentTime">12:00 PM</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <main class="dashboard-content">
            <!-- Overview Section -->
            <section id="overview-section" class="content-section active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalUsers">1,234</h3>
                            <p>Total Users</p>
                            <span class="stat-change positive">+12%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalBookings">567</h3>
                            <p>Active Bookings</p>
                            <span class="stat-change positive">+8%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalProperties">89</h3>
                            <p>Properties</p>
                            <span class="stat-change neutral">0%</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalRevenue">$45,678</h3>
                            <p>Revenue</p>
                            <span class="stat-change positive">+15%</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-charts">
                    <div class="chart-container">
                        <h3>Revenue Overview</h3>
                        <canvas id="revenueChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>User Growth</h3>
                        <canvas id="userChart"></canvas>
                    </div>
                </div>

                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list" id="activityList">
                        <!-- Activity items will be populated by JavaScript -->
                    </div>
                </div>
            </section>

            <!-- Users Section -->
            <section id="users-section" class="content-section">
                <div class="section-header">
                    <h2>User Management</h2>

                    <div class="section-actions">

                        <button class="btn-primary" id="addUserBtn">
                            <i class="fas fa-plus"></i> Add User
                        </button>

                        <button class="btn-secondary" id="exportUsersBtn">
                            <i class="fas fa-download"></i> Export
                        </button>

                    </div>
                </div>

                <div class="filters-bar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search users..." id="userSearch">
                    </div>
                    <select id="userFilter">
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div class="data-table-container">
                    <table class="data-table" id="usersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <!-- User data will be populated by JavaScript -->
                             
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn" id="prevPage">&laquo; Previous</button>
                    <span class="page-info" id="pageInfo">Page 1 of 5</span>
                    <button class="page-btn" id="nextPage">Next &raquo;</button>
                </div>
            </section>

            <!-- Bookings Section -->
            <section id="bookings-section" class="content-section">
                <div class="section-header">
                    <h2>Booking Management</h2>
                    <div class="section-actions">
                        <button class="btn-primary" id="addBookingBtn">
                            <i class="fas fa-plus"></i> New Booking
                        </button>
                        <button class="btn-secondary" id="exportBookingsBtn">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                <div class="filters-bar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search bookings..." id="bookingSearch">
                    </div>
                    <select id="bookingFilter">
                        <option value="all">All Bookings</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div class="data-table-container">
                    <table class="data-table" id="bookingsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Guest</th>
                                <th>Property</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="bookingsTableBody">
                            <!-- Booking data will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Properties Section -->
            <section id="properties-section" class="content-section">
                <div class="section-header">
                    <h2>Property Management</h2>
                    <div class="section-actions">
                        <button class="btn-primary" id="addPropertyBtn">
                            <i class="fas fa-plus"></i> Add Property
                        </button>
                        <button class="btn-secondary" id="bulkActionsBtn">
                            <i class="fas fa-tasks"></i> Bulk Actions
                        </button>
                    </div>
                </div>

                <div class="properties-grid" id="propertiesGrid">
                    <!-- Property cards will be populated by JavaScript -->
                </div>
            </section>

            <!-- Settings Section -->
            <section id="settings-section" class="content-section">
                <div class="section-header">
                    <h2>System Settings</h2>
                </div>

                <div class="settings-container">
                    <div class="settings-section">
                        <h3>General Settings</h3>
                        <div class="setting-group">
                            <label for="siteTitle">Site Title</label>
                            <input type="text" id="siteTitle" value="Car Rental System">
                        </div>
                        <div class="setting-group">
                            <label for="siteDescription">Site Description</label>
                            <textarea id="siteDescription">Premium car rental services</textarea>
                        </div>
                        <div class="setting-group">
                            <label for="contactEmail">Contact Email</label>
                            <input type="email" id="contactEmail" value="admin@carrental.com">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Security Settings</h3>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="twoFactorAuth" checked>
                                Enable Two-Factor Authentication
                            </label>
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="sessionTimeout" checked>
                                Auto-logout inactive users
                            </label>
                        </div>
                        <div class="setting-group">
                            <label for="passwordPolicy">Password Policy</label>
                            <select id="passwordPolicy">
                                <option value="basic">Basic (8+ chars)</option>
                                <option value="medium" selected>Medium (8+ chars, mixed case)</option>
                                <option value="strong">Strong (12+ chars, complex)</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Email Settings</h3>
                        <div class="setting-group">
                            <label for="smtpHost">SMTP Host</label>
                            <input type="text" id="smtpHost" value="smtp.gmail.com">
                        </div>
                        <div class="setting-group">
                            <label for="smtpPort">SMTP Port</label>
                            <input type="number" id="smtpPort" value="587">
                        </div>
                        <div class="setting-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="emailNotifications" checked>
                                Enable Email Notifications
                            </label>
                        </div>
                    </div>

                    <div class="settings-actions">
                        <button class="btn-primary" id="saveSettingsBtn">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                        <button class="btn-secondary" id="resetSettingsBtn">
                            <i class="fas fa-undo"></i> Reset to Default
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modals -->
    <!-- User Modal -->
    <div class="modal" id="userModal">
        <div class="modal-content large">
            <div class="modal-header">
                <h3 id="userModalTitle">Add New User</h3>
                <button class="modal-close" id="userModalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="userFirstName">First Name</label>
                            <input type="text" id="userFirstName" required>
                        </div>
                        <div class="form-group">
                            <label for="userLastName">Last Name</label>
                            <input type="text" id="userLastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email</label>
                        <input type="email" id="userEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="userRole">Role</label>
                        <select id="userRole">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="userStatus">Status</label>
                        <select id="userStatus">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="userModalCancel">Cancel</button>
                <button class="btn-primary" id="userModalSave">Save User</button>
            </div>
        </div>
    </div>

    <!-- Notifications Panel -->
    <div class="notifications-panel" id="notificationsPanel">
        <div class="notifications-header">
            <h3>Notifications</h3>
            <button class="close-notifications" id="closeNotifications">&times;</button>
        </div>
        <div class="notifications-list" id="notificationsList">
            <!-- Notifications will be populated by JavaScript -->
        </div>
    </div>

    <!-- Property Modal -->
    <div class="modal" id="propertyModal">
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3 id="propertyModalTitle">Add New Property</h3>
                <button class="modal-close" onclick="document.getElementById('propertyModal').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="propertyForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="propertyTitle">Property Title *</label>
                            <input type="text" id="propertyTitle" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="propertyType">Property Type *</label>
                            <select id="propertyType" name="property_type" required>
                                <option value="">Select Type</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="condo">Condo</option>
                                <option value="cottage">Cottage</option>
                                <option value="studio">Studio</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="propertyDescription">Description *</label>
                        <textarea id="propertyDescription" name="description" rows="4" required></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="propertyPrice">Price per Night ($) *</label>
                            <input type="number" id="propertyPrice" name="price" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="propertyStatus">Status</label>
                            <select id="propertyStatus" name="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="propertyLocation">Location *</label>
                            <input type="text" id="propertyLocation" name="location" required>
                        </div>
                        <div class="form-group">
                            <label for="propertyCity">City *</label>
                            <input type="text" id="propertyCity" name="city" required>
                        </div>
                        <div class="form-group">
                            <label for="propertyCountry">Country *</label>
                            <input type="text" id="propertyCountry" name="country" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="propertyBedrooms">Bedrooms</label>
                            <input type="number" id="propertyBedrooms" name="bedrooms" min="0" value="1">
                        </div>
                        <div class="form-group">
                            <label for="propertyBathrooms">Bathrooms</label>
                            <input type="number" id="propertyBathrooms" name="bathrooms" step="0.5" min="0" value="1">
                        </div>
                        <div class="form-group">
                            <label for="propertyMaxGuests">Max Guests</label>
                            <input type="number" id="propertyMaxGuests" name="max_guests" min="1" value="2">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="propertyLatitude">Latitude (Optional)</label>
                            <input type="number" id="propertyLatitude" name="latitude" step="any">
                        </div>
                        <div class="form-group">
                            <label for="propertyLongitude">Longitude (Optional)</label>
                            <input type="number" id="propertyLongitude" name="longitude" step="any">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="propertyImages">Images (One URL per line)</label>
                        <textarea id="propertyImages" name="images" rows="3" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="propertyAmenities">Amenities (One per line)</label>
                        <textarea id="propertyAmenities" name="amenities" rows="3" placeholder="WiFi&#10;Air Conditioning&#10;Kitchen"></textarea>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="propertyFeatured" name="featured">
                            Mark as Featured Property
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="propertyModalCancel">Cancel</button>
                <button class="btn-primary" id="propertyModalSave">Save Property</button>
            </div>
        </div>
    </div>
    <!-- Booking Modal -->
    <div class="modal" id="bookingModal">
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3 id="bookingModalTitle">Create New Booking</h3>
                <button class="modal-close" onclick="document.getElementById('bookingModal').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="bookingForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookingUser">User</label>
                            <select id="bookingUser" required>
                                <option value="">Select user</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="bookingProperty">Property</label>
                            <select id="bookingProperty" required>
                                <option value="">Select property</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookingCheckIn">Check-in</label>
                            <input type="date" id="bookingCheckIn" required>
                        </div>
                        <div class="form-group">
                            <label for="bookingCheckOut">Check-out</label>
                            <input type="date" id="bookingCheckOut" required>
                        </div>
                        <div class="form-group">
                            <label for="bookingGuests">Guests</label>
                            <input type="number" id="bookingGuests" min="1" value="1" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Total Price</label>
                        <div id="bookingTotal">$0.00</div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="bookingModalCancel">Cancel</button>
                <button class="btn-primary" id="bookingModalSave">Save Booking</button>
            </div>
        </div>
    </div>
    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="dashboard.js"></script>
</body>
</html>
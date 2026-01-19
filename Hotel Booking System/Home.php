<?php
session_start();//session start

$isLoggedIn = isset($_SESSION['user_id']) || isset($_SESSION['admin_id']);

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airbnb - Vacation Rentals, Cabins, Beach Houses & More</title>
    <link rel="stylesheet" href="home-style.css">
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="header-container">
            <!-- Logo -->
            <div class="logo">
                <a href="Home.php">
                    <img src="img/airbnb.png" alt="AirBnB Logo" class="logo-icon">
                    <h2>airbnb</h2>
                </a>
            </div>
            
            <!-- Navigation Bar -->
            <nav class="nav-menu">
                <a href="#" class="nav-item active">
                    <span>Homes</span>
                </a>

                <a href="#" class="nav-item">
                    <span>Experiences</span>
                    <span class="badges">New</span>
                </a>

                <a href="#" class="nav-item">
                    <span>Services</span>
                    <span class="badges">New</span>
                </a>
            </nav>

            <!-- Right Menu -->
            <div class="right-menu">
    <?php if (!$isLoggedIn): ?>
        <a href="login.html" class="login-btn">Log in</a>
        <a href="register.html" class="signup-btn">Sign up</a>
    <?php endif; ?>

    <a href="#" class="become-host">Become a host</a>
    <button class="icon-btn">🌐</button>

    <div class="profile-menu-container">
        <button class="menu-btn" id="homeMenuBtn">
            <span>☰</span>
            <span class="user-icon">👤</span>
            
        </button>

        <div class="dropdown-menu" id="homeDropdownMenu">
            <?php if ($isLoggedIn): ?>
                <div class="dropdown-item" onclick="window.location.href='profile/index.html'">
                    <i class="fas fa-heart"></i>
                    <span>Wishlists</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-suitcase"></i>
                    <span>Trips</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-comments"></i>
                    <span>Messages</span>
                </div>
                <div class="dropdown-item" onclick="window.location.href='profile/index.html'">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </div>
                <div class="dropdown-divider"></div>

                <div class="dropdown-item" onclick="window.location.href='logout.php'">
                    <i class="fas fa-sign-out-alt"></i>
                    <span style="color: #ff385c; font-weight: bold;">Log out</span>
                </div>
                
            <?php else: ?>
                <div class="dropdown-item" onclick="window.location.href='login.html'">
                    <b>Log in</b>
                </div>
                <div class="dropdown-item" onclick="window.location.href='register.html'">
                    <span>Sign up</span>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                    <span>Help Center</span>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
        </div>
    </header>


    <!-- Search Section -->
    <section class="search-section">
        <div class="search-container">
            <div class="search-bar">
                <!-- Where -->
                <div class="search-item" id="whereSection">
                    <label>Where</label>
                    <input type="text" placeholder="Search destinations" id="whereInput">
                    
                    <!-- Dropdown Suggestions -->
                    <div class="suggestions-dropdown" id="suggestionsDropdown" aria-hidden="true">
                        <div class="dropdown-inner">
                            <div class="recent-section">
                                <h4>Recent searches</h4>

                                <div class="recent-item suggestion-item">
                                    <div class="suggestion-icon recent-icon">🏙️</div>
                                    <div class="suggestion-text">
                                        <h5>Dhaka</h5>
                                        <p>Jan 1, 2026 – Jan 1, 2027 · 2 guests</p>
                                    </div>
                                </div>
                            </div>

                            <div class="dropdown-divider small"></div>

                            <div class="suggested-section">
                                <h4>Suggested destinations</h4>

                                <div class="suggestion-list">
                                    <div class="suggestion-item">
                                        <div class="suggestion-icon">📍</div>
                                        <div class="suggestion-text">
                                            <h5>Nearby</h5>
                                            <p>Find what's around you</p>
                                        </div>
                                    </div>

                                    <div class="suggestion-item">
                                        <div class="suggestion-icon">🏙️</div>
                                        <div class="suggestion-text">
                                            <h5>Kolkata, India</h5>
                                            <p>For sights like Victoria Memorial</p>
                                        </div>
                                    </div>

                                    <div class="suggestion-item">
                                        <div class="suggestion-icon">🌄</div>
                                        <div class="suggestion-text">
                                            <h5>Sylhet, Bangladesh</h5>
                                            <p>Tea gardens & nature</p>
                                        </div>
                                    </div>

                                    <div class="suggestion-item">
                                        <div class="suggestion-icon">🏖️</div>
                                        <div class="suggestion-text">
                                            <h5>Cox's Bazar</h5>
                                            <p>Longest natural sea beach</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="divider"></div>
        
                <!-- Check In -->
                <div class="search-item">
                    <label>Check in</label>
                    <input type="date" id = "checkInInput" placeholder="Add dates">
                    <div class="date-note" id="checkInNote">Dates before today are disabled</div>
                </div>
        
                <div class="divider"></div>
        
                <!-- Check Out -->
                <div class="search-item">
                    <label>Check out</label>
                    <input type="date" id="checkOutInput">
                    <div class="date-note" id="checkOutNote">Select a check-in date first</div>
                </div>
        
                <div class="divider"></div>
        
                <!-- Who -->
                <div class="search-item" id="guestsSection">
                    <label>Who</label>
                    <div class="guests-display" id="guestsDisplay" tabindex="0">Add guests</div>
                    <input type="hidden" id="guestsInput" value="1">

                    <div class="guests-dropdown" id="guestsDropdown" aria-hidden="true">
                        <div class="guest-row">
                            <div class="guest-label">
                                <div class="guest-title">Adults</div>
                                <div class="guest-sub">Ages 13 or above</div>
                            </div>
                            <div class="guest-controls">
                                <button class="guest-decrease" data-type="adults">−</button>
                                <span class="guest-count" data-type="adults">1</span>
                                <button class="guest-increase" data-type="adults">+</button>
                            </div>
                        </div>

                        <div class="divider thin"></div>

                        <div class="guest-row">
                            <div class="guest-label">
                                <div class="guest-title">Children</div>
                                <div class="guest-sub">Ages 2 – 12</div>
                            </div>
                            <div class="guest-controls">
                                <button class="guest-decrease" data-type="children">−</button>
                                <span class="guest-count" data-type="children">0</span>
                                <button class="guest-increase" data-type="children">+</button>
                            </div>
                        </div>

                        <div class="divider thin"></div>

                        <div class="guest-row">
                            <div class="guest-label">
                                <div class="guest-title">Infants</div>
                                <div class="guest-sub">Under 2</div>
                            </div>
                            <div class="guest-controls">
                                <button class="guest-decrease" data-type="infants">−</button>
                                <span class="guest-count" data-type="infants">0</span>
                                <button class="guest-increase" data-type="infants">+</button>
                            </div>
                        </div>

                        <div class="divider thin"></div>

                        <div class="guest-row">
                            <div class="guest-label">
                                <div class="guest-title">Pets</div>
                                <div class="guest-sub"><a href="#">Bringing a service animal?</a></div>
                            </div>
                            <div class="guest-controls">
                                <button class="guest-decrease" data-type="pets">−</button>
                                <span class="guest-count" data-type="pets">0</span>
                                <button class="guest-increase" data-type="pets">+</button>
                            </div>
                        </div>

                        <div class="guests-actions">
                            <button class="btn-apply" id="guestsApply">Apply</button>
                        </div>
                    </div>
                </div>
        
                <!-- Search Button -->
                <button class="search-btn">
                    <span class="search-icon">🔍</span>
                </button>
            </div>
        </div>
    </section>

    <!-- Popular Homes Section -->
    <section class="popular-homes">
        <div class="section-header">
            <h2>Popular homes in Dhaka District <span class="arrow">→</span></h2>
            <button class="nav-arrow-right">›</button>
        </div>

        <div class="homes-container">
            <!-- Card 1 -->
            <div class="home-card" onclick="goToDetails('img/photo-1.jpg', 'Apartment in Dhaka', '$97')" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-1.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$97 <span class="night-text">for 2 nights</span> <span class="rating">★ 5.0</span></p>
                </div>
            </div>

            <!-- Card 2 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-2.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$149 <span class="night-text">for 2 nights</span> <span class="rating">★ 5.0</span></p>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-3.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$169 <span class="night-text">for 2 nights</span> <span class="rating">★ 5.0</span></p>
                </div>
            </div>

            <!-- Card 4 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">

                <div class="card-image">
                    <img src="img/photo-4.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$55 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.89</span></p>
                </div>
            </div>

            <!-- Card 5 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-5.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 5.0</span></p>
                </div>
            </div>

            <!-- Card 6 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-5.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 7 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-1.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 6 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-1.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>
            <!-- Card 7 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-1.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>
            <!-- Card 8-->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="img/photo-1.jpg" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 9 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 10 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 11 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

            <!-- Card 12-->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="https://unsplash.com/photos/black-and-white-bed-near-brown-wooden-table-T5pL6ciEn-I" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>
            <!-- Card 6 -->
            <div class="home-card" onclick="window.location.href='2ndPage.html'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0" alt="Apartment in Dhaka">
                    <div class="favorite-tag">
                        <span class="guest-favorite">Guest favorite</span>
                        <button class="heart-btn">♡</button>
                    </div>
                </div>
                <div class="card-info">
                    <h3>Apartment in Dhaka</h3>
                    <p class="price">$130 <span class="night-text">for 2 nights</span> <span class="rating">★ 4.93</span></p>
                </div>
            </div>

        </div>
    </section>

    <!-- More sections can be added here -->


    <!-- Footer Section -->
<footer class="site-footer">
    <div class="footer-container">

        <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Safety information</a>
            <a href="#">Cancellation options</a>
            <a href="#">Report a concern</a>
        </div>

        <div class="footer-column">
            <h4>Hosting</h4>
            <a href="#">Try hosting</a>
            <a href="#">AirCover for Hosts</a>
            <a href="#">Hosting resources</a>
            <a href="#">Community forum</a>
        </div>

        <div class="footer-column">
            <h4>Airbnb</h4>
            <a href="#">Newsroom</a>
            <a href="#">New features</a>
            <a href="#">Careers</a>
            <a href="#">Investors</a>
        </div>

    </div>

    <div class="footer-bottom">
        <p>© 2025 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
    </div>
</footer>


    <script src="home-script.js"></script>
</body>
</html>
document.addEventListener('DOMContentLoaded', function () {
    // ========================================
    // DATE FUNCTIONALITY
    // ========================================

    const today = new Date();
    // আজকের তারিখ সেট করা হলো
    let checkinDate = new Date(today);

    // চেক-আউট ডেট হিসেবে আগামীকালের তারিখ সেট করা হলো
    let checkoutDate = new Date(today);
    checkoutDate.setDate(today.getDate() + 1);

    // Format dates
    function formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    function formatDateLong(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Calculate nights
    function calculateNights(checkin, checkout) {
        const timeDiff = checkout.getTime() - checkin.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    let nights = calculateNights(checkinDate, checkoutDate);

    // ========================================
    // PRICE CALCULATION
    // ========================================

    const basePrice = 97;
    const cleaningFee = 20;
    const serviceFee = 26;
    let totalPrice = (basePrice * nights) + cleaningFee + serviceFee;

    // Booking Data Object
    let bookingData =
    {
        propertyName: "Citylights - Bashundhara Park Lane Luxe Collection",
        checkInDate: "2026-02-06",
        checkOutDate: "2026-02-08",
        guests: 1,
        pricePerNight: basePrice,
        nights: nights,
        cleaningFee: cleaningFee,
        serviceFee: serviceFee,
        totalPrice: totalPrice
    };




    // ইনপুট এলিমেন্টগুলো সিলেক্ট করা
    const checkIn = document.getElementById('checkInInput');
    const checkOut = document.getElementById('checkOutInput');

    
    function setMinDate() {
        const now = new Date();

        // লোকাল টাইম অনুযায়ী YYYY-MM-DD ফরম্যাট তৈরি (ISO সমস্যা এড়াতে)
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const tom = new Date(now);
        tom.setDate(now.getDate() + 1);
        const tomYear = tom.getFullYear();
        const tomMonth = String(tom.getMonth() + 1).padStart(2, '0');
        const tomDay = String(tom.getDate()).padStart(2, '0');
        const tomorrowStr = `${tomYear}-${tomMonth}-${tomDay}`;

        if (checkIn && checkOut) {
            // ১. আগের তারিখ ব্লক করা
            checkIn.min = todayStr;
            checkOut.min = todayStr;

            // ২. ডিফল্ট ভ্যালু সেট করা (যদি আগে থেকে ডেটা না থাকে)
            if (!checkIn.value) checkIn.value = todayStr;
            if (!checkOut.value) checkOut.value = tomorrowStr;

            // ৩. জাভাস্ক্রিপ্ট অবজেক্ট আপডেট
            bookingData.checkInDate = checkIn.value;
            bookingData.checkOutDate = checkOut.value;
        }
    }


    checkIn.addEventListener('change', function () {
        // চেক-আউটের মিনিমাম হবে চেক-ইনের সিলেক্ট করা তারিখ
        checkOut.min = this.value;

        if (checkOut.value && checkOut.value <= this.value) {
            const nextDay = new Date(this.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOut.value = nextDay.toISOString().split('T')[0];
        }
        updateAllCalculations();
    });

    // ৩. চেক-আউট এর তারিখ পরিবর্তন করলে লজিক আপডেট করা
    checkOut.addEventListener('change', function () {
        // ✅ এই লাইনটিও যোগ করুন
        updateAllCalculations();
    });

    // ৪. ক্যালকুলেশন এবং UI আপডেট করার জন্য একটি কমন ফাংশন
    function updateAllCalculations() {
        if (checkIn.value && checkOut.value) {
            const newIn = new Date(checkIn.value);
            const newOut = new Date(checkOut.value);

            if (newOut > newIn) {
                // ভেরিয়েবল এবং অবজেক্ট আপডেট
                checkinDate = newIn;
                checkoutDate = newOut;
                nights = calculateNights(newIn, newOut);

                bookingData.checkInDate = checkIn.value;
                bookingData.checkOutDate = checkOut.value;
                bookingData.nights = nights;
                bookingData.totalPrice = (basePrice * nights) + cleaningFee + serviceFee;

                // আপনার বানানো UI আপডেট ফাংশনটি কল করা
                updateBookingUI(newIn, newOut, bookingData.guests, nights);
            }
        }
    }

    setMinDate();









    // ========================================
    // RECEIVE DATA FROM HOME PAGE (URL PARAMETERS)
    // ========================================

    const urlParams = new URLSearchParams(window.location.search);
    const receivedWhere = urlParams.get('where');
    const receivedCheckIn = urlParams.get('checkIn');
    const receivedCheckOut = urlParams.get('checkOut');
    const receivedGuests = urlParams.get('guests');

    console.log('Received from Home page:', {
        where: receivedWhere,
        checkIn: receivedCheckIn,
        checkOut: receivedCheckOut,
        guests: receivedGuests
    });

    // ✅ যদি data থাকে, তাহলে booking data update করো
    if (receivedCheckIn && receivedCheckOut) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const newCheckInDate = new Date(receivedCheckIn);
        const newCheckOutDate = new Date(receivedCheckOut);

        // ✅ যদি URL-এর তারিখ আজকের আগের হয়, তবে সেটা সেট করবে না
        if (newCheckInDate >= now) {
            checkinDate = newCheckInDate;
            checkoutDate = newCheckOutDate;
            nights = calculateNights(newCheckInDate, newCheckOutDate);

            bookingData.checkInDate = receivedCheckIn;
            bookingData.checkOutDate = receivedCheckOut;
            bookingData.nights = nights;

            updateBookingUI(newCheckInDate, newCheckOutDate, receivedGuests || 1, nights);
        } else {
            // যদি পুরনো তারিখ হয়, তবে আজকের তারিখ সেট করে দাও
            setMinDate();
            updateAllCalculations();
        }
    }

    // ========================================
    // UPDATE UI WITH RECEIVED DATA
    // ========================================

    function updateBookingUI(checkIn, checkOut, guests, nights) 
    {
        const checkInInput = document.getElementById('checkInInput');
        const checkOutInput = document.getElementById('checkOutInput');

        const toInputString = (dateObj) => {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        // ১. ইনপুট বক্সের ভ্যালু আপডেট
        if (checkInInput && checkIn instanceof Date) {
            checkInInput.value = toInputString(checkIn);
            checkInInput.min = toInputString(new Date());
        }

        if (checkOutInput && checkOut instanceof Date) {
            checkOutInput.value = toInputString(checkOut);
            checkOutInput.min = checkInInput ? checkInInput.value : toInputString(new Date());
        }

        // ২. গেস্ট সংখ্যা আপডেট
        const guestsSpan = document.querySelector('.guests-input span');
        if (guestsSpan) {
            guestsSpan.textContent = guests > 1 ? `${guests} guests` : `${guests} guest`;
        }

        // ৩. ডাইনামিক প্রাইস ক্যালকুলেশন এবং UI আপডেট
        // নিশ্চিত করুন basePrice, cleaningFee, serviceFee আগে ডিফাইন করা আছে
        const newTotalPrice = (basePrice * nights) + cleaningFee + serviceFee;
        const priceBreakdown = document.querySelector('.price-breakdown');

        if (priceBreakdown) {
            priceBreakdown.innerHTML = `
            <div class="price-item">
                <span>$${basePrice} x ${nights} nights</span>
                <span>$${basePrice * nights}</span>
            </div>
            <div class="price-item">
                <span>Cleaning fee</span>
                <span>$${cleaningFee}</span>
            </div>
            <div class="price-item">
                <span>Airbnb service fee</span>
                <span>$${serviceFee}</span>
            </div>
            <div class="price-item total">
                <span>Total</span>
                <span>$${newTotalPrice}</span>
            </div>
        `;
        }

        // ৪. ক্যালেন্ডার টাইটেল আপডেট
        const calendarHeading = document.querySelector('.calendar-section h3');
        if (calendarHeading) {
            calendarHeading.textContent = `${nights} nights in Dhaka`;
        }
    }

    // ========================================
    // INITIAL PRICE DISPLAY (if no URL params)
    // ========================================

    const currentPriceElement = document.querySelector('.current-price');
    const priceNoteElement = document.querySelector('.price-note');

    if (currentPriceElement) {
        currentPriceElement.textContent = `$${basePrice}`;
    }
    if (priceNoteElement && !receivedCheckIn) {
        priceNoteElement.textContent = `for ${nights} nights`;
    }

    // Update price breakdown (initial)
    const priceBreakdown = document.querySelector('.price-breakdown');
    if (priceBreakdown && !receivedCheckIn) {
        priceBreakdown.innerHTML = `
            <div class="price-item">
                <span>$${basePrice} x ${nights} nights</span>
                <span>$${basePrice * nights}</span>
            </div>
            <div class="price-item">
                <span>Cleaning fee</span>
                <span>$${cleaningFee}</span>
            </div>
            <div class="price-item">
                <span>Airbnb service fee</span>
                <span>$${serviceFee}</span>
            </div>
            <div class="price-item total">
                <span>Total</span>
                <span>$${totalPrice}</span>
            </div>
        `;
    }

    // ========================================
    // PROFILE DROPDOWN
    // ========================================

    const profileBtn = document.querySelector('.profile-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (profileBtn && profileDropdown) {

        // বাটন ক্লিক করলে dropdown toggle হবে
        profileBtn.addEventListener('click', function (e) {
            e.stopPropagation();  // click event parent পর্যন্ত না যায়
            profileDropdown.classList.toggle('active');
        });

        // document এ ক্লিক করলে dropdown hide হবে যদি container এ না ক্লিক করা হয়
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.profile-menu-container')) {
                profileDropdown.classList.remove('active');
            }
        });
    }


    

    // ========================================
    // BECOME A HOST MODAL
    // ========================================

    const hostModal = document.getElementById('hostModal');
    const modalClose = document.querySelector('.modal-close');
    const hostLinks = document.querySelectorAll('.host-link, .dropdown-item:nth-child(3)');
    const hostOptions = document.querySelectorAll('.host-option');
    const modalOverlay = document.querySelector('.modal-overlay');

    hostLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.textContent.includes('Become a host')) {
                e.preventDefault();
                hostModal.classList.add('active');
                if (profileDropdown) {
                    profileDropdown.classList.remove('active');
                }
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function () {
            hostModal.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                hostModal.classList.remove('active');
            }
        });
    }

    hostOptions.forEach(option => {
        option.addEventListener('click', function () {
            hostOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // ========================================
    // SEARCH MODALS
    // ========================================

    const searchBtn = document.querySelector('.search-btn');
    const whereModal = document.getElementById('whereModal');
    const whenModal = document.getElementById('whenModal');
    const guestsModal = document.getElementById('guestsModal');
    const searchOptions = document.querySelectorAll('.search-option');

    searchOptions.forEach((option, index) => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            if (index === 0) {
                whereModal.classList.add('active');
            } else if (index === 1) {
                whenModal.classList.add('active');
            } else if (index === 2) {
                guestsModal.classList.add('active');
            }
        });
    });

    // Close search modals
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            this.closest('.modal-overlay').classList.remove('active');
        });
    });

    // Suggestion items click
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function () {
            whereModal.classList.remove('active');
        });
    });

    // ========================================
    // COUNTER BUTTONS (GUESTS)
    // ========================================

    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const counter = this.parentElement;
            const value = counter.querySelector('.counter-value');
            const currentValue = parseInt(value.textContent);

            if (this.textContent === '−' && currentValue > 0) {
                value.textContent = currentValue - 1;
            } else if (this.textContent === '+') {
                value.textContent = currentValue + 1;
            }

            // Update total guests count
            updateTotalGuests();
        });
    });




    // ২. Next বাটন ইভেন্ট লিসেনার
    const nextBtn = document.querySelector('.modal-next-btn');

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault(); // পেজ রিলোড হওয়া বন্ধ করবে

            // ১. আগে গেস্ট এবং প্রাইস আপডেট নিশ্চিত করা
            const currentGuests = updateTotalGuests();

            // ভ্যালিডেশন: অন্তত ১ জন গেস্ট থাকতে হবে
            if (currentGuests === 0) {
                alert("Please add at least 1 guest (Adult).");
                return;
            }

            // ২. টেবিলের জন্য নতুন বুকিং রেকর্ড তৈরি
            // এখন bookingData তে একদম লেটেস্ট প্রাইস এবং গেস্ট সংখ্যা আছে
            const newBookingRecord = {
                id: Math.floor(1000 + Math.random() * 9000), // র‍্যান্ডম আইডি
                guest: "Current User",
                property: bookingData.propertyName || "Citylights Apartment",
                checkIn: bookingData.checkInDate,
                checkOut: bookingData.checkOutDate,
                guests: bookingData.guests,
                status: "PENDING",
                total: `$${bookingData.totalPrice}` // সঠিক প্রাইস
            };

            // ৩. ডাটা সেভ করা (ম্যানেজমেন্ট টেবিলের জন্য)
            if (typeof saveToBookingManagement === 'function') {
                saveToBookingManagement(newBookingRecord);
            } else {
                console.error("saveToBookingManagement function not found!");
            }

            // ৪. মোডাল বন্ধ করা
            const guestsModal = document.getElementById('guestsModal');
            if (guestsModal) {
                guestsModal.classList.remove('active');
            }


            // ✅ ৫. কনফার্মেশন মোডাল ওপেন করা (এটিই মিসিং ছিল সম্ভবত)
            if (typeof showBookingConfirmation === 'function') 
            {
                showBookingConfirmation();
            }
            else 
            {
                // যদি মোডাল ফাংশন না থাকে, অন্তত একটি অ্যালার্ট দেখাবে
                alert("Guest Info Saved! Please proceed to payment.");
                console.error("showBookingConfirmation function not found!");
            }

            // ৫. কনফার্মেশন মেসেজ
            alert(`Guests updated! Total: ${currentGuests}. Booking saved to table.`);
        });
    }
    




    // ========================================
    // BOOKING SYSTEM - GUESTS UPDATE
    // ========================================


    function updateTotalGuests() {
        const guestCounters = document.querySelectorAll('.guest-counter');

        // কন্ডিশন একটু ফ্লেক্সিবল করা (যদি কোনো কারণে ৪টি না পাওয়া যায়)
        if (guestCounters.length > 0) {
            // Safe parsing: প্রতিটির জন্য আলাদা চেক রাখা ভালো
            const adults = parseInt(guestCounters[0]?.querySelector('.counter-value')?.textContent) || 0;
            const children = parseInt(guestCounters[1]?.querySelector('.counter-value')?.textContent) || 0;
            const infants = parseInt(guestCounters[2]?.querySelector('.counter-value')?.textContent) || 0;
            const pets = parseInt(guestCounters[3]?.querySelector('.counter-value')?.textContent) || 0;

            const totalGuests = adults + children;

            // গ্লোবাল ডাটা আপডেট
            bookingData.guests = totalGuests;
            bookingData.infants = infants;
            bookingData.pets = pets;

            // প্রাইস ক্যালকুলেশন (nights জিরো কিনা চেক করা ভালো)
            const currentNights = bookingData.nights || 1;
            const newTotalPrice = (basePrice * currentNights) + cleaningFee + serviceFee;
            bookingData.totalPrice = newTotalPrice;

            // UI আপডেট
            const guestsSpan = document.querySelector('.guests-input span');
            if (guestsSpan) {
                let guestText = totalGuests > 1 ? `${totalGuests} guests` : `${totalGuests} guest`;
                if (infants > 0) guestText += `, ${infants} infant`;
                if (pets > 0) guestText += `, ${pets} pet`;
                guestsSpan.textContent = guestText;
            }

            // মেইন UI রিফ্রেশ
            if (typeof updateBookingUI === "function") {
                updateBookingUI(
                    new Date(bookingData.checkInDate),
                    new Date(bookingData.checkOutDate),
                    totalGuests,
                    currentNights
                );
            }

            console.log("Data Prepared for Next Step:", bookingData);
            return totalGuests;
        } else {
            console.error("No guest counters found with class .guest-counter");
            return 0;
        }
    }



    // Guests input click
    const guestsInput = document.querySelector('.guests-input');
    if (guestsInput) {
        guestsInput.addEventListener('click', function () {
            guestsModal.classList.add('active');
        });
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function generateBookingId() {
        return 'BK' + Date.now().toString().slice(-8);
    }

    function saveBookingToStorage() {
        const booking = {
            id: generateBookingId(),
            ...bookingData,
            bookedAt: new Date().toISOString()
        };

        let bookings = JSON.parse(localStorage.getItem('airbnb_bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('airbnb_bookings', JSON.stringify(bookings));

        console.log('Booking saved:', booking);
    }

    // ========================================
    // BOOKING CONFIRMATION MODAL
    // ========================================

    function showBookingConfirmation() {
        // ১. আগে যদি কোনো কনফার্মেশন মোডাল থেকে থাকে সেটা রিমুভ করুন (যাতে ডুপ্লিকেট না হয়)
        const existingModal = document.getElementById('bookingConfirmationModal');
        if (existingModal) {
            existingModal.remove();
        }

        const confirmationHTML = `
        <div class="modal-overlay active" id="bookingConfirmationModal" style="z-index: 10000;">
            <div class="modal-content booking-confirmation">
                <button class="modal-close" onclick="closeBookingModal()">&times;</button>
                
                <div class="confirmation-header">
                    <i class="fas fa-check-circle" style="color: #00a699; font-size: 48px;"></i>
                    <h2>Confirm Your Booking</h2>
                    <p>Review the details before proceeding</p>
                </div>

                <div class="booking-details">
                    <h3>${bookingData.propertyName}</h3>
                    
                    <div class="detail-row">
                        <span><i class="fas fa-calendar-check"></i> Check-in</span>
                        <strong>${formatDateLong(new Date(bookingData.checkInDate))}</strong>
                    </div>
                    
                    <div class="detail-row">
                        <span><i class="fas fa-calendar-times"></i> Check-out</span>
                        <strong>${formatDateLong(new Date(bookingData.checkOutDate))}</strong>
                    </div>
                    
                    <div class="detail-row">
                        <span><i class="fas fa-moon"></i> Nights</span>
                        <strong>${bookingData.nights} nights</strong>
                    </div>
                    
                    <div class="detail-row">
                        <span><i class="fas fa-users"></i> Guests</span>
                        <strong>${bookingData.guests} guest${bookingData.guests > 1 ? 's' : ''}</strong>
                    </div>

                    <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">

                    <div class="price-summary">
                        <div class="detail-row">
                            <span>$${bookingData.pricePerNight} × ${bookingData.nights} nights</span>
                            <span>$${bookingData.pricePerNight * bookingData.nights}</span>
                        </div>
                        <div class="detail-row">
                            <span>Cleaning fee</span>
                            <span>$${bookingData.cleaningFee}</span>
                        </div>
                        <div class="detail-row">
                            <span>Service fee</span>
                            <span>$${bookingData.serviceFee}</span>
                        </div>
                        <div class="detail-row total-row">
                            <strong>Total (USD)</strong>
                            <strong>$${bookingData.totalPrice}</strong>
                        </div>
                    </div>
                </div>

                <div class="confirmation-actions">
                    <button class="btn-cancel" onclick="closeBookingModal()">Cancel</button>
                    <button class="btn-confirm" onclick="confirmBooking()">
                        <i class="fas fa-lock"></i> Confirm and Pay
                    </button>
                </div>
            </div>
        </div>
    `;

        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    }
    // ========================================
    // BOOKING SUCCESS MODAL
    // ========================================

    function showBookingSuccess() {
        closeBookingModal();

        const bookingId = generateBookingId();

        const successHTML = `
            <div class="modal-overlay active" id="bookingSuccessModal" style="z-index: 10000;">
                <div class="modal-content booking-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    
                    <h2>Booking Confirmed! 🎉</h2>
                    <p>Your reservation has been successfully confirmed.</p>
                    
                    <div class="booking-summary">
                        <h3>Booking Reference: #${bookingId}</h3>
                        <p><strong>Property:</strong> ${bookingData.propertyName}</p>
                        <p><strong>Check-in:</strong> ${formatDateLong(checkinDate)}</p>
                        <p><strong>Check-out:</strong> ${formatDateLong(checkoutDate)}</p>
                        <p><strong>Guests:</strong> ${bookingData.guests}</p>
                        <p><strong>Total Paid:</strong> $${bookingData.totalPrice}</p>
                    </div>

                    <div class="success-actions">
                        <button class="btn-primary" onclick="viewBookingDetails()">
                            <i class="fas fa-file-invoice"></i> View Booking Details
                        </button>
                        <button class="btn-secondary" onclick="closeSuccessModal()">
                            Done
                        </button>
                    </div>

                    <p class="confirmation-note">
                        📧 A confirmation email has been sent to your email address.
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', successHTML);
    }

    // ========================================
    // LOADING SPINNER
    // ========================================

    function showLoadingSpinner() {
        const spinnerHTML = `
            <div class="loading-overlay" id="loadingSpinner">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #ff385c;"></i>
                    <p>Processing your booking...</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', spinnerHTML);
    }

    function hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.remove();
        }
    }

    // ========================================
    // GLOBAL MODAL FUNCTIONS
    // ========================================

    window.closeBookingModal = function () {
        const modal = document.getElementById('bookingConfirmationModal');
        if (modal) {
            modal.remove();
        }
    };

    window.confirmBooking = function () {
    showLoadingSpinner();

    fetch('save_booking.php', { // নিশ্চিত করুন ফাইলের নাম সঠিক
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(result => {
        hideLoadingSpinner();
        
        if (result.success === true) { 
            // ১. সার্ভারে সেভ হওয়ার পরেই কেবল লোকাল স্টোরেজে রাখুন
            saveBookingToStorage(); 
            // ২. তারপর সাকসেস মোডাল দেখান
            showBookingSuccess(); 
        } else {
            alert('Database Error: ' + result.error);
        }
    })
    .catch(error => {
        hideLoadingSpinner();
        console.error('Error:', error);
        alert('Server connection failed!');
    });
};

    window.closeSuccessModal = function () 
    {
        const modal = document.getElementById('bookingSuccessModal');
        if (modal) 
        {
            modal.remove();
        }
    };

    window.viewBookingDetails = function () 
    {
        alert('Redirecting to booking details page...\n\nBooking ID: #' + generateBookingId());
        // You can redirect to a booking confirmation page:
        // window.location.href = 'booking-confirmation.html';
    };

    // ========================================
    // RESERVE BUTTON - MAIN BOOKING ACTION
    // ========================================

    const reserveBtn = document.querySelector('.reserve-btn');
    if (reserveBtn) 
    {
        reserveBtn.addEventListener('click', function () {
            console.log('Reserve button clicked');
            console.log('Current booking data:', bookingData);

            // Validation
            if (bookingData.guests === 0) {
                alert('⚠️ Please add at least 1 guest to continue.');
                if (guestsModal) {
                    guestsModal.classList.add('active');
                }
                return;
            }

            if (bookingData.guests > 6) {
                alert('⚠️ Maximum 6 guests allowed for this property.');
                return;
            }

            // Show confirmation modal
            showBookingConfirmation();
        });
    }

    // ========================================
    // CALENDAR NAVIGATION
    // ========================================

    const prevMonthBtn = document.querySelector('.calendar-nav:first-child');
    const nextMonthBtn = document.querySelector('.calendar-nav:last-child');

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', function () {
            alert('Previous month navigation would show here');
        });

        nextMonthBtn.addEventListener('click', function () {
            alert('Next month navigation would show here');
        });
    }

    // Clear dates button
    const clearDatesBtn = document.querySelector('.clear-dates-btn');
    if (clearDatesBtn) {
        clearDatesBtn.addEventListener('click', function () {
            alert('Dates would be cleared and calendar reset');
        });
    }

    // ========================================
    // SHARE BUTTON
    // ========================================

    const shareBtn = document.querySelector('.header-btn:first-child');
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: 'Citylights - Bashundhara Park Lane Luxe Collection',
                    text: 'Check out this amazing Airbnb listing!',
                    url: window.location.href
                }).catch(err => console.log('Share failed:', err));
            } else {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('✅ Share link copied to clipboard!'))
                    .catch(() => alert('❌ Failed to copy link'));
            }
        });
    }

    // ========================================
    // SAVE BUTTON
    // ========================================

    const saveBtn = document.querySelector('.header-btn:last-child');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const icon = saveBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                saveBtn.style.color = '#ff385c';
                alert('❤️ Listing saved to your wishlist');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                saveBtn.style.color = '#222222';
                alert('Listing removed from your wishlist');
            }
        });
    }

    // ========================================
    // OTHER BUTTONS
    // ========================================

    // Show all amenities
    const showAllAmenitiesBtn = document.querySelector('.show-all-btn');
    if (showAllAmenitiesBtn) {
        showAllAmenitiesBtn.addEventListener('click', function () {
            alert('Would show all 52 amenities in a modal');
        });
    }

    // Show all reviews
    const showAllReviewsBtn = document.querySelector('.show-all-reviews');
    if (showAllReviewsBtn) {
        showAllReviewsBtn.addEventListener('click', function () {
            alert('Would show all 13 reviews');
        });
    }

    // Report listing
    const reportBtn = document.querySelector('.report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function () {
            alert('Report this listing dialog would open');
        });
    }

    // Message host
    const messageHostBtn = document.querySelector('.message-host');
    if (messageHostBtn) {
        messageHostBtn.addEventListener('click', function () {
            alert('Message host dialog would open');
        });
    }

    // Language and currency buttons
    const languageBtn = document.querySelector('.language-btn');
    const currencyBtn = document.querySelector('.currency-btn');

    if (languageBtn) {
        languageBtn.addEventListener('click', function () {
            alert('Language selector would open');
        });
    }

    if (currencyBtn) {
        currencyBtn.addEventListener('click', function () {
            alert('Currency selector would open');
        });
    }

    // Globe button
    const globeBtn = document.querySelector('.globe-btn');
    if (globeBtn) {
        globeBtn.addEventListener('click', function () {
            alert('Language/region selector would open');
        });
    }

    // ========================================
    // LEAFLET MAP INITIALIZATION
    // ========================================

    const mapElement = document.getElementById('map');
    if (mapElement) {
        try {
            // Dhaka, Bangladesh coordinates
            const dhakaCords = [23.8103, 90.4125];

            // Create map
            const map = L.map('map').setView(dhakaCords, 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Add marker for property
            L.marker(dhakaCords).addTo(map)
                .bindPopup('<b>Citylights Property</b><br>Bashundhara Park Lane<br>Dhaka, Bangladesh')
                .openPopup();

            console.log('✅ Map initialized successfully');
        } catch (error) {
            console.error('Map initialization error:', error);
        }
    }

    // ========================================
    // INITIALIZATION COMPLETE
    // ========================================

    console.log('✅ All features loaded successfully!');
    console.log('📋 Booking data initialized:', bookingData);

}); // DOMContentLoaded শেষ
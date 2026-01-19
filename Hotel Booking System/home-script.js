// home-script.js

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // 1. NAVIGATION MENU FUNCTIONALITY
    // ========================================
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ========================================
    // 2. MENU BUTTON (Profile/Login)
    // ========================================
    const menuBtn = document.querySelector('.menu-btn');
    const dropdownMenu = document.getElementById('homeDropdownMenu');
    
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // ========================================
    // 5. SEARCH SECTION - WHERE INPUT & DROPDOWN
    // ========================================
    const whereInput = document.getElementById('whereInput');
    const whereSection = document.getElementById('whereSection');
    const suggestionsDropdown = document.getElementById('suggestionsDropdown');
    let suggestionItems = Array.from(document.querySelectorAll('.suggestion-item'));

    const searchBarEl = document.querySelector('.search-bar');

    function positionSuggestions() {
        if (!suggestionsDropdown || !searchBarEl) return;
        const rect = searchBarEl.getBoundingClientRect();
        // desired dropdown width (max 720px, but not wider than the search bar minus padding)
        const maxWidth = 720;
        const horizontalPadding = 24; // keep some breathing room
        const dropdownWidth = Math.max(280, Math.min(maxWidth, rect.width - horizontalPadding));

        const left = rect.left + (rect.width - dropdownWidth) / 2;
        const top = rect.bottom + 12; // small gap under the search bar

        suggestionsDropdown.style.position = 'fixed';
        suggestionsDropdown.style.width = dropdownWidth + 'px';
        suggestionsDropdown.style.left = left + 'px';
        suggestionsDropdown.style.top = top + 'px';
        suggestionsDropdown.style.transform = 'none';
    }

    if (whereInput) {
        whereInput.addEventListener('focus', () => {
            suggestionsDropdown.classList.add('show');
            suggestionsDropdown.setAttribute('aria-hidden', 'false');
            positionSuggestions();
        });
    }

    function refreshSuggestionItems() {
        suggestionItems = Array.from(document.querySelectorAll('.suggestion-item'));
        suggestionItems.forEach((item, idx) => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('click', function () {
                const h = this.querySelector('h5');
                const locationText = h ? h.textContent : this.textContent.trim();
                whereInput.value = locationText;
                hideSuggestions();
            });
            item.addEventListener('mouseenter', function () { setActiveIndex(idx); });
            item.addEventListener('mouseleave', function () { setActiveIndex(-1); });
        });
    }

    refreshSuggestionItems();

    function hideSuggestions() {
        suggestionsDropdown.classList.remove('show');
        suggestionsDropdown.setAttribute('aria-hidden', 'true');
        suggestionsDropdown.style.position = '';
        suggestionsDropdown.style.left = '';
        suggestionsDropdown.style.top = '';
        suggestionsDropdown.style.width = '';
        setActiveIndex(-1);
    }

    document.addEventListener('click', function (e) {
        if (whereSection && !whereSection.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
            hideSuggestions();
        }
    });

    // reposition on resize/scroll while open
    window.addEventListener('resize', function () { if (suggestionsDropdown.classList.contains('show')) positionSuggestions(); });
    window.addEventListener('scroll', function () {
        if (suggestionsDropdown.classList.contains('show')) {
            hideSuggestions(); // স্ক্রল করলেই ড্রপডাউন বন্ধ হয়ে যাবে, এতে মেমোরি বাঁচবে।
        }
    }, { passive: true });
    // Keyboard navigation for suggestions
    let activeIndex = -1;
    function setActiveIndex(i) {
        activeIndex = i;
        suggestionItems.forEach((it, idx) => {
            if (idx === i) it.classList.add('active'); else it.classList.remove('active');
        });
        if (activeIndex >= 0) {
            const node = suggestionItems[activeIndex];
            node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    whereInput.addEventListener('keydown', function (e) {
        if (!suggestionsDropdown.classList.contains('show')) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(Math.min(activeIndex + 1, suggestionItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(Math.max(activeIndex - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) suggestionItems[activeIndex].click();
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    // allow Enter/Escape on suggestion items too
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && suggestionsDropdown.classList.contains('show')) hideSuggestions();
    });

    // Guests selector behavior (Adults / Children / Infants / Pets)
    (function initGuests() {
        const guestsSection = document.getElementById('guestsSection');
        const guestsDisplay = document.getElementById('guestsDisplay');
        const guestsDropdown = document.getElementById('guestsDropdown');
        const guestsInput = document.getElementById('guestsInput');
        const applyBtn = document.getElementById('guestsApply');

        if (!guestsSection || !guestsDisplay || !guestsDropdown || !guestsInput) return;

        const counters = { adults: 1, children: 0, infants: 0, pets: 0 };
        const limits = {
            adults: { min: 1, max: 16 },
            children: { min: 0, max: 10 },
            infants: { min: 0, max: 5 },
            pets: { min: 0, max: 5 }
        };

        function updateDisplay() {
            const totalGuests = counters.adults + counters.children; // infants not counted
            const parts = [];
            if (totalGuests > 0) parts.push(`${totalGuests} guest${totalGuests>1?'s':''}`);
            if (counters.infants > 0) parts.push(`${counters.infants} infant${counters.infants>1?'s':''}`);
            if (counters.pets > 0) parts.push(`${counters.pets} pet${counters.pets>1?'s':''}`);
            guestsDisplay.textContent = parts.length ? parts.join(' · ') : 'Add guests';
            guestsInput.value = totalGuests;

            document.querySelectorAll('.guest-count').forEach(el => {
                const t = el.getAttribute('data-type');
                el.textContent = counters[t] || 0;
            });

            document.querySelectorAll('.guest-decrease').forEach(btn => {
                const t = btn.getAttribute('data-type');
                btn.disabled = counters[t] <= limits[t].min;
            });
            document.querySelectorAll('.guest-increase').forEach(btn => {
                const t = btn.getAttribute('data-type');
                btn.disabled = counters[t] >= limits[t].max;
            });
        }

        function showGuests() { guestsDropdown.classList.add('show'); guestsDropdown.setAttribute('aria-hidden', 'false'); }
        function hideGuests() { guestsDropdown.classList.remove('show'); guestsDropdown.setAttribute('aria-hidden', 'true'); }

        guestsDisplay.addEventListener('click', function (e) {
            e.stopPropagation();
            if (guestsDropdown.classList.contains('show')) hideGuests(); else showGuests();
        });

        document.addEventListener('click', function (e) {
            if (e.target.matches('.guest-increase')) {
                const t = e.target.getAttribute('data-type');
                if (counters[t] < limits[t].max) counters[t]++;
                updateDisplay();
            }
            if (e.target.matches('.guest-decrease')) {
                const t = e.target.getAttribute('data-type');
                if (counters[t] > limits[t].min) counters[t]--;
                updateDisplay();
            }
        });

        if (applyBtn) applyBtn.addEventListener('click', function (e) { e.stopPropagation(); hideGuests(); });

        document.addEventListener('click', function (e) {
            if (!guestsSection.contains(e.target) && !guestsDropdown.contains(e.target)) hideGuests();
        });

        guestsDisplay.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showGuests(); }
            if (e.key === 'Escape') hideGuests();
        });

        updateDisplay();
    })();

    // ========================================
    // 6. SEARCH BUTTON & REDIRECT
    // ========================================
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const where = document.getElementById('whereInput').value;
            const checkIn = document.getElementById('checkInInput').value;
            const checkOut = document.getElementById('checkOutInput').value;
            const guests = document.getElementById('guestsInput').value;

            if (!where || !checkIn || !checkOut || !guests) {
                alert('Please fill all search fields');
                return;
            }

            window.location.href = `2ndPage.html?where=${encodeURIComponent(where)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
        });
    }

    // ========================================
    // 9. HOME CARDS - HEART BUTTON
    // ========================================
    const heartBtns = document.querySelectorAll('.heart-btn');
    heartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // কার্ড ক্লিক আটকাবে
            if (this.textContent === '♡') {
                this.textContent = '♥';
                this.style.color = '#ff385c';
            } else {
                this.textContent = '♡';
                this.style.color = '#fff';
            }
        });
    });

    // ========================================
    // 10. HOME CARDS - SMART NAVIGATION
    // ========================================
    const homeCards = document.querySelectorAll('.home-card');
    homeCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // লাইক বাটনে ক্লিক করলে যেন ২য় পেজে না যায়
            if (e.target.closest('.heart-btn')) return;

            // ১. কার্ডের ভেতরে থাকা ছবির লিঙ্ক (src) খুঁজে নেওয়া
            const cardImg = this.querySelector('img').src;
            // ২. কার্ডের টাইটেল ও দাম নেওয়া
            const cardTitle = this.querySelector('h3').innerText;
            const cardPrice = this.querySelector('.price').innerText;

            // ৩. এই তথ্যগুলো URL-এর মাধ্যমে ২য় পেজে পাঠানো
            const targetUrl = `2ndPage.html?img=${encodeURIComponent(cardImg)}&title=${encodeURIComponent(cardTitle)}&price=${encodeURIComponent(cardPrice)}`;

            window.location.href = targetUrl;
        });
    });

    // ========================================
    // 11. NAVIGATION ARROW (Right Arrow)
    // ========================================
    const navArrowRight = document.querySelector('.nav-arrow-right');
    const homesContainer = document.querySelector('.homes-container');

    if (navArrowRight && homesContainer) {
        navArrowRight.addEventListener('click', function () {
            homesContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    console.log('✅ Home page JavaScript loaded successfully!');
});

// ======================
// Date inputs helpers
// ======================
document.addEventListener('DOMContentLoaded', function () {
    const checkIn = document.getElementById('checkInInput');
    const checkOut = document.getElementById('checkOutInput');
    const checkInNote = document.getElementById('checkInNote');
    const checkOutNote = document.getElementById('checkOutNote');

    if (!checkIn || !checkOut) return;

    function todayString() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const today = todayString();
    checkIn.setAttribute('min', today);
    checkOut.setAttribute('min', today);

    // When check-in changes, ensure check-out min is at least check-in
    checkIn.addEventListener('change', function () {
        if (!this.value) return;
        // set checkOut min to selected checkIn
        checkOut.setAttribute('min', this.value);
        // if checkOut is before checkIn, clear it
        if (checkOut.value && checkOut.value < this.value) checkOut.value = '';
        if (checkOutNote) checkOutNote.textContent = 'Select check-out date';
    });

    // show notes on focus
    [checkIn, checkOut].forEach((el) => {
        const note = el.id === 'checkInInput' ? checkInNote : checkOutNote;
        el.addEventListener('focus', () => { if (note) note.classList.add('show'); });
        el.addEventListener('blur', () => { if (note) setTimeout(() => note.classList.remove('show'), 120); });
    });

    // validation on search button or form submit (if used)
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            const inDate = checkIn.value;
            const outDate = checkOut.value;
            if (inDate && inDate < today) { e.preventDefault(); alert('Check-in date cannot be before today'); return; }
            if (outDate && outDate < today) { e.preventDefault(); alert('Check-out date cannot be before today'); return; }
            if (inDate && outDate && outDate < inDate) { e.preventDefault(); alert('Check-out must be after check-in'); return; }
        });
    }
});
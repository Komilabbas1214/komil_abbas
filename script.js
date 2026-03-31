// Adding scroll event to Navbar for dynamic styling
document.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow');
    } else {
        nav.classList.remove('shadow');
    }
});

// Smooth scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- Real Booking Logic & Geolocation ---

// 1. Locate Me functionality using OpenStreetMap Nominatim API
const locateBtn = document.getElementById('locateMeBtn');
const pickupInput = document.getElementById('pickup');

if (locateBtn && pickupInput) {
    locateBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        const originalIcon = locateBtn.innerHTML;
        locateBtn.innerHTML = '<span class="spinner-border spinner-border-sm text-brand" role="status" aria-hidden="true"></span>';
        pickupInput.placeholder = "Finding your location...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Reverse geocoding
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.display_name) {
                            pickupInput.value = data.display_name;
                        } else {
                            pickupInput.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                        }
                    })
                    .catch(err => {
                        console.error("Geocoding error:", err);
                    })
                    .finally(() => {
                        locateBtn.innerHTML = originalIcon;
                        pickupInput.placeholder = "Pickup Location";
                    });
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location.");
                locateBtn.innerHTML = originalIcon;
                pickupInput.placeholder = "Pickup Location";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}

// 2. Drop-off Location Live Autocomplete (OpenStreetMap Nominatim)
const dropoffInput = document.getElementById('dropoff');
const suggestionsList = document.getElementById('dropoffSuggestions');
let timeoutId;

if (dropoffInput && suggestionsList) {
    dropoffInput.addEventListener('input', function() {
        const query = this.value.trim();
        clearTimeout(timeoutId);

        if (query.length < 3) {
            suggestionsList.classList.remove('show');
            suggestionsList.innerHTML = '';
            return;
        }

        // Add visual loading indicator on the input
        dropoffInput.classList.add('bg-light');

        timeoutId = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
                .then(response => response.json())
                .then(data => {
                    suggestionsList.innerHTML = '';
                    if (data && data.length > 0) {
                        data.forEach(item => {
                            const li = document.createElement('li');
                            li.innerHTML = `<a class="dropdown-item text-truncate border-bottom py-2" href="#" title="${item.display_name}"><i class="bi bi-geo-alt text-brand me-2"></i>${item.display_name}</a>`;
                            li.addEventListener('click', (e) => {
                                e.preventDefault();
                                dropoffInput.value = item.display_name;
                                suggestionsList.classList.remove('show');
                            });
                            suggestionsList.appendChild(li);
                        });
                        suggestionsList.classList.add('show');
                    } else {
                        suggestionsList.innerHTML = '<li><span class="dropdown-item text-muted">No results found</span></li>';
                        suggestionsList.classList.add('show');
                    }
                })
                .catch(err => console.error("Autocomplete error:", err))
                .finally(() => {
                    dropoffInput.classList.remove('bg-light');
                });
        }, 500); // Debounce delay
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropoffInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.classList.remove('show');
        }
    });
}

// 3. Booking Form Submission & Calculation
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const pickup = document.getElementById('pickup').value;
        const dropoff = document.getElementById('dropoff').value;
        const packageEl = document.getElementById('packageType');
        const weight = parseFloat(document.getElementById('weight').value);
        
        const packageVal = packageEl.value;
        const packageText = packageEl.options[packageEl.selectedIndex].text;

        let basePrice = 10.00;
        let perKgPrice = 2.50;
        let typeFee = 0;

        switch(packageVal) {
            case 'document': typeFee = 0; break;
            case 'box': typeFee = 5.00; break;
            case 'fragile': typeFee = 15.00; break;
            case 'freight': typeFee = 50.00; perKgPrice = 1.00; break;
        }

        let totalCost = basePrice + typeFee + (weight * perKgPrice);

        document.getElementById('modalPickup').textContent = pickup;
        document.getElementById('modalDropoff').textContent = dropoff;
        document.getElementById('modalDetails').textContent = `${packageText} (${weight} kg)`;
        document.getElementById('modalPrice').textContent = '$' + totalCost.toFixed(2);

        const modalEl = document.getElementById('bookingModal');
        const bookingModal = new bootstrap.Modal(modalEl);
        bookingModal.show();
    });
}

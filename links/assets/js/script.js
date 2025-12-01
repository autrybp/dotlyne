// --- CORRECTED: Multi-Language Toggle Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-button');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            const targetLang = this.getAttribute('data-lang');
            
            // --- Logic based on your file structure ---

            // Are we currently in a language sub-folder (like /ar/ or /fr/)?
            const isInSubFolder = currentPath.includes('/ar/') || currentPath.includes('/fr/');

            if (isInSubFolder) {
                // We are in /ar/ or /fr/.
                if (targetLang === 'en') {
                    // Go UP to the English page.
                    window.location.href = '../';
                } else {
                    // Go UP and then DOWN to the other language (e.g., from /ar/ to /fr/).
                    window.location.href = `../${targetLang}/`;
                }
            } else {
                // We are on the English page.
                // Go DOWN into the target language folder.
                window.location.href = `${targetLang}/`;
            }
        });
    });
});


// --- NEW: Preloader Logic with Minimum Display Time ---
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const minimumTime = 1500; // Minimum display time in milliseconds (2 seconds)
    const loadTime = Date.now() - performance.timing.navigationStart;
    const delay = Math.max(minimumTime - loadTime, 0);

    setTimeout(() => {
        preloader.classList.add('fade-out');
        
        // Hide the preloader completely after the fade-out animation
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // This should match the transition duration in your CSS
    }, delay);
});

// --- Existing code to disable right-click ---
document.addEventListener('contextmenu', event => event.preventDefault());


// --- FOOTER COPYRIGHT ---
const copyrightEl = document.getElementById('copyright');
const currentYear = new Date().getFullYear();
copyrightEl.textContent = `© ${currentYear} Dotlyne. All Rights Reserved.`;


// --- TRACKING MODAL LOGIC ---

// Get all the elements we need from the HTML
const trackOrderTrigger = document.getElementById('track-order-trigger');
const modal = document.getElementById('tracking-modal');
const closeModalButton = modal.querySelector('.close-button');
const trackingForm = document.getElementById('tracking-form');

const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const orderNumberInput = document.getElementById('order-number');
const lostOrderCheckbox = document.getElementById('lost-order-number');
const continueButton = document.getElementById('continue-button');

// --- Initialize intl-tel-input library ---
const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: function(callback) {
        fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("us"));
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
});

// --- Function to rename country in the dropdown ---
const renameCountry = () => {
    setTimeout(() => {
        const countryListItem = document.querySelector('.iti__country[data-country-code="il"]');
        if (countryListItem) {
            const countryNameSpan = countryListItem.querySelector('.iti__country-name');
            if (countryNameSpan) {
                countryNameSpan.textContent = 'Occupied Palestinian Territories'; // Typo corrected
            }
            const originalTitle = countryListItem.getAttribute('title');
            if (originalTitle) {
                const newTitle = originalTitle.replace(/Israel/g, 'Occupied Palestinian Territories');
                countryListItem.setAttribute('title', newTitle);
            }
        }
    }, 100);
};

// --- Functions to show and hide the modal ---
const showModal = () => {
    modal.classList.remove('hidden');
    renameCountry();
};

const hideModal = () => {
    modal.classList.add('hidden');
};

// --- Event Listeners to open and close the modal ---
trackOrderTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    showModal();
});

closeModalButton.addEventListener('click', hideModal);

// --- Form Logic ---
const validateForm = () => {
    const isFirstNameValid = firstNameInput.value.trim() !== '';
    const isLastNameValid = lastNameInput.value.trim() !== '';
    const isEmailValid = emailInput.value.trim() !== '' && emailInput.checkValidity();
    const isPhoneValid = iti.isValidNumber();
    const isOrderNumberValid = orderNumberInput.value.trim() !== '' || lostOrderCheckbox.checked;

    if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isOrderNumberValid) {
        continueButton.disabled = false;
    } else {
        continueButton.disabled = true;
    }
};

lostOrderCheckbox.addEventListener('change', () => {
    if (lostOrderCheckbox.checked) {
        orderNumberInput.disabled = true;
        orderNumberInput.required = false;
        orderNumberInput.value = '';
    } else {
        orderNumberInput.disabled = false;
        orderNumberInput.required = true;
    }
    validateForm();
});

[firstNameInput, lastNameInput, emailInput, phoneInput, orderNumberInput].forEach(input => {
    input.addEventListener('input', validateForm);
});
phoneInput.addEventListener('countrychange', validateForm);

trackingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = iti.getNumber();
    const orderNumber = orderNumberInput.value.trim(); // The '#' is visual only, so this value is clean
    const whatsappNumber = '96170656471';

    let message;

    if (lostOrderCheckbox.checked) {
        message = `Hello Dotlyne Team,\nI placed an order but have lost my order number.\nHere are my details so you can help me find it:\n\nFull Name: ${firstName} ${lastName}\nEmail Address: ${email}\nPhone Number: ${phone}\n\nPlease retrieve my order details or resend my order number so I can track it.`;
    } else {
        message = `Hello Dotlyne Team,\nI recently placed an order and would like to track its status.\nHere are my details:\n\nFull Name: ${firstName} ${lastName}\nEmail Address: ${email}\nPhone Number: ${phone}\nOrder Number: #${orderNumber}\n\nPlease provide the latest update on my order.`; // Manually add '#' to the message
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    hideModal();
    trackingForm.reset();
    orderNumberInput.disabled = false;
    continueButton.disabled = true;
});
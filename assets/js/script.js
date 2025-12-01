document.addEventListener('DOMContentLoaded', () => {
    // ======== FULLSCREEN MENU LOGIC ========
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const fullScreenMenu = document.getElementById('fullscreen-menu');

    if (hamburgerMenu && fullScreenMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            fullScreenMenu.classList.toggle('menu-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // ======== FULLSCREEN MENU DROPDOWN LOGIC ========
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const menuCategory = toggle.closest('.menu-category');
            if (menuCategory) {
                menuCategory.classList.toggle('is-open');
                const isOpen = menuCategory.classList.contains('is-open');
                toggle.setAttribute('aria-expanded', isOpen);
            }
        });
    });

    // ======== SEARCH OVERLAY LOGIC ========
    const searchIcon = document.getElementById('search-icon');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search');

    if (searchIcon && searchOverlay && closeSearchBtn) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('is-active');
            document.body.classList.add('no-scroll');
        });

        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('is-active');
            // Only remove no-scroll if cart isn't open
            if (!document.querySelector('.side-cart.is-active')) {
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ======== SIDE CART LOGIC ========
    const cartIcon = document.getElementById('cart-icon');
    const sideCart = document.getElementById('side-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const checkoutButton = document.getElementById('checkout-button');
    const cartBody = sideCart.querySelector('.cart-body');

    const updateCartState = () => {
        const isEmpty = cartBody.querySelector('.empty-cart-message') !== null;
        
        if (isEmpty) {
            checkoutButton.classList.add('disabled');
            checkoutButton.setAttribute('aria-disabled', 'true');
        } else {
            checkoutButton.classList.remove('disabled');
            checkoutButton.setAttribute('aria-disabled', 'false');
        }
    };

    if (cartIcon && sideCart && closeCartBtn && cartBackdrop && continueShoppingBtn) {
        const openCart = (e) => {
            e.preventDefault();
            sideCart.classList.add('is-active');
            cartBackdrop.classList.add('is-active');
            document.body.classList.add('no-scroll');
            updateCartState();
        };

        const closeCart = () => {
            sideCart.classList.remove('is-active');
            cartBackdrop.classList.remove('is-active');
            // Only remove no-scroll if search isn't open
            if (!document.querySelector('.search-overlay.is-active')) {
                document.body.classList.remove('no-scroll');
            }
        };

        cartIcon.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartBackdrop.addEventListener('click', closeCart);
        continueShoppingBtn.addEventListener('click', closeCart);
    }

    // ======== DYNAMIC COPYRIGHT YEAR ========
    const verticalCopyright = document.getElementById('vertical-copyright');
    const mainCopyright = document.getElementById('copyright');
    const copyrightText = `© ${new Date().getFullYear()} Dotlyne. All Rights Reserved.`;

    if (mainCopyright) {
        mainCopyright.textContent = copyrightText;
    }
    if (verticalCopyright) {
        verticalCopyright.textContent = copyrightText;
    }

    // ======== CAROUSEL LOGIC ========
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (slidesContainer && slides.length > 0 && nextBtn && prevBtn) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        const goToSlide = (slideIndex) => {
            slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
            currentIndex = slideIndex;
        };

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(prevIndex);
        });
    }

    // ======== SPOTLIGHT FAVORITE BUTTON LOGIC ========
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });

    // ======== SPOTLIGHT SIZE SELECTOR LOGIC ========
    const sizeSelectors = document.querySelectorAll('.size-selector');

    sizeSelectors.forEach(selector => {
        selector.addEventListener('click', (event) => {
            event.stopPropagation();
            const clickedElement = event.target;
            
            if (clickedElement.classList.contains('size-option')) {
                const sizeOptions = selector.querySelectorAll('.size-option');
                sizeOptions.forEach(option => {
                    option.classList.remove('active');
                });
                clickedElement.classList.add('active');
            }
        });
    });

    // ======== ADD TO CART ANIMATION LOGIC ========
    const itemActions = document.querySelectorAll('.item-actions');

    itemActions.forEach(action => {
        action.addEventListener('click', (event) => {
            if (event.target.closest('.size-option, .view-item-btn') || action.classList.contains('is-adding')) {
                return;
            }

            action.classList.add('is-adding');
            const textSpan = action.querySelector('.add-to-cart-text');

            textSpan.style.opacity = 0;

            setTimeout(() => {
                action.classList.add('confirmed');
                textSpan.innerHTML = '<i class="fas fa-check"></i>';
                textSpan.style.opacity = 1;

                setTimeout(() => {
                    textSpan.style.opacity = 0;

                    setTimeout(() => {
                        action.classList.remove('confirmed');
                        textSpan.innerHTML = 'Add to Cart';
                        textSpan.style.opacity = 1;
                        action.classList.remove('is-adding');
                    }, 300);

                }, 1200);

            }, 300);
        });
    });
    
    // Initial setup call
    if(checkoutButton) {
        updateCartState();
    }
});
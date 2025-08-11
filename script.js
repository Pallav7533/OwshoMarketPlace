// Enhanced Mobile Menu Toggle with Animation
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('show');

    // Animate hamburger menu
    const spans = menuIcon.querySelectorAll('span');
    if (navLinks.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu when clicking on a link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('show');
        // Reset hamburger animation
        const spans = menuIcon.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('show');
        // Reset hamburger animation
        const spans = menuIcon.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Header Scroll Effect with Class Toggle
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class for styling
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll (mobile)
    if (window.innerWidth <= 768) {
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    }

    lastScrollTop = scrollTop;
});

// Enhanced Newsletter Popup Functionality
const newsletterPopup = document.getElementById('newsletter-popup');
const closePopup = document.getElementById('close-popup');
const dontShowAgain = document.getElementById('dont-show-again');
const popupForm = document.getElementById('popup-form');

// Show popup after 8 seconds if not shown before
setTimeout(() => {
    if (!localStorage.getItem('newsletter-closed') && !sessionStorage.getItem('popup-shown')) {
        newsletterPopup.style.display = 'flex';
        sessionStorage.setItem('popup-shown', 'true');
    }
}, 8000);

// Close popup function
function closeNewsletterPopup() {
    newsletterPopup.style.display = 'none';
    if (dontShowAgain.checked) {
        localStorage.setItem('newsletter-closed', 'true');
    }
}

// Close popup events
closePopup.addEventListener('click', closeNewsletterPopup);

// Close popup when clicking outside
newsletterPopup.addEventListener('click', (e) => {
    if (e.target === newsletterPopup) {
        closeNewsletterPopup();
    }
});

// Enhanced Newsletter form submission with loading state
popupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = popupForm.querySelector('input[type="email"]');
    const submitBtn = popupForm.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    if (!email) {
        alert('Please enter a valid email address.');
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        showSuccessMessage('Thank you for subscribing! Welcome to our newsletter.');
        newsletterPopup.style.display = 'none';
        localStorage.setItem('newsletter-closed', 'true');

        // Reset form
        emailInput.value = '';

        console.log('Newsletter subscription:', email);
    } catch (error) {
        alert('Something went wrong. Please try again later.');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Footer Newsletter Form
const footerNewsletterForm = document.getElementById('newsletter-form');
if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = footerNewsletterForm.querySelector('input[type="email"]');
        const submitBtn = footerNewsletterForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showSuccessMessage('Successfully subscribed to our newsletter!');
            emailInput.value = '';

            console.log('Footer newsletter subscription:', email);
        } catch (error) {
            alert('Something went wrong. Please try again later.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

// Enhanced Contact Form Submission with Better UX
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const subject = formData.get('subject')?.trim();
        const message = formData.get('message')?.trim();

        // Enhanced validation
        if (!name || name.length < 2) {
            alert('Please enter a valid name (at least 2 characters).');
            return;
        }

        if (!email || !isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!subject || subject.length < 5) {
            alert('Please enter a subject (at least 5 characters).');
            return;
        }

        if (!message || message.length < 10) {
            alert('Please enter a message (at least 10 characters).');
            return;
        }

        const submitBtn = contactForm.querySelector('.submit-btn');

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Submit form to server
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showSuccessMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
                contactForm.reset();

                // Reset input line animations
                document.querySelectorAll('.input-line').forEach(line => {
                    line.style.width = '0';
                });
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('Sorry, there was an error sending your message. Please try again later or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced Success Message Function
function showSuccessMessage(message, duration = 5000) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <div>
                <h4>Success!</h4>
                <p>${message}</p>
            </div>
        </div>
    `;

    document.body.appendChild(successMessage);

    // Trigger animation
    setTimeout(() => successMessage.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.remove(), 400);
    }, duration);
}

// Enhanced Stats Animation with Intersection Observer
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const suffix = element.textContent.replace(/[0-9]/g, ''); // Keep any suffix like '%'

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Initialize counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            const progressBars = entry.target.querySelectorAll('.progress-bar');

            statNumbers.forEach((stat, index) => {
                const count = parseInt(stat.getAttribute('data-count'));
                setTimeout(() => {
                    animateCounter(stat, 0, count, 2000);
                }, index * 200);
            });

            // Animate progress bars
            progressBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, index * 200 + 500);
            });

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Enhanced Scroll Animations with Stagger Effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, index * 100); // Stagger animation
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step-card, .service-card, .testimonial-card, .stat-item, .contact-card').forEach(el => {
    observer.observe(el);
});

// Enhanced Touch/Swipe functionality for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 80;
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = touchEndY - touchStartY;

    // Only handle horizontal swipes that are more significant than vertical ones
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > swipeThreshold) {
        if (swipeDistanceX > 0) {
            // Swipe right - close mobile menu if open
            navLinks.classList.remove('show');
            const spans = menuIcon.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    }
}

// Enhanced Lazy Loading for Images with fade effect and loading placeholder
const images = document.querySelectorAll('img[src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            // Add loading placeholder
            img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
            img.style.backgroundSize = '200% 100%';
            img.style.animation = 'loading 1.5s infinite';

            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = imageLoader.src;
                img.style.opacity = '1';
                img.classList.add('loaded');
                img.style.background = '';
                img.style.animation = '';
            };
            imageLoader.src = img.src;

            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

// Add loading animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;
document.head.appendChild(style);

images.forEach(img => {
    imageObserver.observe(img);
});

// Enhanced Parallax effect for hero shapes with performance optimization
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.shape, .floating-card');

    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);

// Enhanced Auto-sliding Services Carousel with Proper DOM Structure
function initServicesCarousel() {
    // Initialize Vendor Services Carousel
    const vendorServicesGrid = document.querySelector('.vendor-services');
    if (vendorServicesGrid) {
        const vendorCards = Array.from(vendorServicesGrid.children);

        if (vendorCards.length > 0) {
            // Create wrapper for smooth sliding
            const vendorWrapper = document.createElement('div');
            vendorWrapper.className = 'services-wrapper';

            // Move all cards to wrapper
            vendorCards.forEach(card => {
                vendorWrapper.appendChild(card);
            });

            // Clone first 3 cards for seamless loop
            for (let i = 0; i < Math.min(3, vendorCards.length); i++) {
                const clone = vendorCards[i].cloneNode(true);
                vendorWrapper.appendChild(clone);
            }

            vendorServicesGrid.appendChild(vendorWrapper);

            let vendorIndex = 0;
            const vendorTotalCards = vendorCards.length;
            const vendorCardsToShow = window.innerWidth <= 768 ? 1 : 3;
            const vendorCardWidth = 100 / vendorCardsToShow;

            function slideVendorCards() {
                vendorIndex++;
                const translateX = -(vendorIndex * vendorCardWidth);
                vendorWrapper.style.transform = `translateX(${translateX}%)`;

                // Reset to beginning when reaching cloned cards
                if (vendorIndex >= vendorTotalCards) {
                    setTimeout(() => {
                        vendorWrapper.style.transition = 'none';
                        vendorIndex = 0;
                        vendorWrapper.style.transform = 'translateX(0%)';
                        setTimeout(() => {
                            vendorWrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        }, 50);
                    }, 800);
                }
            }

            // Auto-slide every 4 seconds
            setInterval(slideVendorCards, 4000);
        }
    }

    // Initialize Customer Services Carousel
    const customerServicesGrid = document.querySelector('.customer-services');
    if (customerServicesGrid) {
        const customerCards = Array.from(customerServicesGrid.children);

        if (customerCards.length > 0) {
            // Create wrapper for smooth sliding
            const customerWrapper = document.createElement('div');
            customerWrapper.className = 'services-wrapper';

            // Move all cards to wrapper
            customerCards.forEach(card => {
                customerWrapper.appendChild(card);
            });

            // Clone first 3 cards for seamless loop
            for (let i = 0; i < Math.min(3, customerCards.length); i++) {
                const clone = customerCards[i].cloneNode(true);
                customerWrapper.appendChild(clone);
            }

            customerServicesGrid.appendChild(customerWrapper);

            let customerIndex = 0;
            const customerTotalCards = customerCards.length;
            const customerCardsToShow = window.innerWidth <= 768 ? 1 : 3;
            const customerCardWidth = 100 / customerCardsToShow;

            function slideCustomerCards() {
                customerIndex++;
                const translateX = -(customerIndex * customerCardWidth);
                customerWrapper.style.transform = `translateX(${translateX}%)`;

                // Reset to beginning when reaching cloned cards
                if (customerIndex >= customerTotalCards) {
                    setTimeout(() => {
                        customerWrapper.style.transition = 'none';
                        customerIndex = 0;
                        customerWrapper.style.transform = 'translateX(0%)';
                        setTimeout(() => {
                            customerWrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        }, 50);
                    }, 800);
                }
            }

            // Auto-slide every 4.5 seconds (different timing from vendor)
            setInterval(slideCustomerCards, 4500);
        }
    }
}

// Enhanced Testimonial Carousel
function initTestimonialCarousel() {
    const testimonialContainer = document.querySelector('.testimonials-grid');
    if (!testimonialContainer) return;

    let scrollAmount = 0;
    const cardWidth = testimonialContainer.querySelector('.testimonial-card')?.offsetWidth + 48 || 400; // 48 = gap

    setInterval(() => {
        if (scrollAmount >= testimonialContainer.scrollWidth - testimonialContainer.clientWidth) {
            scrollAmount = 0;
        } else {
            scrollAmount += cardWidth;
        }

        testimonialContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, 5000);
}

// Mouse movement parallax for hero section (desktop only)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    }
});

function updateMouseParallax() {
    if (window.innerWidth > 768) {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.03;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;

            card.style.transform = `translate(${x}px, ${y}px)`;
        });

        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    requestAnimationFrame(updateMouseParallax);
}

// Enhanced Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        navLinks.classList.remove('show');
        if (newsletterPopup.style.display === 'flex') {
            closeNewsletterPopup();
        }

        // Reset mobile menu animation
        const spans = menuIcon.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }

    // Enhanced Tab navigation
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }

    // Arrow key navigation for carousels
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const focusedElement = document.activeElement;
        if (focusedElement.closest('.testimonials-grid')) {
            e.preventDefault();
            const container = focusedElement.closest('.testimonials-grid');
            const cardWidth = container.querySelector('.testimonial-card').offsetWidth + 48;
            const direction = e.key === 'ArrowLeft' ? -cardWidth : cardWidth;
            container.scrollBy({ left: direction, behavior: 'smooth' });
        }
    }
});

// Remove keyboard class when mouse is used
document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Enhanced Responsive Font Size Adjustment
function adjustFontSizes() {
    const viewportWidth = window.innerWidth;
    const html = document.documentElement;

    if (viewportWidth <= 480) {
        html.style.fontSize = '14px';
    } else if (viewportWidth <= 768) {
        html.style.fontSize = '15px';
    } else if (viewportWidth <= 1024) {
        html.style.fontSize = '16px';
    } else {
        html.style.fontSize = '16px';
    }
}

// Enhanced Window Resize Handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navLinks.classList.remove('show');
            navbar.style.transform = 'translateY(0)';

            // Reset hamburger animation
            const spans = menuIcon.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }

        adjustFontSizes();

        // Reinitialize carousels with new dimensions
        setTimeout(() => {
            initServicesCarousel();
            initTestimonialCarousel();
        }, 100);
    }, 250);
});

// Enhanced Page Load Handler
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Initialize animations after page load
    setTimeout(() => {
        document.querySelectorAll('.animate-fade-delay').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);

    // Initialize floating card animations
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.animation = `floatCard 4s ease-in-out infinite ${index * 1.5}s`;
        }, 1000 + (index * 500));
    });

    // Initialize carousels
    setTimeout(() => {
        initServicesCarousel();
        initTestimonialCarousel();
    }, 100);

    // Start mouse parallax
    updateMouseParallax();
});

// Page Visibility API for performance optimization
document.addEventListener('visibilitychange', () => {
    const isVisible = document.visibilityState === 'visible';

    // Pause/resume animations based on visibility
    document.querySelectorAll('.floating-card, .shape').forEach(element => {
        element.style.animationPlayState = isVisible ? 'running' : 'paused';
    });
});

// Enhanced Ripple Effect for Interactive Elements
document.querySelectorAll('button, .download-btn, .service-card, .step-card').forEach(element => {
    element.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

                console.log('Page Load Time:', loadTime + 'ms');

                // Track long tasks
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 50) {
                                console.warn('Long task detected:', entry.duration + 'ms');
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                }
            }, 0);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
  function autoScrollGrid(gridSelector, speed = 1) {
    const grid = document.querySelector(gridSelector);
    let scrollAmount = 0;
    let isHovered = false;

    // Duplicate cards for smooth looping
    grid.innerHTML += grid.innerHTML;

    grid.addEventListener("mouseenter", () => isHovered = true);
    grid.addEventListener("mouseleave", () => isHovered = false);

    function scrollLoop() {
      if (!isHovered) {
        scrollAmount += speed;
        if (scrollAmount >= grid.scrollWidth / 2) {
          scrollAmount = 0; // reset for infinite loop
        }
        grid.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(scrollLoop);
    }
    scrollLoop();
  }

  // Vendors
  autoScrollGrid(".vendor-grid", 0.5);

  // Customers
  autoScrollGrid(".customer-grid", 0.5);
});


// Initialize performance monitoring
measurePerformance();

// Call adjustFontSizes on initial load
adjustFontSizes();

console.log('🚀 Owsho Enhanced Website with Auto-Swipe Services Loaded Successfully!');
// Mobile Menu Toggle
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Close mobile menu when clicking on a link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('show');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('show');
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

// Header Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add/remove scrolled class for styling
    if (scrollTop > 100) {
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

// Newsletter Popup Functionality
const newsletterPopup = document.getElementById('newsletter-popup');
const closePopup = document.getElementById('close-popup');
const dontShowAgain = document.getElementById('dont-show-again');
const popupForm = document.querySelector('.popup-form');

// Show popup after 5 seconds if not shown before
setTimeout(() => {
    if (!localStorage.getItem('newsletter-closed')) {
        newsletterPopup.style.display = 'flex';
    }
}, 5000);

// Close popup
closePopup.addEventListener('click', () => {
    newsletterPopup.style.display = 'none';
    if (dontShowAgain.checked) {
        localStorage.setItem('newsletter-closed', 'true');
    }
});

// Close popup when clicking outside
newsletterPopup.addEventListener('click', (e) => {
    if (e.target === newsletterPopup) {
        newsletterPopup.style.display = 'none';
        if (dontShowAgain.checked) {
            localStorage.setItem('newsletter-closed', 'true');
        }
    }
});

// Newsletter form submission
popupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = popupForm.querySelector('input[type="email"]').value;

    // Simulate form submission
    alert('Thank you for subscribing! We\'ll keep you updated with our latest news.');
    newsletterPopup.style.display = 'none';
    localStorage.setItem('newsletter-closed', 'true');

    // Here you would typically send the email to your server
    console.log('Newsletter subscription:', email);
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
    const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
    const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
    const message = contactForm.querySelector('textarea').value;

    // Validate form
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);

    // Here you would typically send the form data to your server
    console.log('Contact form submission:', { name, email, subject, message });
});

// Vendor Button Functionality
const vendorBtn = document.querySelector('.vendor-btn');
vendorBtn.addEventListener('click', () => {
    // Scroll to contact section or open vendor registration
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
});

// Animated Counter for Statistics
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();

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
            statNumbers.forEach(stat => {
                const count = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, 0, count, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step-card, .service-card, .testimonial-card, .stat-item').forEach(el => {
    observer.observe(el);
});

// Touch/Swipe functionality for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - close mobile menu if open
            navLinks.classList.remove('show');
        } else {
            // Swipe left - could implement other functionality
        }
    }
}

// Enhanced Lazy Loading for Images with fade effect
const images = document.querySelectorAll('img[src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            // Add loading class for smooth transition
            img.style.opacity = '0';

            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = imageLoader.src;
                img.style.opacity = '1';
                img.classList.add('loaded');
            };
            imageLoader.src = img.src;

            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1, rootMargin: '50px' });

images.forEach(img => {
    imageObserver.observe(img);
});

// Parallax effect for hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.shape');

    parallax.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
});

// Responsive Font Size Adjustment
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

// Call on load and resize
adjustFontSizes();
window.addEventListener('resize', adjustFontSizes);

// Performance Optimization - Debounce Scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler for better performance
const debouncedScrollHandler = debounce(() => {
    // Parallax and other scroll effects can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Smooth Page Load with progressive enhancement
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Initialize additional animations after page load
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
});

// Handle Window Resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            navLinks.classList.remove('show');
            navbar.style.transform = 'translateY(0)';
        }

        adjustFontSizes();
    }, 250);
});

// Enhanced Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // Close mobile menu and popup with Escape key
    if (e.key === 'Escape') {
        navLinks.classList.remove('show');
        if (newsletterPopup.style.display === 'flex') {
            newsletterPopup.style.display = 'none';
        }
    }

    // Handle Enter key on interactive elements
    if (e.key === 'Enter') {
        if (e.target.classList.contains('vendor-btn') ||
            e.target.classList.contains('highlight-btn') ||
            e.target.classList.contains('badge')) {
            e.target.click();
        }
    }

    // Add tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

// Remove keyboard class when mouse is used
document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Add loading states for better UX
function showLoading(button, loadingText = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('loading');

    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    };
}

// Enhanced click effects with ripple animation
document.querySelectorAll('button, .badge, .service-card, .step-card').forEach(element => {
    element.addEventListener('click', function (e) {
        // Create ripple effect
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

// Service Worker Registration for PWA capabilities (if needed)
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

// Add mouse movement parallax for hero section
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;

            card.style.transform = `translate(${x}px, ${y}px) translateY(-15px)`;
        });

        // Parallax for hero shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.01;
            const x = (mouseX - 0.5) * speed * 50;
            const y = (mouseY - 0.5) * speed * 50;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
});

// Initialize page visibility API for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations when page becomes visible
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.animationPlayState = 'running';
        });
    } else {
        // Pause animations when page is hidden to save resources
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.animationPlayState = 'paused';
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.vendor-services');
    const cards = document.querySelectorAll('.vendor-services .service-card');
    let index = 0;
    const cardsPerView = 3;

    // Clone cards for infinite loop
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        container.appendChild(clone);
    });

    setInterval(() => {
        index++;
        container.style.transform = `translateX(-${index * (100 / cardsPerView)}%)`;

        // Reset for infinite loop
        if (index >= cards.length) {
            setTimeout(() => {
                container.style.transition = 'none';
                index = 0;
                container.style.transform = `translateX(0)`;
                setTimeout(() => {
                    container.style.transition = 'transform 0.5s ease';
                });
            }, 500);
        }
    }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
    const customerContainer = document.querySelector('.customer-services');
    const customerCards = document.querySelectorAll('.customer-services .service-card');
    let cIndex = 0;
    const cardsPerView = 3;

    // Clone cards for infinite loop
    customerCards.forEach(card => {
        const clone = card.cloneNode(true);
        customerContainer.appendChild(clone);
    });

    setInterval(() => {
        cIndex++;
        customerContainer.style.transform = `translateX(-${cIndex * (100 / cardsPerView)}%)`;

        // Reset for infinite loop
        if (cIndex >= customerCards.length) {
            setTimeout(() => {
                customerContainer.style.transition = 'none';
                cIndex = 0;
                customerContainer.style.transform = `translateX(0)`;
                setTimeout(() => {
                    customerContainer.style.transition = 'transform 0.5s ease';
                });
            }, 500);
        }
    }, 3000);
});



// Console log for debugging
console.log('🚀 Owsho professional website JavaScript loaded successfully!');
console.log('💼 Professional features initialized:');
console.log('   ✅ Animated counters');
console.log('   ✅ Parallax effects');
console.log('   ✅ Intersection observers');
console.log('   ✅ Enhanced scroll animations');
console.log('   ✅ Ripple effects');
console.log('   ✅ Progressive image loading');
console.log('   ✅ Mouse movement parallax');
console.log('   ✅ Performance optimizations');
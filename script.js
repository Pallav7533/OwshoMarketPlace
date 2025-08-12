// Menu functionality
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.toggle('show');

  const spans = menuIcon.querySelectorAll('span');
  if (navLinks.classList.contains('show')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('show');
    const spans = menuIcon.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

document.addEventListener('click', (e) => {
  if (!menuIcon.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('show');
    const spans = menuIcon.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 15;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar scroll effects
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.innerWidth <= 768) {
    if (scrollTop > lastScrollTop && scrollTop > 150) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }

  lastScrollTop = scrollTop;
});

// Newsletter popup functionality
const newsletterPopup = document.getElementById('newsletter-popup');
const closePopup = document.getElementById('close-popup');
const dontShowAgain = document.getElementById('dont-show-again');
const popupForm = document.getElementById('popup-form');

setTimeout(() => {
  if (!localStorage.getItem('newsletter-closed') && !sessionStorage.getItem('popup-shown')) {
    newsletterPopup.style.display = 'flex';
    sessionStorage.setItem('popup-shown', 'true');
  }
}, 6000);

function closeNewsletterPopup() {
  newsletterPopup.style.display = 'none';
  if (dontShowAgain.checked) {
    localStorage.setItem('newsletter-closed', 'true');
  }
}

closePopup.addEventListener('click', closeNewsletterPopup);

newsletterPopup.addEventListener('click', (e) => {
  if (e.target === newsletterPopup) {
    closeNewsletterPopup();
  }
});

popupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = popupForm.querySelector('input[type="email"]');
  const submitBtn = popupForm.querySelector('button[type="submit"]');
  const email = emailInput.value.trim();

  if (!email) {
    alert('Please enter a valid email address.');
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
  submitBtn.disabled = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    showSuccessMessage('Thank you for subscribing! Welcome to our newsletter.');
    newsletterPopup.style.display = 'none';
    localStorage.setItem('newsletter-closed', 'true');
    emailInput.value = '';
    console.log('Newsletter subscription:', email);
  } catch (error) {
    alert('Something went wrong. Please try again later.');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// Footer newsletter form
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

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      showSuccessMessage('Successfully subscribed to our newsletter!');
      emailInput.value = '';
      console.log('Footer newsletter subscription:', email);
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
}

// Contact form functionality
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const subject = formData.get('subject')?.trim();
    const message = formData.get('message')?.trim();

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
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showSuccessMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
        contactForm.reset();
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
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showSuccessMessage(message, duration = 4000) {
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
  setTimeout(() => successMessage.classList.add('show'), 100);

  setTimeout(() => {
    successMessage.classList.remove('show');
    setTimeout(() => successMessage.remove(), 300);
  }, duration);
}

// Counter animation for stats
function animateCounter(element, start, end, duration) {
  let startTime = null;
  const suffix = element.textContent.replace(/[0-9]/g, '');

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

// Stats observer
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      const progressBars = entry.target.querySelectorAll('.progress-bar');

      statNumbers.forEach((stat, index) => {
        const count = parseInt(stat.getAttribute('data-count'));
        setTimeout(() => {
          animateCounter(stat, 0, count, 1800);
        }, index * 150);
      });

      progressBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, index * 150 + 400);
      });

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in');
      }, index * 80);
    }
  });
}, observerOptions);

document.querySelectorAll('.step-card, .service-card, .testimonial-card, .stat-item, .contact-card').forEach(el => {
  observer.observe(el);
});

// Manual Services Carousel Functionality
class ManualCarousel {
  constructor(containerSelector, cardSelector, navSelector = null, indicatorSelector = null) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.cardSelector = cardSelector;
    this.navSelector = navSelector;
    this.indicatorSelector = indicatorSelector;

    this.init();
  }

  init() {
    this.setupContainer();
    this.setupNavigation();
    this.setupTouchEvents();
    this.setupScrollIndicators();
  }

  setupContainer() {
    // Wrap existing cards in a container
    const existingCards = Array.from(this.container.querySelectorAll(this.cardSelector));

    if (existingCards.length === 0) return;

    const scrollContainer = document.createElement('div');
    scrollContainer.className = this.container.classList.contains('testimonials-grid') ? 'testimonials-container' : 'services-container';

    // Move all cards to the scroll container
    existingCards.forEach(card => {
      scrollContainer.appendChild(card);
    });

    // Clear the original container and add the scroll container
    this.container.innerHTML = '';
    this.container.appendChild(scrollContainer);

    this.scrollContainer = scrollContainer;
  }

  setupNavigation() {
    if (!this.navSelector) return;

    const navContainer = document.createElement('div');
    navContainer.className = this.navSelector.replace('.', '');
    navContainer.innerHTML = `
      <button class="nav-btn nav-prev" aria-label="Previous">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-btn nav-next" aria-label="Next">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    this.container.appendChild(navContainer);

    const prevBtn = navContainer.querySelector('.nav-prev');
    const nextBtn = navContainer.querySelector('.nav-next');

    prevBtn.addEventListener('click', () => this.scrollPrev());
    nextBtn.addEventListener('click', () => this.scrollNext());

    // Update navigation state
    this.scrollContainer.addEventListener('scroll', () => {
      this.updateNavigation(prevBtn, nextBtn);
    });

    // Initial navigation state
    setTimeout(() => this.updateNavigation(prevBtn, nextBtn), 100);
  }

  setupScrollIndicators() {
    if (!this.indicatorSelector) return;

    const cards = this.scrollContainer.querySelectorAll(this.cardSelector);
    const totalCards = cards.length;
    const visibleCards = this.getVisibleCardCount();
    const totalPages = Math.ceil(totalCards / visibleCards);

    if (totalPages <= 1) return;

    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = this.indicatorSelector.replace('.', '');

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'scroll-dot';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => this.scrollToPage(i));
      indicatorContainer.appendChild(dot);
    }

    this.container.appendChild(indicatorContainer);

    // Update indicators on scroll
    this.scrollContainer.addEventListener('scroll', () => {
      this.updateIndicators();
    });
  }

  setupTouchEvents() {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    this.scrollContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - this.scrollContainer.offsetLeft;
      scrollLeft = this.scrollContainer.scrollLeft;
      this.scrollContainer.style.cursor = 'grabbing';
    });

    this.scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      this.scrollContainer.style.cursor = 'grab';
    });

    this.scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      this.scrollContainer.style.cursor = 'grab';
    });

    this.scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.8;
      this.scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    let touchStartX = 0;

    this.scrollContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.scrollContainer.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;

      const touchX = e.touches[0].clientX;
      const diff = touchStartX - touchX;

      this.scrollContainer.scrollLeft += diff;
      touchStartX = touchX;
    }, { passive: true });
  }

  getVisibleCardCount() {
    const containerWidth = this.scrollContainer.clientWidth;
    const cardWidth = this.scrollContainer.querySelector(this.cardSelector)?.offsetWidth || 280;
    return Math.floor(containerWidth / (cardWidth + 30)); // 30px for gap
  }

  getCardWidth() {
    const card = this.scrollContainer.querySelector(this.cardSelector);
    if (!card) return 280;

    const cardRect = card.getBoundingClientRect();
    const gap = 30; // Gap between cards
    return cardRect.width + gap;
  }

  scrollPrev() {
    const cardWidth = this.getCardWidth();
    const visibleCards = this.getVisibleCardCount();
    const scrollAmount = cardWidth * visibleCards;

    this.scrollContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollNext() {
    const cardWidth = this.getCardWidth();
    const visibleCards = this.getVisibleCardCount();
    const scrollAmount = cardWidth * visibleCards;

    this.scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollToPage(pageIndex) {
    const cardWidth = this.getCardWidth();
    const visibleCards = this.getVisibleCardCount();
    const scrollAmount = cardWidth * visibleCards * pageIndex;

    this.scrollContainer.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  updateNavigation(prevBtn, nextBtn) {
    if (!prevBtn || !nextBtn) return;

    const isAtStart = this.scrollContainer.scrollLeft <= 5;
    const isAtEnd = this.scrollContainer.scrollLeft >=
      this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth - 5;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  }

  updateIndicators() {
    const indicators = this.container.querySelectorAll('.scroll-dot');
    if (indicators.length === 0) return;

    const visibleCards = this.getVisibleCardCount();
    const cardWidth = this.getCardWidth();
    const currentPage = Math.round(this.scrollContainer.scrollLeft / (cardWidth * visibleCards));

    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
  }
}

// Initialize Services Carousels
document.addEventListener('DOMContentLoaded', () => {
  // Vendor Services Carousel
  new ManualCarousel(
    '.vendor-services',
    '.service-card',
    '.services-nav',
    '.scroll-indicators'
  );

  // Customer Services Carousel
  new ManualCarousel(
    '.customer-services',
    '.service-card',
    '.services-nav',
    '.scroll-indicators'
  );

  // Vendor Testimonials Carousel
  new ManualCarousel(
    '.vendor-grid',
    '.testimonial-card',
    '.testimonials-nav',
    '.scroll-indicators'
  );

  // Customer Testimonials Carousel
  new ManualCarousel(
    '.customer-grid',
    '.testimonial-card',
    '.testimonials-nav',
    '.scroll-indicators'
  );
});

// Touch swipe functionality for better mobile experience
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
  const swipeThreshold = 70;
  const swipeDistanceX = touchEndX - touchStartX;
  const swipeDistanceY = touchEndY - touchStartY;

  if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > swipeThreshold) {
    if (swipeDistanceX > 0) {
      // Swipe right - close mobile menu
      navLinks.classList.remove('show');
      const spans = menuIcon.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  }
}

// Image lazy loading
const images = document.querySelectorAll('img[src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;

      // Add loading skeleton
      img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
      img.style.backgroundSize = '200% 100%';
      img.style.animation = 'loading 1.2s infinite';

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
}, { threshold: 0.1, rootMargin: '40px' });

// Add loading animation CSS
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

// Parallax effects
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.shape, .floating-card');

  parallaxElements.forEach((element, index) => {
    const speed = 0.2 + (index * 0.08);
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

// Mouse parallax for floating elements
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
      const speed = (index + 1) * 0.025;
      const x = (mouseX - 0.5) * speed * 80;
      const y = (mouseY - 0.5) * speed * 80;
      card.style.transform = `translate(${x}px, ${y}px)`;
    });

    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.015;
      const x = (mouseX - 0.5) * speed * 40;
      const y = (mouseY - 0.5) * speed * 40;
      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  requestAnimationFrame(updateMouseParallax);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navLinks.classList.remove('show');
    if (newsletterPopup.style.display === 'flex') {
      closeNewsletterPopup();
    }

    const spans = menuIcon.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }

  if (e.key === 'Tab') {
    document.body.classList.add('using-keyboard');
  }

  // Arrow key navigation for carousels
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const focusedElement = document.activeElement;
    const carousel = focusedElement.closest('.services-container, .testimonials-container');

    if (carousel) {
      e.preventDefault();
      const cardWidth = carousel.querySelector('.service-card, .testimonial-card')?.offsetWidth + 30 || 310;
      const direction = e.key === 'ArrowLeft' ? -cardWidth : cardWidth;
      carousel.scrollBy({ left: direction, behavior: 'smooth' });
    }
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('using-keyboard');
});

// Font size adjustment
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

// Resize handler
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('show');
      navbar.style.transform = 'translateY(0)';

      const spans = menuIcon.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }

    adjustFontSizes();
  }, 200);
});

// Page load animations
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  setTimeout(() => {
    document.querySelectorAll('.animate-fade-delay').forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }, 400);

  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.animation = `floatCard 4s ease-in-out infinite ${index * 1.2}s`;
    }, 800 + (index * 400));
  });

  updateMouseParallax();
});

// Visibility change handler
document.addEventListener('visibilitychange', () => {
  const isVisible = document.visibilityState === 'visible';
  document.querySelectorAll('.floating-card, .shape').forEach(element => {
    element.style.animationPlayState = isVisible ? 'running' : 'paused';
  });
});

// Ripple effect for interactive elements
document.querySelectorAll('button, .download-btn, .service-card, .step-card, .testimonial-card').forEach(element => {
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
    }, 500);
  });
});

// Service Worker registration
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

// Performance measurement
function measurePerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log('Page Load Time:', loadTime + 'ms');

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

measurePerformance();
adjustFontSizes();

console.log('🚀 Owsho Enhanced Responsive Website Loaded Successfully!');
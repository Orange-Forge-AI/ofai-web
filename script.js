/**
 * Orange Forge AI - Main JavaScript
 * Handles interactive functionality for the website
 */

// ============================================
// DOM Elements
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Mobile Menu Toggle
// ============================================

/**
 * Toggle the mobile navigation menu
 */
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

/**
 * Close the mobile menu
 */
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Event listener for hamburger button
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Event listeners for navigation links (close menu on click)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = navMenu && navMenu.contains(e.target);
    const isClickOnHamburger = hamburger && hamburger.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu) {
        closeMenu();
    }
});

// ============================================
// Enhanced Smooth Scrolling
// ============================================

/**
 * Smooth scroll to element with offset for fixed header
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for anchor links without hash
        if (href === '#') {
            return;
        }
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMenu();
        }
    });
});

// ============================================
// Responsive Navigation Update
// ============================================

/**
 * Update hamburger visibility on resize
 */
function updateNavigation() {
    const width = window.innerWidth;
    
    if (width > 600) {
        // On larger screens, ensure menu is visible
        navMenu.style.display = '';
        closeMenu();
    }
}

// Listen for window resize
window.addEventListener('resize', updateNavigation);

// ============================================
// Intersection Observer for Animations
// ============================================

/**
 * Animate elements when they come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to product cards and sections
document.querySelectorAll('.product-card, .about-content, .privacy-section').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// Form Validation (if forms are added)
// ============================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// ============================================
// Analytics & Performance
// ============================================

/**
 * Track page performance
 */
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    }
});

// ============================================
// Accessibility Enhancements
// ============================================

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape') {
        closeMenu();
    }
    
    // Toggle menu with Enter on hamburger
    if (e.key === 'Enter' && document.activeElement === hamburger) {
        toggleMenu();
    }
});

// ============================================
// Service Worker Registration (Optional)
// ============================================

/**
 * Register service worker for offline support (optional)
 */
if ('serviceWorker' in navigator) {
    // Uncomment below to enable service worker
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('sw.js').then(registration => {
    //         console.log('Service Worker registered:', registration);
    //     }).catch(error => {
    //         console.log('Service Worker registration failed:', error);
    //     });
    // });
}

// ============================================
// Console Message
// ============================================

console.log('🔷 Orange Forge AI, LLC - Intelligent Software Solutions');
console.log('Made with ❤️ in Texas');

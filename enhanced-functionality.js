// Enhanced JavaScript functionality for Bricks & Keys Website

class BricksKeysWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupScrollIndicator();
        this.setupLazyLoading();
        this.setupPerformanceOptimizations();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeGSAP();
            this.setupFadeInAnimations();
        });

        window.addEventListener('scroll', this.throttle(this.updateScrollIndicator.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    initializeGSAP() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Set up scroll-triggered animations
            gsap.utils.toArray('.anim-on-scroll-y').forEach(el => {
                gsap.from(el, {
                    scrollTrigger: { 
                        trigger: el, 
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0, 
                    y: 50, 
                    duration: 1, 
                    ease: "power3.out",
                    delay: parseFloat(el.style.getPropertyValue("--delay")) || 0
                });
            });

            // Hero title animation
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) {
                const words = heroTitle.textContent.split(' ');
                heroTitle.innerHTML = words.map(word => `<span class="hero-title-word">${word}</span>`).join(' ');
                
                gsap.to(".hero-title-word", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.2
                });
            }
        }
    }

    setupThemeToggle() {
        const setupToggle = (toggleId, lightIconId, darkIconId) => {
            const toggle = document.getElementById(toggleId);
            const lightIcon = document.getElementById(lightIconId);
            const darkIcon = document.getElementById(darkIconId);
            const htmlEl = document.documentElement;

            if (toggle && lightIcon && darkIcon) {
                toggle.addEventListener('click', () => {
                    const isDark = htmlEl.classList.contains('dark');
                    
                    if (isDark) {
                        htmlEl.classList.remove('dark');
                        htmlEl.classList.add('light');
                        lightIcon.classList.add('hidden');
                        darkIcon.classList.remove('hidden');
                        localStorage.setItem('theme', 'light');
                    } else {
                        htmlEl.classList.remove('light');
                        htmlEl.classList.add('dark');
                        lightIcon.classList.remove('hidden');
                        darkIcon.classList.add('hidden');
                        localStorage.setItem('theme', 'dark');
                    }
                });
            }
        };

        // Setup both theme toggles
        setupToggle('theme-toggle', 'theme-icon-light', 'theme-icon-dark');
        setupToggle('mobile-theme-toggle', 'mobile-theme-icon-light', 'mobile-theme-icon-dark');

        // Load saved theme
        this.loadSavedTheme();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const htmlEl = document.documentElement;
        
        if (savedTheme === 'light') {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
            this.updateThemeIcons(false);
        } else {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
            this.updateThemeIcons(true);
        }
    }

    updateThemeIcons(isDark) {
        const lightIcons = document.querySelectorAll('[id*="theme-icon-light"]');
        const darkIcons = document.querySelectorAll('[id*="theme-icon-dark"]');
        
        lightIcons.forEach(icon => {
            icon.classList.toggle('hidden', !isDark);
        });
        
        darkIcons.forEach(icon => {
            icon.classList.toggle('hidden', isDark);
        });
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const closeMenu = document.getElementById('close-menu');

        const openMobileMenu = () => {
            mobileMenu?.classList.add('open');
            mobileOverlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const closeMobileMenu = () => {
            mobileMenu?.classList.remove('open');
            mobileOverlay?.classList.remove('open');
            document.body.style.overflow = 'auto';
        };

        mobileMenuToggle?.addEventListener('click', openMobileMenu);
        closeMenu?.addEventListener('click', closeMobileMenu);
        mobileOverlay?.addEventListener('click', closeMobileMenu);

        // Close menu when clicking on links
        const mobileNavLinks = mobileMenu?.querySelectorAll('a');
        mobileNavLinks?.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    setupScrollIndicator() {
        // Create scroll indicator if it doesn't exist
        if (!document.querySelector('.scroll-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            document.body.appendChild(indicator);
        }
    }

    updateScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            indicator.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupPerformanceOptimizations() {
        // Add will-change property to animated elements
        document.querySelectorAll('.anim-on-scroll-y, .hero-title-word').forEach(el => {
            el.classList.add('will-change-transform');
        });

        // Remove will-change after animations complete
        setTimeout(() => {
            document.querySelectorAll('.will-change-transform').forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 5000);
    }

    setupFadeInAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-fade-in]').forEach(el => {
            observer.observe(el);
        });
    }

    handleResize() {
        // Recalculate animations on resize
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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
}

// Form Enhancement Class
class FormEnhancer {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupValidation();
        this.setupSubmission();
        this.setupRealTimeValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        this.showFieldFeedback(field, isValid, errorMessage);
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    }

    showFieldFeedback(field, isValid, message) {
        this.clearFieldError(field);
        
        if (!isValid) {
            field.classList.add('border-red-500', 'focus:ring-red-500');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-400 text-sm mt-1';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('border-red-500', 'focus:ring-red-500');
            field.classList.add('border-green-500');
            setTimeout(() => field.classList.remove('border-green-500'), 2000);
        }
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:ring-red-500', 'border-green-500');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isFormValid = this.validateForm();
            if (isFormValid) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            
            // Reset button
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }, 2000);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
        }
    }

    setupRealTimeValidation() {
        // Add real-time validation for better UX
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.add('border-green-500/50');
                } else {
                    input.classList.remove('border-green-500/50');
                }
            });
        });
    }
}

// FAQ Enhancement Class
class FAQEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupFAQs();
    }

    setupFAQs() {
        const faqButtons = document.querySelectorAll('.faq-button');
        faqButtons.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('.faq-icon');
                const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
                
                // Close all other FAQs
                faqButtons.forEach(otherButton => {
                    if (otherButton !== button) {
                        const otherContent = otherButton.nextElementSibling;
                        const otherIcon = otherButton.querySelector('.faq-icon');
                        otherContent.style.maxHeight = '0px';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current FAQ
                if (isOpen) {
                    content.style.maxHeight = '0px';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BricksKeysWebsite();
    new FormEnhancer('contact-form');
    new FAQEnhancer();
});

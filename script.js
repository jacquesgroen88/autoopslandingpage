// Mobile menu toggle with Alpine.js support
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // Toggle Alpine.js open state
            if (window.Alpine) {
                const mobileMenuComponent = Alpine.getComponent(mobileMenu);
                if (mobileMenuComponent) {
                    mobileMenuComponent.open = !mobileMenuComponent.open;
                }
            } else {
                // Fallback for non-Alpine.js
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

    // Scroll to section functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('load', checkReveal);
    
    // Initialize the calculator
    initCalculator();
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ROI Calculator functionality
function initCalculator() {
    const calculateButton = document.getElementById('calculate-button');
    const resetButton = document.getElementById('reset-button');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateROI);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
}

function calculateROI() {
    // Get input values
    const leads = Number(document.getElementById('leads').value || 0);
    const cars = Number(document.getElementById('cars').value || 0);
    const gross = Number(document.getElementById('gross').value || 0);
    const salespeople = Number(document.getElementById('salespeople').value || 0);
    const afterHours = Number(document.getElementById('after-hours').value || 0);
    const responseMins = Number(document.getElementById('response-time').value || 0);
    
    // Conservative recovery factors based on response speed
    let speedFactor;
    if (responseMins <= 5) speedFactor = 0.01;
    else if (responseMins <= 15) speedFactor = 0.02;
    else if (responseMins <= 60) speedFactor = 0.035;
    else if (responseMins <= 180) speedFactor = 0.06;
    else speedFactor = 0.08;
    
    let recoveredDeals = cars * speedFactor;
    
    // After-hours boost (AutoOps biggest win)
    const afterBoost = 1 + (afterHours * 0.35); // 20% => +7%, 50% => +17.5%
    recoveredDeals = recoveredDeals * afterBoost;
    
    // Clamp to keep it grounded
    recoveredDeals = clamp(recoveredDeals, 0.3, Math.max(1.2, cars * 0.12));
    
    const recoveredMoney = recoveredDeals * gross;
    const risk = recoveredMoney * 1.15;
    
    // Time saved: conservative hours per salesperson based on lead volume
    const timePerSales = clamp((leads / 250) * 3, 6, 14);
    const timeSaved = salespeople * timePerSales;
    
    const roi = recoveredMoney / 6500;
    
    // Update results
    document.getElementById('result-money').textContent = formatCurrency(recoveredMoney);
    document.getElementById('result-deals').textContent = (Math.round(recoveredDeals * 10) / 10).toFixed(1);
    document.getElementById('result-time').textContent = Math.round(timeSaved) + " hrs";
    document.getElementById('result-risk').textContent = formatCurrency(risk);
    document.getElementById('result-roi').textContent = (Math.round(roi * 10) / 10).toFixed(1) + "×";
    
    // Update summary
    const summary = `Based on your inputs, AutoOps could conservatively recover about <strong>${(Math.round(recoveredDeals * 10) / 10).toFixed(1)} extra deals/month</strong> — roughly <strong>${formatCurrency(recoveredMoney)} in gross profit</strong> — while saving your team around <strong>${Math.round(timeSaved)} hours/month</strong>. That's a directional ROI of <strong>${(Math.round(roi * 10) / 10).toFixed(1)}×</strong> vs R6,500/month.`;
    
    document.getElementById('result-summary').innerHTML = summary;
    
    // Show results section with animation
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('animate-fade-in');
    }
}

function resetCalculator() {
    // Reset input fields to default values
    document.getElementById('leads').value = 1500;
    document.getElementById('cars').value = 30;
    document.getElementById('gross').value = 35000;
    document.getElementById('salespeople').value = 5;
    document.getElementById('after-hours').value = "0.30";
    document.getElementById('response-time').value = "180";
    
    // Reset results
    document.getElementById('result-money').textContent = "R0";
    document.getElementById('result-deals').textContent = "0.0";
    document.getElementById('result-time').textContent = "0 hrs";
    document.getElementById('result-risk').textContent = "R0";
    document.getElementById('result-roi').textContent = "0.0×";
    document.getElementById('result-summary').textContent = "Enter your numbers and click \"Calculate opportunity\".";
}

// Helper functions
function formatCurrency(value) {
    try {
        return "R" + Math.round(value).toLocaleString();
    } catch(e) {
        return "R" + Math.round(value);
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Testimonial carousel functionality
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const nextButton = document.getElementById('testimonial-next');
    const prevButton = document.getElementById('testimonial-prev');
    let currentIndex = 0;
    
    function showTestimonial(index, direction = 'next') {
        // Hide all testimonials first
        testimonials.forEach((testimonial) => {
            testimonial.classList.add('hidden');
            testimonial.classList.remove('slide-in-right', 'slide-in-left');
        });
        
        // Show the current testimonial with animation
        testimonials[index].classList.remove('hidden');
        testimonials[index].classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex, 'next');
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex, 'prev');
        });
    }
    
    // Auto-rotate testimonials every 8 seconds
    let autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex, 'next');
    }, 8000);
    
    // Pause auto-rotation when hovering over testimonials
    const testimonialsContainer = document.querySelector('#testimonials');
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        
        testimonialsContainer.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex, 'next');
            }, 8000);
        });
    }
    
    // Initialize first testimonial
    if (testimonials.length > 0) {
        showTestimonial(0, 'next');
    }
}

// Initialize testimonial carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialCarousel();
    initFaqAccordion();
    updateTestimonialDots();
    
    // Make sure all reveal elements are visible initially
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        element.classList.add('active');
    });
});

// FAQ Accordion functionality for non-Alpine.js fallback
function initFaqAccordion() {
    // Only initialize if Alpine.js is not available
    if (window.Alpine) return;
    
    const faqItems = document.querySelectorAll('.bg-slate-800\/50.border.border-white\/10.rounded-xl.overflow-hidden');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.p-6.cursor-pointer');
        const content = item.querySelector('.overflow-hidden.transition-all.duration-300.max-h-0');
        const arrow = item.querySelector('svg.transform.transition-transform.duration-300');
        
        if (header && content) {
            header.addEventListener('click', () => {
                // Toggle content visibility
                if (content.classList.contains('max-h-0')) {
                    content.classList.remove('max-h-0');
                    content.classList.add('max-h-96', 'p-6', 'pt-0');
                    if (arrow) arrow.classList.add('rotate-180');
                } else {
                    content.classList.add('max-h-0');
                    content.classList.remove('max-h-96', 'p-6', 'pt-0');
                    if (arrow) arrow.classList.remove('rotate-180');
                }
            });
        }
    });
}

// Update testimonial dots when navigating
function updateTestimonialDots() {
    const dots = document.querySelectorAll('.testimonial-dot');
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const nextButton = document.getElementById('testimonial-next');
    const prevButton = document.getElementById('testimonial-prev');
    
    if (dots.length > 0 && testimonials.length > 0) {
        // Update dots based on current testimonial
        function updateActiveDot(index) {
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('bg-purple-500');
                    dot.classList.remove('bg-white/30');
                } else {
                    dot.classList.remove('bg-purple-500');
                    dot.classList.add('bg-white/30');
                }
            });
        }
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Hide all testimonials
                testimonials.forEach(testimonial => {
                    testimonial.classList.add('hidden');
                });
                
                // Show selected testimonial
                testimonials[index].classList.remove('hidden');
                
                // Update dots
                updateActiveDot(index);
            });
        });
        
        // Update original next/prev functions to update dots
        if (nextButton) {
            const originalClick = nextButton.onclick;
            nextButton.onclick = function() {
                if (originalClick) originalClick.call(this);
                
                // Find current visible testimonial
                let currentIndex = 0;
                testimonials.forEach((testimonial, index) => {
                    if (!testimonial.classList.contains('hidden')) {
                        currentIndex = index;
                    }
                });
                
                updateActiveDot(currentIndex);
            };
        }
        
        if (prevButton) {
            const originalClick = prevButton.onclick;
            prevButton.onclick = function() {
                if (originalClick) originalClick.call(this);
                
                // Find current visible testimonial
                let currentIndex = 0;
                testimonials.forEach((testimonial, index) => {
                    if (!testimonial.classList.contains('hidden')) {
                        currentIndex = index;
                    }
                });
                
                updateActiveDot(currentIndex);
            };
        }
    }
}

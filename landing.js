// Landing Page JavaScript - Clean and Simple
// Only essential functionality for a professional landing page

// Video background handling
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero__video-bg');
    if (video) {
        video.addEventListener('loadeddata', function() {
            document.querySelector('.hero').classList.add('video-loaded');
        });
        
        video.addEventListener('error', function() {
            // Fallback to static background if video fails to load
            document.querySelector('.hero').classList.remove('video-loaded');
        });
    }
});

// Navigation function
function navigateToExecutiveSummary() {
    // Check if we're on the same page or need to navigate
    const executiveSummaryElement = document.querySelector('.executive-summary');
    
    if (executiveSummaryElement) {
        // Smooth scroll if element exists on same page
        executiveSummaryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        // Navigate to executive summary page if it's separate
        window.location.href = 'executive-summary.html';
    }
}

// Add smooth scroll behavior for all internal links
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add subtle hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.tech-item, .trust-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Export function for global access
window.navigateToExecutiveSummary = navigateToExecutiveSummary;

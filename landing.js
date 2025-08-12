// Landing Page JavaScript - Clean and Simple
// Only essential functionality for a professional landing page

document.addEventListener('DOMContentLoaded', function() {
    // Video background handling
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
    
    // AGI Demo Video handling
    const demoVideo = document.querySelector('.hero__demo-video');
    if (demoVideo) {
        // Add click to play functionality
        demoVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
    }
});

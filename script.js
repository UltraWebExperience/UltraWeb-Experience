// Get all necessary DOM elements
const music = document.getElementById('background-music');
const playPauseMusicBtn = document.getElementById('play-pause-music-btn'); // New: Play/Pause button
const uploadMusicTriggerBtn = document.getElementById('upload-music-trigger-btn'); // New: Upload button
const musicUploadInput = document.getElementById('music-upload');
const themeToggle = document.getElementById('theme-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const helpBtn = document.getElementById('help-btn');
const instructionModal = document.getElementById('instruction-modal');
const closeModalBtns = document.querySelectorAll('.close-modal-btn');

// --- Music Playback and Upload Logic ---
let isMusicPlaying = false; // Track music state
const defaultMusicSrc = "Creepy_Nuts_-_Otonoke_(FeelMP3.com).mp3"; // Define default music source

// Set initial state for the play/pause button and load default music
document.addEventListener('DOMContentLoaded', () => {
    if (playPauseMusicBtn) {
        playPauseMusicBtn.innerHTML = '<span class="icon">🎶</span> Music';
        playPauseMusicBtn.setAttribute('aria-label', 'Play background music');
    }
    if (music && defaultMusicSrc) {
        music.src = defaultMusicSrc;
        music.load(); // Load the default audio
    }
});


// Event Listener for the Play/Pause Music Button
if (playPauseMusicBtn && music) {
    playPauseMusicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            // State will be updated by 'pause' event listener below
        } else {
            // Attempt to play the current music source
            music.play().then(() => {
                // Playback successful
                isMusicPlaying = true;
                let playingText = music.src.includes(defaultMusicSrc) ? 'Default' : (music.src.split('/').pop().split('?')[0]);
                if (playingText.length > 15) playingText = playingText.substring(0, 12) + '...'; // Truncate filename
                playPauseMusicBtn.innerHTML = `<span class="icon">⏸️</span> Playing: ${playingText}`;
                playPauseMusicBtn.setAttribute('aria-label', `Pause: ${playingText}`);
            }).catch(error => {
                // If play() fails (e.g., autoplay blocked), inform the user
                console.warn("Music playback blocked by browser or no source. Click upload to add music.", error);
                alert("Browser policy requires user interaction to play music. Please use the 'Upload' button if you'd like to add your own, or try clicking 'Music' again.");
                // Button remains 'Music' or last state if already paused
            });
        }
    });
}

// Event Listener for the Upload Music Button (Triggers hidden file input)
if (uploadMusicTriggerBtn && musicUploadInput) {
    uploadMusicTriggerBtn.addEventListener('click', () => {
        musicUploadInput.click(); // Directly opens the file selection dialog
    });
}

// Handles the selected file from the hidden input
if (musicUploadInput && music) {
    musicUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the first selected file

        if (file) {
            if (file.type.startsWith('audio/')) {
                const fileURL = URL.createObjectURL(file);
                music.src = fileURL;
                music.load(); // Load the new audio source
                // URL.revokeObjectURL(fileURL); // Optional: Clean up after setting src, but can cause issues if not fully loaded. Better handled on page unload.

                // Try to play the new music immediately
                music.play().then(() => {
                    isMusicPlaying = true;
                    let displayName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
                    playPauseMusicBtn.innerHTML = `<span class="icon">⏸️</span> Playing: ${displayName}`; // Update play/pause button
                    playPauseMusicBtn.setAttribute('aria-label', `Pause: ${file.name}`);
                }).catch(error => {
                    console.error("Error playing uploaded music after selection:", error);
                    alert(`Could not play your music file (${file.name}). Please try another file or ensure browser allows media playback.`);
                    isMusicPlaying = false; // Reset state
                    playPauseMusicBtn.innerHTML = '<span class="icon">🎶</span> Music'; // Reset play/pause button
                    playPauseMusicBtn.setAttribute('aria-label', 'Play background music');
                });
            } else {
                alert("Please upload a valid audio file (e.g., MP3, WAV, OGG).");
            }
        } else {
            // If no file was selected after opening the dialog (user canceled)
            // If music was playing before, it continues playing. If not, button stays in default state.
            if (!isMusicPlaying) {
                playPauseMusicBtn.innerHTML = '<span class="icon">🎶</span> Music';
                playPauseMusicBtn.setAttribute('aria-label', 'Play background music');
            }
        }
    });
}

// Update Play/Pause button when music ends
if (music && playPauseMusicBtn) {
    music.addEventListener('ended', () => {
        isMusicPlaying = false;
        playPauseMusicBtn.innerHTML = '<span class="icon">🎶</span> Music';
        playPauseMusicBtn.setAttribute('aria-label', 'Play background music');
        // If it was default music, auto-restart it for looping
        if (music.src.includes(defaultMusicSrc)) {
            music.currentTime = 0; // Rewind to start
            music.play().then(() => {
                isMusicPlaying = true;
                playPauseMusicBtn.innerHTML = '<span class="icon">⏸️</span> Playing: Default';
                playPauseMusicBtn.setAttribute('aria-label', 'Pause music');
            }).catch(e => console.error("Error restarting default music:", e));
        }
    });

    // Update Play/Pause button when music is explicitly paused
    music.addEventListener('pause', () => {
        if (isMusicPlaying) { // Only update if it was playing and is now paused
            isMusicPlaying = false;
            playPauseMusicBtn.innerHTML = '<span class="icon">🎶</span> Music';
            playPauseMusicBtn.setAttribute('aria-label', 'Play background music');
        }
    });

    // Update Play/Pause button when music plays (e.g., from browser controls or autoplay starts)
    music.addEventListener('play', () => {
        if (!isMusicPlaying) { // Only update if it was not already marked as playing
            isMusicPlaying = true;
            let playingText = music.src.includes(defaultMusicSrc) ? 'Default' : (music.src.split('/').pop().split('?')[0]);
            if (playingText.length > 15) playingText = playingText.substring(0, 12) + '...';
            playPauseMusicBtn.innerHTML = `<span class="icon">⏸️</span> Playing: ${playingText}`;
            playPauseMusicBtn.setAttribute('aria-label', `Pause: ${playingText}`);
        }
    });
}


// --- Theme Toggle Logic ---
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<span class="icon">☀️</span> Theme';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<span class="icon">🌙</span> Theme';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Load user's theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<span class="icon">☀️</span> Theme';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        }
    } else {
        // Ensure light theme is default or explicitly set if no preference
        document.body.classList.remove('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<span class="icon">🌙</span> Theme';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    checkReveal(); // Initial check for scroll reveal for elements visible on load
});


// --- Smooth Scrolling for Navigation and CTA Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') { // Handle links that are just '#'
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, null, targetId);
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            history.pushState(null, null, targetId);
        }
    });
});

// --- Back to Top Button Logic ---
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { // Show button after scrolling down more
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// --- Scroll Reveal Animation Logic ---
const revealElements = document.querySelectorAll('.reveal-item');

function checkReveal() {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Reveal if 85% of element is in view
        if (elementTop < windowHeight * 0.85) {
            el.classList.add('active');
        } else {
            // Optional: Remove 'active' if element scrolls back out of view, for re-reveal effect
            // el.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', checkReveal);
window.addEventListener('resize', checkReveal);


// --- Image Carousel/Slider Logic ---
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let carouselInterval;

if (slides.length > 0 && dots.length > 0) {
    function showSlides(n) {
        if (n >= slides.length) { slideIndex = 0; }
        if (n < 0) { slideIndex = slides.length - 1; }

        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));

        slides[slideIndex].style.display = 'block';
        dots[slideIndex].classList.add('active');
    }

    // Global functions (for onclick in HTML)
    window.plusSlides = function(n) { // Made global for direct HTML onclick
        stopAutoSlide(); // Stop auto-slide when manual navigation
        showSlides(slideIndex += n);
        startAutoSlide(); // Restart auto-slide after manual navigation
    };

    window.currentSlide = function(n) { // Made global for direct HTML onclick
        stopAutoSlide(); // Stop auto-slide when manual navigation
        showSlides(slideIndex = n);
        startAutoSlide(); // Restart auto-slide after manual navigation
    };

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval first
        carouselInterval = setInterval(() => {
            showSlides(++slideIndex);
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(carouselInterval);
    }

    // Add event listeners for carousel navigation arrows
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    if (nextBtn) { nextBtn.addEventListener('click', () => plusSlides(1)); }
    if (prevBtn) { prevBtn.addEventListener('click', () => plusSlides(-1)); }

    // Add event listeners for carousel dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => currentSlide(index));
    });

    // Initialize carousel on page load
    showSlides(slideIndex);
    startAutoSlide();
}


// --- FAQ Accordion Logic ---
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const panel = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');

        // Close all other open accordions
        accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== header && otherHeader.classList.contains('active')) {
                otherHeader.classList.remove('active');
                otherHeader.setAttribute('aria-expanded', 'false');
                otherHeader.nextElementSibling.style.maxHeight = null;
                otherHeader.nextElementSibling.style.padding = '0 30px'; // Reset padding
                otherHeader.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
            }
        });

        // Toggle the clicked accordion
        header.classList.toggle('active');
        const isExpanded = header.classList.contains('active');
        header.setAttribute('aria-expanded', isExpanded); // Update ARIA attribute

        if (panel.style.maxHeight) {
            // If panel is currently open, close it
            panel.style.maxHeight = null;
            panel.style.padding = '0 30px'; // Collapse padding
            icon.style.transform = 'rotate(0deg)';
        } else {
            // If panel is closed, open it
            panel.style.maxHeight = panel.scrollHeight + 'px'; // Set max-height to scrollHeight for smooth transition
            panel.style.padding = '20px 30px'; // Expand padding
            icon.style.transform = 'rotate(45deg)'; // Rotate icon
        }
    });
});


// --- Instruction Modal Logic ---
if (helpBtn && instructionModal && closeModalBtns.length > 0) {
    helpBtn.addEventListener('click', () => {
        instructionModal.classList.add('show');
        // Prevent scrolling on body when modal is open
        document.body.style.overflow = 'hidden';
        // Focus on the close button for accessibility
        instructionModal.querySelector('.close-modal-btn').focus();
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            instructionModal.classList.remove('show');
            // Re-enable scrolling on body
            document.body.style.overflow = '';
            // Return focus to the button that opened the modal (if applicable)
            helpBtn.focus();
        });
    });

    // Close modal if clicked outside content
    instructionModal.addEventListener('click', (e) => {
        if (e.target === instructionModal) { // Check if click was on the overlay itself
            instructionModal.classList.remove('show');
            document.body.style.overflow = '';
            helpBtn.focus();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && instructionModal.classList.contains('show')) {
            instructionModal.classList.remove('show');
            document.body.style.overflow = '';
            helpBtn.focus();
        }
    });
}
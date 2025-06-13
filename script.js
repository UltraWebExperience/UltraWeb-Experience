let slideIndex = 0; // For gallery carousel
let slideshowTimeout; // For gallery carousel

document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Demo Site Logic ---

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-theme') {
            themeToggle.querySelector('.icon').textContent = '☀️';
        } else {
            themeToggle.querySelector('.icon').textContent = '🌙';
        }
    } else {
        // Default to light theme if no preference saved
        body.classList.add('light-theme');
        themeToggle.querySelector('.icon').textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.querySelector('.icon').textContent = '☀️';
            localStorage.setItem('theme', 'dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.querySelector('.icon').textContent = '🌙';
            localStorage.setItem('theme', 'light-theme');
        }
    });

    // Background Music Player
    const musicPlayer = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-music-btn');
    const musicUpload = document.getElementById('music-upload');
    const uploadMusicTriggerBtn = document.getElementById('upload-music-trigger-btn');

    // Load last played state or default to paused
    const savedMusicState = localStorage.getItem('musicPlaying');
    if (savedMusicState === 'true') {
        musicPlayer.play().catch(e => console.log("Music auto-play prevented:", e));
        playPauseBtn.querySelector('.icon').textContent = '⏸️'; // Pause icon
    } else {
        playPauseBtn.querySelector('.icon').textContent = '🎶'; // Play icon
    }

    playPauseBtn.addEventListener('click', () => {
        if (musicPlayer.paused) {
            musicPlayer.play();
            playPauseBtn.querySelector('.icon').textContent = '⏸️'; // Pause icon
            localStorage.setItem('musicPlaying', 'true');
        } else {
            musicPlayer.pause();
            playPauseBtn.querySelector('.icon').textContent = '🎶'; // Play icon
            localStorage.setItem('musicPlaying', 'false');
        }
    });

    uploadMusicTriggerBtn.addEventListener('click', () => {
        musicUpload.click(); // Trigger the hidden file input
    });

    musicUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            musicPlayer.src = fileURL;
            musicPlayer.play();
            playPauseBtn.querySelector('.icon').textContent = '⏸️'; // Pause icon
            localStorage.setItem('musicPlaying', 'true');
            // Clean up old URL object after the audio is loaded/played to prevent memory leaks
            musicPlayer.addEventListener('loadeddata', () => URL.revokeObjectURL(fileURL), { once: true });
        }
    });

    // Instruction Modal
    const helpBtn = document.getElementById('help-btn');
    const instructionModal = document.getElementById('instruction-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    if (helpBtn && instructionModal) {
        helpBtn.addEventListener('click', () => {
            instructionModal.style.display = 'flex'; // Use flex to center
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                instructionModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        });

        // Close modal if clicking outside content
        instructionModal.addEventListener('click', (e) => {
            if (e.target === instructionModal) {
                instructionModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Gallery Carousel
    showSlides(slideIndex); // Initialize gallery carousel

    // FAQ Accordion
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const panel = button.nextElementSibling;
            const icon = button.querySelector('.accordion-icon');

            // Close other open panels first (optional behavior)
            document.querySelectorAll('.accordion-panel.active').forEach(openPanel => {
                if (openPanel !== panel) {
                    openPanel.classList.remove('active');
                    openPanel.style.maxHeight = null;
                    openPanel.previousElementSibling.querySelector('.accordion-icon').textContent = '+';
                    openPanel.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current panel
            if (panel.classList.contains('active')) {
                panel.classList.remove('active');
                panel.style.maxHeight = null;
                icon.textContent = '+';
                button.setAttribute('aria-expanded', 'false');
            } else {
                panel.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + "px"; // Expand to content height
                icon.textContent = '-';
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- New: Signup Form Logic (for signup.html) ---
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            let isValid = true;
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');

            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            // Basic Validation (you'd have more robust validation in a real app)
            if (username.value.trim() === '') {
                document.getElementById('username-error').textContent = 'Username is required.';
                isValid = false;
            }
            if (email.value.trim() === '' || !email.value.includes('@') || !email.value.includes('.')) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address.';
                isValid = false;
            }
            if (password.value.length < 8) {
                document.getElementById('password-error').textContent = 'Password must be at least 8 characters.';
                isValid = false;
            }
            if (password.value !== confirmPassword.value) {
                document.getElementById('confirm-password-error').textContent = 'Passwords do not match.';
                isValid = false;
            }

            if (isValid) {
                // Simulate successful sign-up
                console.log("Simulating sign-up...");
                console.log("Username:", username.value);
                console.log("Email:", email.value);
                // In a real application, you would send this data to a backend server for processing,
                // user creation, and then handle secure redirection based on server response.

                // For this demo, simply redirect to the UltraWeb Academy website
                window.location.href = "https://ultrawebexperience.github.io/UltraWebAcademy/"; // Redirect to your main academy site
            }
        });
    }

    // --- Gallery Carousel Functions (re-defined for clarity, moved to script.js) ---
    function showSlides(n) {
        let i;
        const slides = document.getElementsByClassName("carousel-slide");
        const dots = document.getElementsByClassName("dot");
        if (n >= slides.length) { slideIndex = 0; }
        if (n < 0) { slideIndex = slides.length - 1; }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        if (slides[slideIndex]) { // Check if slide exists before trying to access
            slides[slideIndex].style.display = "block";
            dots[slideIndex].className += " active";
        }
        resetSlideshowTimer();
    }

    // These functions need to be global or accessible for onclick attributes in HTML
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    function autoSlideshow() {
        if (document.getElementsByClassName("carousel-slide").length === 0) return; // Exit if no slides
        slideIndex++;
        showSlides(slideIndex);
        slideshowTimeout = setTimeout(autoSlideshow, 5000); // Change image every 5 seconds
    }

    function resetSlideshowTimer() {
        clearTimeout(slideshowTimeout);
        slideshowTimeout = setTimeout(autoSlideshow, 5000); // Reset timer after manual interaction
    }

    // Initial call for gallery carousel (if on index.html)
    if (document.querySelector('.gallery-section')) { // Check if gallery section is present
        autoSlideshow();
    }

    // Scroll reveal animations
    const revealItems = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the item is visible
        rootMargin: '0px 0px -100px 0px' // Start animation a bit before reaching the top of the viewport
    });

    revealItems.forEach(item => {
        observer.observe(item);
    });

});

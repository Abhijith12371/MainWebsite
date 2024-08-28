// script.js

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

AOS.init({
    duration: 1000, // Duration of animation in milliseconds
    easing: 'ease-in-out', // Easing function for animation
    once: true // Whether animation should happen only once or every time you scroll up/down to it
});

// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const body = document.body;

    // Check for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        html.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        let theme = html.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Visual Feedback
        const submitBtn = contactForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.style.color = 'var(--primary-color)';
                formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Failed to send message.');
            }
        } catch (error) {
            formStatus.style.color = 'red';
            formStatus.textContent = error.message;
            console.error('Submission error:', error);
            // Fallback for demonstration if backend is down
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                formStatus.style.color = 'orange';
                formStatus.textContent = 'Backend not connected (Demo Mode). But your form works!';
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                entry.target.style.opacity = 1; // Ensure it stays visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .project-card, .timeline-item').forEach(el => {
        el.style.opacity = 0; // Initial state
        el.classList.add('animate-up'); // Add class but wait for valid trigger if needed, actually let's just use observer to add class
        el.classList.remove('animate-up');
        observer.observe(el);
    });
});

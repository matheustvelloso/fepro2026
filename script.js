// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const overlay = document.getElementById('menuOverlay');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Clique fora do menu
overlay.addEventListener('click', () => {
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
});
// Close mobile menu when clicking on a link

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000, hasK = false) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = hasK ? 'k' : '';
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = '+' + target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = '+' + Math.floor(start) + suffix;
        }
    }, 16);
}

// Observe stat cards and animate counters
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const hasK = text.includes('K') || text.includes('k');
            const number = parseInt(text.replace(/\D/g, ''));
            if (number) {
                entry.target.classList.add('animated');
                entry.target.textContent = hasK ? '+0K' : '+0';
                animateCounter(entry.target, number, 2000, hasK);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('.section');
const navLinksArray = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Programação Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetDay = button.getAttribute('data-day');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetDay).classList.add('active');
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.horario-card, .expositor-card, .patrocinador-card, .programacao-item, .stat-card');

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Map area tooltips
const mapaAreas = document.querySelectorAll('.mapa-area');

mapaAreas.forEach(area => {
    area.addEventListener('mouseenter', function() {
        const tooltip = this.querySelector('.area-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.top = '-50px';
        }
    });

    area.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.area-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.top = '-40px';
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNav();

    // Add fade-in animation to hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease';
    }
});

// Add CSS animation keyframes via JavaScript (fallback)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

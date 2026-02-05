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
function animateCounter(element, target, duration = 2000, hasDot = false) {
    let start = 0;
    const increment = target / (duration / 16);

    const formatWithDot = (value) => {
        if (!hasDot) return value.toString();
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const timer = setInterval(() => {
        start += increment;

        if (start >= target) {
            element.textContent = '+' + formatWithDot(target);
            clearInterval(timer);
        } else {
            element.textContent = '+' + formatWithDot(Math.floor(start));
        }
    }, 16);
}


// Observe stat cards and animate counters
const statNumbers = document.querySelectorAll('.stat-number');

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;

            const hasDot = text.includes('.');
            const number = parseInt(text.replace(/\D/g, ''), 10);

            if (number) {
                entry.target.classList.add('animated');
                entry.target.textContent = '+0';
                animateCounter(entry.target, number, 2000, hasDot);
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
    area.addEventListener('mouseenter', function () {
        const tooltip = this.querySelector('.area-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.top = '-50px';
        }
    });

    area.addEventListener('mouseleave', function () {
        const tooltip = this.querySelector('.area-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.top = '-40px';
        }
    });
});

// ========== CAROUSEL FUNCTIONALITY ==========

class Carousel {
    constructor(carouselName, desktopCardsPerView = 3) {
        this.carouselName = carouselName;
        this.desktopCardsPerView = desktopCardsPerView;
        this.container = document.querySelector(`.carousel-container[data-carousel="${carouselName}"]`);
        this.track = this.container?.querySelector('.carousel-track');
        this.prevBtn = document.querySelector(`.carousel-btn-prev[data-carousel="${carouselName}"]`);
        this.nextBtn = document.querySelector(`.carousel-btn-next[data-carousel="${carouselName}"]`);
        this.dotsContainer = document.querySelector(`.carousel-dots[data-carousel="${carouselName}"]`);

        if (!this.container || !this.track) return;

        this.cards = Array.from(this.track.children);
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.cardsPerView = 0;
        this.totalSlides = 0;

        // Touch/drag variables
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.init();
    }

    init() {
        this.calculateDimensions();
        this.createDots();
        this.attachEvents();
        this.updateCarousel();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.createDots();
            this.updateCarousel();
        });
    }

    calculateDimensions() {
        if (!this.cards.length) return;

        // Get viewport width
        const viewportWidth = window.innerWidth;

        // Determine cards per view based on screen size
        if (viewportWidth <= 480) {
            // Small mobile: 1 card for both
            this.cardsPerView = 1;
        } else if (viewportWidth <= 575) {
            // Mobile: 1 card for both
            this.cardsPerView = 1;
        } else if (viewportWidth <= 768) {
            // Tablet: 2 cards for both
            this.cardsPerView = 2;
        } else {
            // Desktop: use the defined cardsPerView (3 for both)
            this.cardsPerView = this.desktopCardsPerView;
        }

        // Get card width including gap
        const cardStyle = window.getComputedStyle(this.cards[0]);
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.track).gap) || 32;

        this.cardWidth = cardWidth + gap;

        // Make sure we show at least 1 card
        this.cardsPerView = Math.max(1, this.cardsPerView);

        // Calculate total slides (pages)
        this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);

        // Adjust if we're showing all cards
        if (this.cardsPerView >= this.cards.length) {
            this.totalSlides = 1;
        }

        // Reset to first slide if current index is out of bounds
        if (this.currentIndex >= this.totalSlides) {
            this.currentIndex = 0;
        }
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            if (i === this.currentIndex) dot.classList.add('active');

            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    attachEvents() {
        // Button navigation
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        // Touch events
        this.track.addEventListener('touchstart', (e) => this.touchStart(e));
        this.track.addEventListener('touchmove', (e) => this.touchMove(e));
        this.track.addEventListener('touchend', () => this.touchEnd());

        // Mouse events
        this.track.addEventListener('mousedown', (e) => this.touchStart(e));
        this.track.addEventListener('mousemove', (e) => this.touchMove(e));
        this.track.addEventListener('mouseup', () => this.touchEnd());
        this.track.addEventListener('mouseleave', () => this.touchEnd());

        // Prevent context menu on long press
        this.track.addEventListener('contextmenu', (e) => {
            if (this.isDragging) e.preventDefault();
        });
    }

    touchStart(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.track.style.cursor = 'grabbing';
        this.track.style.transition = 'none';
    }

    touchMove(e) {
        if (!this.isDragging) return;

        const currentPosition = this.getPositionX(e);
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;

        // Add resistance at boundaries
        const maxTranslate = 0;
        const minTranslate = -(this.cardWidth * (this.cards.length - this.cardsPerView));

        if (this.currentTranslate > maxTranslate) {
            this.currentTranslate = maxTranslate + (this.currentTranslate - maxTranslate) * 0.3;
        } else if (this.currentTranslate < minTranslate) {
            this.currentTranslate = minTranslate + (this.currentTranslate - minTranslate) * 0.3;
        }

        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    touchEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        const movedBy = this.currentTranslate - this.prevTranslate;

        // If moved enough, go to next/prev
        if (movedBy < -50 && this.currentIndex < this.totalSlides - 1) {
            this.next();
        } else if (movedBy > 50 && this.currentIndex > 0) {
            this.prev();
        } else {
            this.updateCarousel();
        }
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    next() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        // Calculate translate value
        const translateX = -this.currentIndex * this.cardWidth * this.cardsPerView;
        this.track.style.transform = `translateX(${translateX}px)`;

        this.prevTranslate = translateX;
        this.currentTranslate = translateX;

        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.totalSlides - 1;
        }
    }
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNav();

    // Add fade-in animation to hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 0.8s ease';
    }

    // Initialize countdown
    initCountdown();

    // Initialize carousels with specific cards per view
    // Exhibitors: 3 cards on desktop
    const exhibitorsCarousel = new Carousel('exhibitors', 3);
    // Partners: 3 cards on desktop
    const partnersCarousel = new Carousel('partners', 3);
    const picturesCarousel = new Carousel('pictures', 3);
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

// ========== COUNTDOWN FUNCTIONALITY ==========

function initCountdown() {
    // CONFIGURE A DATA DO SEU EVENTO AQUI
    // Formato: Ano, Mês (0-11, onde 0=Janeiro), Dia, Hora, Minuto
    const eventDate = new Date(2026, 3, 8, 13, 0, 0); // 08 de Abril de 2026, 13:00

    // Atualiza o texto da data do evento
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    const eventDateElement = document.getElementById('eventDate');
    if (eventDateElement) {
        eventDateElement.textContent = eventDate.toLocaleDateString('pt-BR', options);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate.getTime() - now;

        const countdownGrid = document.querySelector('.countdown-grid');
        const messageElement = document.getElementById('message');

        if (distance < 0) {
            // O evento já aconteceu
            if (countdownGrid) countdownGrid.style.display = 'none';
            if (messageElement) messageElement.classList.add('show');
            return;
        }

        // Cálculos de tempo
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Atualiza os valores na página
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }

    // Atualiza a contagem a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Seleciona elementos
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const submenu = document.querySelector('.submenu');

    // Toggle ao clicar (útil para mobile)
    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
        submenu.classList.toggle('active');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
            submenu.classList.remove('active');
        }
    });

    // Alternativa: fecha ao clicar em qualquer lugar do submenu
    submenu.addEventListener('click', function () {
        dropdown.classList.remove('active');
        submenu.classList.remove('active');
    });
}

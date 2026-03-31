// 1. LIQUID CURSOR LAG
const cursor = document.querySelector('.cursor');
const blur = document.querySelector('.cursor-blur');

window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    // The blur follows with a slight delay
    setTimeout(() => {
        blur.style.transform = `translate(${e.clientX - 26}px, ${e.clientY - 26}px)`;
    }, 80);
});

// 2. PRELOADER WITH VARIABLE SPEED
let progress = 0;
const bar = document.querySelector('.loader-bar');
const text = document.querySelector('.count');

function load() {
    progress += Math.floor(Math.random() * 8) + 1;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    text.innerText = progress < 10 ? '0' + progress : progress;

    if (progress < 100) {
        setTimeout(load, 60);
    } else {
        setTimeout(() => {
            document.getElementById('loader').style.transform = 'translateY(-100%)';
            document.getElementById('loader').style.transition = '0.8s cubic-bezier(0.8, 0, 0.2, 1)';
        }, 400);
    }
}
load();

// 3. 3D INFINITE CAROUSEL LOGIC
const cards = document.querySelectorAll('.slider-card');
let angle = 0;

function rotate() {
    angle -= 72; // 360 / 5 cards
    cards.forEach((card, i) => {
        const cardAngle = (angle + (i * 72)) * (Math.PI / 180);
        
        // Circular math for X and Z depth
        const x = Math.sin(cardAngle) * 480; 
        const z = Math.cos(cardAngle) * 420; 
        const scale = (z + 600) / 1000; 
        
        card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        card.style.zIndex = Math.round(z);
        card.style.opacity = scale > 0.5 ? "1" : "0.2";
        
        // Hide text on cards that are far away
        card.querySelector('.card-overlay').style.opacity = scale > 0.8 ? "1" : "0";
    });
}

// Auto-rotate every 3.5 seconds
setInterval(rotate, 3500);
rotate(); // Initial setup

// 4. SCROLL REVEAL & NAV SHRINK
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('shrink', window.scrollY > 80);
});

// 5. STATS COUNTER
const stats = document.querySelectorAll('.counter');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if(e.isIntersecting) {
            const target = +e.target.dataset.target;
            let c = 0;
            const timer = setInterval(() => {
                c += Math.ceil(target/40);
                if(c >= target) { e.target.innerText = target; clearInterval(timer); }
                else { e.target.innerText = c; }
            }, 40);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.8 });
stats.forEach(s => obs.observe(s));

// SMOOTH SCROLL ENGINE
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Get the position of the target minus the navbar height
            const offset = 100; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});
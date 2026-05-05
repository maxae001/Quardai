const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

const hoursSlider = document.getElementById('hours-slider');
const hoursDisplay = document.getElementById('hours-display');
const timeSavedDisplay = document.getElementById('time-saved');
const costSavedDisplay = document.getElementById('cost-saved');

const HOURLY_RATE = 50;
const EFFICIENCY_FACTOR = 0.70;
const WEEKS_PER_YEAR = 52;

function updateCalculator() {
    const hours = parseInt(hoursSlider.value);
    
    const timeSaved = Math.round(hours * EFFICIENCY_FACTOR);
    const weeklySavings = timeSaved * HOURLY_RATE;
    const annualSavings = weeklySavings * WEEKS_PER_YEAR;
    
    animateValue(hoursDisplay, parseInt(hoursDisplay.innerText), hours, 200);
    animateValue(timeSavedDisplay, parseInt(timeSavedDisplay.innerText), timeSaved, 200);
    animateValue(costSavedDisplay, 
        parseInt(costSavedDisplay.innerText.replace(/,/g, '')), 
        annualSavings, 
        200, 
        true
    );
}

function animateValue(obj, start, end, duration, formatCurrency = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        if (formatCurrency) {
            obj.innerText = current.toLocaleString();
        } else {
            obj.innerText = current;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

hoursSlider.addEventListener('input', updateCalculator);

updateCalculator();

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numParticles = Math.min(Math.floor((width * height) / 15000), 100);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

initParticles();

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 - distance / 750})`;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Transmitting...';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.innerText = 'Message Received';
        btn.style.backgroundColor = '#10b981';
        btn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
        e.target.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '';
            btn.style.boxShadow = '';
            btn.style.opacity = '1';
        }, 3000);
    }, 1500);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
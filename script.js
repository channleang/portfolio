/**
 * Background Animation for Leang Chann's Portfolio
 * A subtle, interactive particle system that creates a "neural" or "constellation" effect.
 */

class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.maxParticles = 80;
        this.particleColor = 'rgba(79, 195, 247, 0.4)'; // Based on --accent
        this.lineColor = 'rgba(79, 195, 247, 0.1)';
        
        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.id = 'bg-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        // Create particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.canvas.width, this.canvas.height, this.mouse);
            this.particles[i].draw(this.ctx, this.particleColor);
            
            // Connect particles
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(79, 195, 247, ${0.1 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }

    update(w, h, mouse) {
        // Bounce off edges
        if (this.x > w || this.x < 0) this.speedX = -this.speedX;
        if (this.y > h || this.y < 0) this.speedY = -this.speedY;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 5;
                const directionY = forceDirectionY * force * 5;
                
                this.x -= directionX;
                this.y -= directionY;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const experiences = [
    {
        company: "AMK Bank",
        period: "2026 — Present",
        role: "Senior Mobile Developer",
        current: true,
        bullets: [
            "Spearheading the architectural design and full-lifecycle development of AMK's flagship mobile banking platform, targeting millions of users.",
            "Driving technical excellence through rigorous code reviews, mentoring developers, and establishing modern CI/CD pipelines.",
            "Architecting high-performance Spring Boot microservices to bridge legacy core banking systems with modern mobile frontends.",
            "Led the successful migration of critical payment logic, reducing technical debt and improving system maintainability by 30%."
        ]
    },
    {
        company: "Youding",
        period: "2024 — 2026",
        role: "Senior iOS Developer",
        bullets: [
            "Engineered the core architecture of a mission-critical POS system, handling thousands of daily retail transactions with 99.9% uptime.",
            "Integrated complex payment gateways (ABA, Wing, PiPay) and accounting integrations, streamlining financial reporting for merchants.",
            "Optimized SQL performance and offline synchronization logic, ensuring seamless operations in low-connectivity environments.",
            "Transformed the user experience by implementing high-fidelity animations and responsive UI patterns."
        ]
    },
    {
        company: "Pipay",
        period: "2022 — 2024",
        role: "Senior iOS Developer",
        bullets: [
            "Architected and delivered major feature updates for Cambodia's leading fintech app, focusing on security and high-concurrency payment flows.",
            "Reduced crash rates by 60% through proactive profiling, memory leak detection, and implementing robust error-handling patterns.",
            "Spearheaded the integration of biometric authentication and advanced encryption layers to meet international banking security standards."
        ]
    },
    {
        company: "E-School Cambodia",
        period: "2018 — 2022",
        role: "Senior iOS Developer",
        bullets: [
            "Scaled the mobile engineering team from 2 to 8 developers, overseeing the delivery of 4+ high-traffic educational platforms.",
            "Launched a proprietary video streaming engine within the iOS app, significantly improving learning accessibility for remote students.",
            "Managed complex AWS infrastructure and media delivery networks to support over 200,000 active learners."
        ]
    },
    {
        company: "Plan-B Cambodia & Nanita Tech",
        period: "2014 — 2018",
        role: "Web Developer",
        bullets: [
            "Delivered bespoke enterprise solutions for international Japanese clients using Laravel and Node.js.",
            "Designed and documented RESTful APIs that served as the backbone for multiple cross-platform mobile applications.",
            "Pivoted into native mobile development, building the foundation for a career-long focus on iOS and Android excellence."
        ]
    }
];

function renderExperiences() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = experiences.map((exp, index) => `
        <div class="timeline-item ${exp.current ? 'current' : ''}" style="animation-delay: ${index * 0.1}s">
            <div class="timeline-dot"></div>
            <div class="exp-header">
                <span class="exp-company">${exp.company}</span>
                <span class="exp-period">${exp.period}</span>
            </div>
            <div class="exp-role">${exp.role}</div>
            <ul class="exp-bullets">
                ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Start animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderExperiences();
    new ParticleBackground();
    
    // Add intersection observer for reveal animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .stat-card, .skill-group, .app-card').forEach(el => {
        observer.observe(el);
    });
});

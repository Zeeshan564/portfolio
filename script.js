/**
 * Zeeshan Aziz — Personal Portfolio Interactive Scripts
 * Features:
 *  - Interactive Neural Network Canvas (particle background)
 *  - Scroll-spy navigation & progress bar
 *  - Mobile menu toggle
 *  - Interactive project filtering
 *  - Scroll reveal animations
 *  - Simulated GitHub contribution heatmap
 *  - Interactive contact form with validation & toast notification
 *  - CV modal & preview system
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. Neural Network Canvas Particle Background
     ========================================================================== */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const maxDistance = 130;

    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Subtle mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    initParticles();
    animate();
  }

  /* ==========================================================================
     2. Scroll Progress & Sticky Navbar State
     ========================================================================== */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (window.scrollY > 40) {
      navbar.classList.add('bg-slate-950/90', 'shadow-lg', 'shadow-black/40', 'border-white/10');
      navbar.classList.remove('bg-dark/75', 'border-white/5');
    } else {
      navbar.classList.remove('bg-slate-950/90', 'shadow-lg', 'shadow-black/40', 'border-white/10');
      navbar.classList.add('bg-dark/75', 'border-white/5');
    }

    updateScrollSpy();
  });

  /* ==========================================================================
     3. Scroll-Spy (Active Nav Link)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function updateScrollSpy() {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     4. Mobile Menu Drawer
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOpenIcon = document.getElementById('menuOpenIcon');
  const menuCloseIcon = document.getElementById('menuCloseIcon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuOpenIcon.classList.remove('hidden');
        menuCloseIcon.classList.add('hidden');
      } else {
        mobileMenu.classList.remove('hidden');
        menuOpenIcon.classList.add('hidden');
        menuCloseIcon.classList.remove('hidden');
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuOpenIcon.classList.remove('hidden');
        menuCloseIcon.classList.add('hidden');
      });
    });
  }

  /* ==========================================================================
     5. Scroll Reveal Intersection Observer
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. Interactive Project Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     7. Simulated GitHub Activity Heatmap
     ========================================================================== */
  const heatmap = document.getElementById('githubHeatmap');
  if (heatmap) {
    const totalBlocks = 32 * 7; // ~32 weeks displayed
    const colorClasses = [
      'bg-slate-800/80',
      'bg-emerald-950',
      'bg-emerald-800',
      'bg-emerald-600',
      'bg-emerald-400'
    ];

    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement('div');
      block.className = 'heat-block';
      
      // Weight toward realistic student commit streaks
      const rand = Math.random();
      let colorClass;
      if (rand < 0.25) colorClass = colorClasses[0]; // blank/rest day
      else if (rand < 0.55) colorClass = colorClasses[1];
      else if (rand < 0.80) colorClass = colorClasses[2];
      else if (rand < 0.93) colorClass = colorClasses[3];
      else colorClass = colorClasses[4];

      block.classList.add(colorClass);
      heatmap.appendChild(block);
    }
  }

  /* ==========================================================================
     8. Interactive Contact Form with Validation & Toast
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', false);
        return;
      }

      // Button loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⟳</span>
        <span>Sending Message...</span>
      `;

      // Simulate sending delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        showStatus(`Thank you, ${name}! Your message has been received. Zeeshan will get back to you soon.`, true);
        showToast('Message sent successfully! 🚀');
      }, 1200);
    });
  }

  function showStatus(msg, isSuccess) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `p-3.5 rounded-xl text-sm font-medium text-center transition-all ${
      isSuccess 
        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
        : 'bg-red-500/15 border border-red-500/30 text-red-300'
    }`;
    formStatus.classList.remove('hidden');

    setTimeout(() => {
      formStatus.classList.add('hidden');
    }, 6000);
  }

  /* ==========================================================================
     9. CV Modal Preview & Actions
     ========================================================================== */
  const cvBtn = document.getElementById('cvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModal = document.getElementById('closeCvModal');
  const simulateDownloadBtn = document.getElementById('simulateDownloadBtn');

  if (cvBtn && cvModal) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModal.classList.remove('hidden');
    });

    closeCvModal.addEventListener('click', () => {
      cvModal.classList.add('hidden');
    });

    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        cvModal.classList.add('hidden');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !cvModal.classList.contains('hidden')) {
        cvModal.classList.add('hidden');
      }
    });

    if (simulateDownloadBtn) {
      simulateDownloadBtn.addEventListener('click', () => {
        showToast('Downloading Zeeshan_Aziz_Resume_Template.pdf...');
        cvModal.classList.add('hidden');
      });
    }
  }

});

/* ==========================================================================
   Global Helper Functions
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.className = 'fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border text-sm font-medium transition-all transform duration-300 bg-slate-900 border-cyan-500/40 text-slate-100 flex items-center gap-2';
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

function showNotice(msg) {
  showToast(msg);
}

function openProjectModal(title, details) {
  showToast(`Viewing details for: ${title}`);
}

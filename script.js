/* =============================================
   PORTFOLIO — script.js
   Handles: Nav scroll, reveal animations,
   mobile menu, stat counters, skill bars
   ============================================= */

'use strict';

/* ── NAV: sticky + scrolled state ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── MOBILE MENU ── */
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── INTERSECTION OBSERVER: reveal-up ── */
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── STAT COUNTER ANIMATION ── */
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

statNums.forEach(el => counterObserver.observe(el));

/* ── SKILL BAR ANIMATION ── */
const skillBars = document.querySelectorAll('.skill-bar');

skillBars.forEach(bar => {
  const w = bar.dataset.w;
  bar.style.setProperty('--bar-w', w + '%');
});

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger all bars inside this section
      const bars = entry.target.querySelectorAll('.skill-bar');
      bars.forEach((b, i) => {
        setTimeout(() => b.classList.add('animated'), i * 80);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) barObserver.observe(skillsSection);

/* ── SMOOTH ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function onScroll() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinksAll.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + id) {
          a.style.color = 'var(--text)';
        }
      });
    }
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── CURSOR TRAIL (subtle, desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 8px; height: 8px;
    background: rgba(79,255,176,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.3s ease;
    transform: translate(-50%, -50%);
    opacity: 0;
  `;
  document.body.appendChild(trail);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    trail.style.opacity = '1';
    trail.style.left = mx + 'px';
    trail.style.top  = my + 'px';
  });
  document.addEventListener('mouseleave', () => {
    trail.style.opacity = '0';
  });
}

/* ── PROJECT CARD: tilt on hover ── */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / rect.width;
    const dy     = (e.clientY - cy) / rect.height;
    const rotX   = -dy * 5;
    const rotY   =  dx * 5;
    card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});

/* ── HERO: initial reveal on load ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up').forEach(el => {
    // Small stagger then trigger
    setTimeout(() => el.classList.add('visible'),
      (parseInt(el.className.match(/delay-(\d)/)?.[1] || 0)) * 130 + 200
    );
  });
});

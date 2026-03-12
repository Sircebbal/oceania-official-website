// ============================================================
//  ØCEANÍA — Main JavaScript
//  FILE: script.js
//  Shared across: index.html, bio.html, press.html, contact.html
//
//  STRUCTURE:
//  1. Nav Scroll Behavior
//  2. Scroll Reveal — Intersection Observer
//  3. Hero Parallax Effect (index.html only)
//  4. Contact Form — Async Submit (contact.html only)
// ============================================================


// ============================================================
//  1. NAV SCROLL BEHAVIOR
//  — Adds .nav-scrolled to the nav after 60px of scroll.
//  — CSS handles the frosted glass transition.
// ============================================================
const nav = document.getElementById('main-nav');

if (nav) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
}


// ============================================================
//  2. SCROLL REVEAL — INTERSECTION OBSERVER
//  — Watches all .reveal, .reveal-left, .reveal-right,
//    and .reveal-children elements.
//  — Adds .revealed when 15% of the element enters the viewport.
//  — Stops watching after reveal (no re-animation on scroll back).
// ============================================================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0
};

const revealCallback = function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

const revealElements = document.querySelectorAll(
  '.reveal, .reveal-children, .reveal-left, .reveal-right'
);

// On mobile, skip the observer and reveal everything immediately
if (window.innerWidth < 900) {
  revealElements.forEach(function (el) {
    el.classList.add('revealed');
  });
} else {
  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });
}


// ============================================================
//  3. HERO PARALLAX EFFECT
//  — index.html only — guarded by null check.
//  — Shifts hero content up at 30% scroll speed.
//  — Fades hero content out over the first 400px of scroll.
//  — Shifts background at 15% for depth.
//  — Disabled on mobile (under 768px) for performance.
// ============================================================
const heroContent = document.querySelector('.hero-content');
const heroBg = document.querySelector('.hero-bg');

if (heroContent && heroBg) {
  window.addEventListener('scroll', function () {
    // Skip parallax on mobile — not needed and can cause jank
    if (window.innerWidth < 768) return;

    const scrolled = window.scrollY;

    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrolled / 400);
      heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}


// ============================================================
//  4. CONTACT FORM — ASYNC SUBMIT
//  — contact.html only — guarded by null check.
//  — Submits to Formspree without reloading the page.
//  — Success: replaces form with a confirmation message.
//  — Error: appends an error message below the submit button.
// ============================================================
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.innerHTML = `
        <p class="form-feedback form-feedback--success">
          Message received. We'll be in touch soon.
        </p>`;
    } else {
      const existing = document.querySelector('.form-feedback--error');
      if (!existing) {
        form.insertAdjacentHTML('beforeend', `
          <p class="form-feedback form-feedback--error">
            Something went wrong. Try again or email us directly.
          </p>`);
      }
    }
  });
}
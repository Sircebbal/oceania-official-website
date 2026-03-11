//    ============================================================
//        JAVASCRIPT
//        ============================================================
//        All scripts go at the bottom of <body> — this ensures the
//        HTML is parsed before JS tries to manipulate it.
//        No external libraries needed — pure vanilla JS.
//   ============================================================ -->
//   <script>
//     // ============================================================
//     // 1. NAV SCROLL BEHAVIOR
//     // ============================================================
//     // We listen for the window "scroll" event.
//     // When the user scrolls past 60px, we add the "nav-scrolled"
//     // class to the nav element, which triggers the CSS transition
//     // to add a backdrop-blur background.
//     // ============================================================

    const nav = document.getElementById('main-nav');

    window.addEventListener('scroll', function() {
      // window.scrollY = how many pixels the page has scrolled vertically
      if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });


    // ============================================================
    // 2. SCROLL REVEAL — INTERSECTION OBSERVER
    // ============================================================
    // IntersectionObserver watches elements and fires a callback
    // when they enter or leave the viewport.
    //
    // This is more performant than listening to the scroll event
    // for every element — the browser handles it natively.
    //
    // How it works:
    // - We grab all elements with class "reveal" or "reveal-children"
    // - When one enters the viewport (threshold: 0.15 = 15% visible),
    //   we add the "revealed" class
    // - The CSS transition on .reveal / .reveal-children handles
    //   the actual animation
    // ============================================================

    // Configuration for the observer
    const observerOptions = {
      root: null,           // null = use the browser viewport as root
      rootMargin: '0px',    // no extra margin around viewport
      threshold: 0.15       // trigger when 15% of element is visible
    };

    // Callback fires whenever an observed element's visibility changes
    const revealCallback = function(entries, observer) {
      entries.forEach(function(entry) {
        // entry.isIntersecting = true when element is in viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Once revealed, stop observing — no need to re-animate
          observer.unobserve(entry.target);
        }
      });
    };

    // Create the observer with our config and callback
    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

    // Find all elements to observe and start watching them
const revealElements = document.querySelectorAll('.reveal, .reveal-children, .reveal-left, .reveal-right');
    // querySelectorAll returns a NodeList — we convert to array with spread
    [...revealElements].forEach(function(el) {
      revealObserver.observe(el);
    });


    // ============================================================
    // 3. HERO PARALLAX EFFECT
    // ============================================================
    // As the user scrolls down, we shift the hero content upward
    // at half the scroll speed — this creates depth/parallax.
    //
    // requestAnimationFrame ensures smooth 60fps animation by
    // syncing with the browser's render cycle.
    // ============================================================

    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-bg');

    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;

      // Only run while hero is visible (first 100vh)
      if (scrolled < window.innerHeight) {
        // Move content up at 30% of scroll speed
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;

        // Fade out hero content as user scrolls
        // 1 - (scrolled / 400) goes from 1 to 0 over first 400px of scroll
        const opacity = Math.max(0, 1 - scrolled / 400);
        heroContent.style.opacity = opacity;

        // Move background slightly for depth (slower = deeper layer feel)
        heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    });




    const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', async (e) => {
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
      const el = document.querySelector('.form-feedback--error');
      if (!el) {
        form.insertAdjacentHTML('beforeend', `
          <p class="form-feedback form-feedback--error">
            Something went wrong. Try again or email us directly.
          </p>`);
      }
    }
  });
}
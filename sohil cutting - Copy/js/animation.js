/**
 * SOHIL HAIR STUDIO — Complete Directional Animation System v2
 * ─────────────────────────────────────────────────────────────
 * Every element on the page animates directionally when it enters the viewport.
 * Left-side content  → slides from LEFT
 * Right-side content → slides from RIGHT
 * Headings / labels  → slides from BOTTOM (upward)
 * Icons / badges     → scale + fade in
 * Smooth, slightly slow, premium cubic-bezier easing throughout.
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   SECTION 1 — PAGE TRANSITION  (cinematic black overlay)
══════════════════════════════════════════════════════════════ */
(function initPageTransitions() {
    let overlay = document.getElementById('pt-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pt-overlay';
        overlay.style.cssText =
            'position:fixed;inset:0;background:#050505;z-index:999999;' +
            'pointer-events:none;opacity:1;' +
            'transition:opacity 0.65s cubic-bezier(0.22,1,0.36,1);';
        document.body.prepend(overlay);
    }

    // Fade overlay OUT → reveal page
    requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.pointerEvents = 'none'; }, 700);
    }));

    // Intercept local links → fade overlay IN → navigate
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') ||
            href.startsWith('mailto:') || href.startsWith('http') ||
            link.target === '_blank') return;

        link.addEventListener('click', function (e) {
            e.preventDefault();
            const dest = this.getAttribute('href');
            const ov = document.getElementById('pt-overlay');
            if (ov) {
                ov.style.pointerEvents = 'all';
                ov.style.opacity = '1';
                setTimeout(() => { window.location.href = dest; }, 500);
            } else {
                window.location.href = dest;
            }
        });
    });
})();


/* ══════════════════════════════════════════════════════════════
   SECTION 2 — CSS ENGINE  (3 direction classes + scale variant)
══════════════════════════════════════════════════════════════ */
(function injectAnimCSS() {
    const s = document.createElement('style');
    s.textContent = `
        /* ── FROM LEFT ── */
        .da-left {
            opacity: 0;
            transform: translateX(-70px);
            filter: blur(5px);
            transition:
                opacity   0.85s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                transform 0.85s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                filter    0.75s ease                         var(--da-d,0ms);
        }

        /* ── FROM RIGHT ── */
        .da-right {
            opacity: 0;
            transform: translateX(70px);
            filter: blur(5px);
            transition:
                opacity   0.85s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                transform 0.85s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                filter    0.75s ease                         var(--da-d,0ms);
        }

        /* ── FROM BOTTOM ── */
        .da-up {
            opacity: 0;
            transform: translateY(50px);
            filter: blur(4px);
            transition:
                opacity   0.80s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                transform 0.80s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                filter    0.70s ease                         var(--da-d,0ms);
        }

        /* ── SCALE IN ── */
        .da-scale {
            opacity: 0;
            transform: scale(0.80);
            filter: blur(4px);
            transition:
                opacity   0.80s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                transform 0.80s cubic-bezier(0.22,1,0.36,1) var(--da-d,0ms),
                filter    0.70s ease                         var(--da-d,0ms);
        }

        /* ── VISIBLE STATE (all classes share this) ── */
        .da-left.da-in,
        .da-right.da-in,
        .da-up.da-in,
        .da-scale.da-in {
            opacity:   1 !important;
            transform: none !important;
            filter:    blur(0) !important;
        }

        /* ── Accessibility: honour prefers-reduced-motion ── */
        @media (prefers-reduced-motion: reduce) {
            .da-left, .da-right, .da-up, .da-scale {
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
                transition: none !important;
            }
        }

        /* ═══════════════════════════════════════════════
           HOVER MICRO-INTERACTIONS (entire site)
        ═══════════════════════════════════════════════ */

        /* Navbar logo */
        .logo { transition: opacity 0.3s ease, transform 0.3s ease !important; }
        .logo:hover { transform: scale(1.04) !important; }

        /* Nav links underline slide */
        .nav-links a {
            position: relative;
            transition: color 0.3s ease !important;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -3px; left: 0;
            width: 0; height: 2px;
            background: #e01010;
            border-radius: 2px;
            transition: width 0.32s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-links a:hover::after,
        .nav-links a.active::after { width: 100%; }

        /* Book Now button */
        .book-btn {
            transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.32s ease !important;
        }
        .book-btn:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 8px 24px rgba(220,20,20,0.35) !important;
        }

        /* Hero buttons */
        .btn-primary, .btn-secondary, .btn-red, .btn-black {
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.35s ease,
                        background 0.3s ease !important;
        }
        .btn-red:hover, .btn-primary:hover {
            transform: translateY(-5px) scale(1.04) !important;
            box-shadow: 0 12px 30px rgba(220,20,20,0.45) !important;
        }
        .btn-black:hover, .btn-secondary:hover {
            transform: translateY(-5px) scale(1.04) !important;
            box-shadow: 0 12px 30px rgba(255,255,255,0.12) !important;
        }

        /* About button */
        .about-btn {
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.35s ease !important;
        }
        .about-btn:hover {
            transform: translateY(-4px) scale(1.04) !important;
            box-shadow: 0 10px 26px rgba(220,20,20,0.4) !important;
        }

        /* About features */
        .about-feature {
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .about-feature:hover { transform: translateX(7px) !important; }
        .about-feature i {
            transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                        color 0.28s ease !important;
        }
        .about-feature:hover i {
            transform: scale(1.25) rotate(-10deg) !important;
            color: #ff2020 !important;
        }

        /* Service cards */
        .service-card {
            transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.45s ease !important;
            will-change: transform;
        }
        .service-card:hover {
            transform: translateY(-12px) scale(1.03) !important;
            box-shadow:
                0 22px 44px rgba(0,0,0,0.55),
                0 0 0 1px rgba(220,20,20,0.4),
                0 0 22px rgba(220,20,20,0.28) !important;
        }
        .service-card .icon {
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                        background 0.3s ease !important;
        }
        .service-card:hover .icon {
            transform: rotate(-12deg) scale(1.15) !important;
        }
        .service-card .price span {
            transition: color 0.3s ease !important;
        }
        .service-card:hover .price span {
            color: #ff5555 !important;
        }

        /* Gallery items */
        .gallery-item {
            transition: transform 0.42s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.42s ease !important;
            will-change: transform;
        }
        .gallery-item:hover {
            transform: translateY(-8px) scale(1.035) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.55),
                        0 0 16px rgba(220,20,20,0.22) !important;
        }
        .gallery-item .gallery-overlay {
            transition: opacity 0.4s ease, backdrop-filter 0.4s ease !important;
        }

        /* Contact cards */
        .contact-card {
            transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.38s ease,
                        border-color 0.3s ease !important;
        }
        .contact-card:hover {
            transform: translateY(-6px) !important;
            box-shadow: 0 14px 32px rgba(0,0,0,0.4),
                        0 0 14px rgba(220,20,20,0.18) !important;
        }
        .contact-icon {
            transition: transform 0.32s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .contact-card:hover .contact-icon {
            transform: scale(1.15) rotate(-8deg) !important;
        }

        /* Contact form fields */
        .contact-form input,
        .contact-form select,
        .contact-form textarea {
            transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
            border-color: rgba(220,20,20,0.7) !important;
            box-shadow: 0 0 0 3px rgba(220,20,20,0.12) !important;
            outline: none !important;
        }
        .contact-form button[type="submit"] {
            transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.38s ease !important;
        }
        .contact-form button[type="submit"]:hover {
            transform: translateY(-4px) scale(1.03) !important;
            box-shadow: 0 12px 28px rgba(220,20,20,0.45) !important;
        }

        /* Dev footer elements */
        .dev-contact-card {
            transition: transform 0.38s cubic-bezier(0.22,1,0.36,1),
                        box-shadow 0.38s ease !important;
        }
        .dev-contact-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 14px 32px rgba(0,0,0,0.4),
                        0 0 14px rgba(220,20,20,0.2) !important;
        }
        .dev-social-link {
            transition: transform 0.32s cubic-bezier(0.22,1,0.36,1) !important;
        }
        .dev-social-link:hover { transform: translateY(-5px) scale(1.12) !important; }
        .dev-tech-pill {
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                        background 0.3s ease, color 0.3s ease !important;
        }
        .dev-tech-pill:hover {
            transform: translateY(-4px) scale(1.08) !important;
            background: rgba(220,20,20,0.18) !important;
            color: #ff4444 !important;
        }

        /* Header scroll transition */
        header {
            transition: background 0.4s ease,
                        box-shadow 0.4s ease,
                        backdrop-filter 0.4s ease !important;
        }
    `;
    document.head.appendChild(s);
})();


/* ══════════════════════════════════════════════════════════════
   SECTION 3 — ANIMATION ENGINE  (IntersectionObserver)
══════════════════════════════════════════════════════════════ */
(function initDirectionalAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /**
     * Registers an element for directional animation.
     * @param {Element}  el     - DOM element
     * @param {string}   dir    - 'left' | 'right' | 'up' | 'scale'
     * @param {number}   delay  - delay in ms before animating in
     */
    function register(el, dir, delay = 0) {
        if (!el) return;
        const cls = {
            left:  'da-left',
            right: 'da-right',
            up:    'da-up',
            scale: 'da-scale'
        }[dir] || 'da-up';

        el.classList.add(cls);
        el.style.setProperty('--da-d', delay + 'ms');
        el._daClass = cls;
        el._daDone  = false;
    }

    /**
     * Registers all elements matching a selector.
     * @param {string}  sel    - CSS selector
     * @param {string}  dir
     * @param {number}  baseDelay
     * @param {boolean} stagger   - multiply delay by index?
     * @param {number}  step      - stagger step in ms
     */
    function reg(sel, dir, baseDelay = 0, stagger = false, step = 90) {
        document.querySelectorAll(sel).forEach((el, i) => {
            register(el, dir, stagger ? baseDelay + i * step : baseDelay);
        });
    }

    // ────────────────────────────────────────────────────────
    //  NAVBAR  (fires immediately — handled by GSAP in main.js;
    //  we add directional CSS to reinforce but won't double-fire)
    // ────────────────────────────────────────────────────────
    reg('.logo',          'left',  0);
    reg('.nav-links li',  'up',    60,  true, 70);
    reg('.book-btn',      'right', 0);

    // ────────────────────────────────────────────────────────
    //  HERO  (GSAP in main.js drives this; keep CSS class for
    //  smooth fallback when GSAP hasn't fired yet)
    // ────────────────────────────────────────────────────────
    // (Hero handled by GSAP — skipped here to avoid conflict)

    // ────────────────────────────────────────────────────────
    //  ABOUT SECTION
    // ────────────────────────────────────────────────────────
    reg('.about-tag',           'left',   0);
    reg('.about-content h2',    'left',   80);
    reg('.about-content h2 span','left',  140);
    reg('.about-description',   'left',   180, true, 100);
    // Features: 1&2 from left, 3&4 from right
    const af = document.querySelectorAll('.about-feature');
    af.forEach((el, i) => register(el, i < 2 ? 'left' : 'right', 280 + i * 90));
    // Feature icons individually
    document.querySelectorAll('.about-feature i').forEach((el, i) =>
        register(el, 'scale', 320 + i * 90));
    document.querySelectorAll('.about-feature h3').forEach((el, i) =>
        register(el, i < 2 ? 'left' : 'right', 350 + i * 90));
    document.querySelectorAll('.about-feature p').forEach((el, i) =>
        register(el, i < 2 ? 'left' : 'right', 390 + i * 90));

    reg('.about-btn',           'left',   500);
    reg('.about-image',         'right',  60);
    reg('.about-image img',     'right',  120);

    // ────────────────────────────────────────────────────────
    //  SERVICES SECTION
    // ────────────────────────────────────────────────────────
    reg('.section-title span',  'up',     0);
    reg('.section-title h2',    'up',     80);
    // Service cards: alternate left / right
    document.querySelectorAll('.service-card').forEach((el, i) =>
        register(el, i % 2 === 0 ? 'left' : 'right', i * 70));
    // Card internals
    document.querySelectorAll('.service-card .icon').forEach((el, i) =>
        register(el, 'scale', 80 + i * 70));
    document.querySelectorAll('.service-card h3').forEach((el, i) =>
        register(el, i % 2 === 0 ? 'left' : 'right', 120 + i * 70));
    document.querySelectorAll('.service-card p').forEach((el, i) =>
        register(el, i % 2 === 0 ? 'left' : 'right', 160 + i * 70));
    document.querySelectorAll('.service-card .price').forEach((el, i) =>
        register(el, 'up', 200 + i * 70));

    // ────────────────────────────────────────────────────────
    //  GALLERY SECTION
    // ────────────────────────────────────────────────────────
    reg('.gallery-title p',      'left',  0);
    reg('.gallery-title h2',     'up',    80);
    reg('.gallery-title h2 span','right', 120);
    reg('.gallery-subtitle',     'up',    160);
    // Gallery items: odd from left, even from right
    document.querySelectorAll('.gallery-item').forEach((el, i) =>
        register(el, i % 2 === 0 ? 'left' : 'right', i * 80));
    document.querySelectorAll('.gallery-item img').forEach((el, i) =>
        register(el, 'scale', 60 + i * 80));
    document.querySelectorAll('.gallery-overlay h3').forEach((el, i) =>
        register(el, 'up', 80 + i * 80));
    reg('.gallery-button',       'up',    200);
    reg('.gallery-button a',     'up',    260);

    // ────────────────────────────────────────────────────────
    //  CONTACT SECTION
    // ────────────────────────────────────────────────────────
    reg('.contact-title p',      'left',  0);
    reg('.contact-title h2',     'up',    80);
    reg('.contact-title h2 span','right', 130);
    reg('.contact-subtitle',     'up',    170);
    // Contact cards: 1&2 from left, 3&4 from right
    document.querySelectorAll('.contact-card').forEach((el, i) =>
        register(el, i < 2 ? 'left' : 'right', 100 + i * 90));
    document.querySelectorAll('.contact-icon').forEach((el, i) =>
        register(el, 'scale', 140 + i * 90));
    document.querySelectorAll('.contact-card h3').forEach((el, i) =>
        register(el, i < 2 ? 'left' : 'right', 170 + i * 90));
    document.querySelectorAll('.contact-card p').forEach((el, i) =>
        register(el, i < 2 ? 'left' : 'right', 210 + i * 90));
    // Form from RIGHT
    reg('.contact-form',         'right', 80);
    reg('.contact-form h3',      'right', 140);
    reg('.contact-form > p',     'right', 200);
    reg('.form-row',             'right', 240);
    reg('.contact-form select',  'right', 310);
    reg('.contact-form input[type="date"]', 'right', 360);
    reg('.contact-form textarea', 'right', 410);
    reg('.contact-form button',   'up',    470);

    // ────────────────────────────────────────────────────────
    //  DEVELOPER FOOTER
    // ────────────────────────────────────────────────────────
    // LEFT column
    reg('.dev-logo-badge',       'left',  0);
    reg('.dev-name',             'left',  80);
    reg('.dev-role-badge',       'left',  150);
    reg('.dev-intro',            'left',  220);
    reg('.dev-status',           'left',  300);
    document.querySelectorAll('.dev-tech-pill').forEach((el, i) =>
        register(el, 'left', 370 + i * 65));
    // RIGHT column
    reg('.dev-section-heading',  'right', 60);
    reg('.dev-section-heading h4','right',100);
    reg('.dev-red-bar',          'right', 130);
    document.querySelectorAll('.dev-contact-card').forEach((el, i) =>
        register(el, 'right', 170 + i * 100));
    document.querySelectorAll('.dev-icon-wrapper').forEach((el, i) =>
        register(el, 'scale', 210 + i * 100));
    document.querySelectorAll('.dev-label').forEach((el, i) =>
        register(el, 'right', 240 + i * 100));
    document.querySelectorAll('.dev-value').forEach((el, i) =>
        register(el, 'right', 270 + i * 100));
    reg('.dev-social-title',     'right', 360);
    document.querySelectorAll('.dev-social-link').forEach((el, i) =>
        register(el, 'right', 420 + i * 80));
    // Bottom bar — up
    reg('.dev-divider-line',     'up',    500);
    reg('.dev-copyright',        'up',    560);
    reg('.dev-credit',           'up',    620);
    reg('.dev-credit-highlight', 'up',    660);

    // ────────────────────────────────────────────────────────
    //  SINGLE INTERSECTIONOBSERVER for everything
    // ────────────────────────────────────────────────────────
    const allAnimated = document.querySelectorAll(
        '.da-left, .da-right, .da-up, .da-scale'
    );

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el._daDone) return;
            el._daDone = true;
            // The delay is already baked into --da-d CSS variable,
            // so just adding .da-in triggers the delayed transition.
            el.classList.add('da-in');
            io.unobserve(el);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    allAnimated.forEach(el => io.observe(el));

    // Navbar is always visible — force it in immediately after a tick
    // (GSAP handles hero; we handle nav items via this observer too,
    //  but they're already in view, so the observer fires instantly)

})();


/* ══════════════════════════════════════════════════════════════
   SECTION 4 — HERO GSAP ENHANCER
   Piggyback on existing triggerHeroAnim (in main.js)
══════════════════════════════════════════════════════════════ */
(function initHeroEnhancer() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined') return;

    const orig = window.triggerHeroAnim;
    window.triggerHeroAnim = function () {
        if (orig) orig();

        // ✅ FIX: Back button se aane par animation skip — icons seedhe dikhao
        const alreadyShown = (function() {
            try { return sessionStorage.getItem('introShown') === '1'; } catch(e) { return false; }
        })();

        if (alreadyShown) {
            // Directly make visible, no animation
            document.querySelectorAll('.social a').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.filter = 'none';
            });
            const sd = document.querySelector('.scroll-down');
            if (sd) { sd.style.opacity = '1'; sd.style.transform = 'none'; }
            return;
        }

        gsap.from('.social a', {
            x: -40, opacity: 0, filter: 'blur(4px)',
            stagger: 0.12, duration: 0.85, ease: 'power3.out', delay: 1.3
        });
        gsap.from('.scroll-down', {
            opacity: 0, y: 25, duration: 0.9, ease: 'power2.out', delay: 1.7
        });
    };
})();


/* ══════════════════════════════════════════════════════════════
   SECTION 5 — ABOUT IMAGE PARALLAX (GSAP ScrollTrigger)
══════════════════════════════════════════════════════════════ */
(function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const img = document.querySelector('.about-image');
    if (!img) return;
    gsap.to(img, {
        scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        y: -50, ease: 'none'
    });
})();

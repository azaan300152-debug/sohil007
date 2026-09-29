// ===============================
// STICKY NAVBAR
// ===============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.background = "rgba(8,8,8,0.92)";
        navbar.style.backdropFilter = "blur(20px)";
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    } else {

        navbar.style.background = "rgba(0,0,0,.30)";
        navbar.style.backdropFilter = "blur(18px)";
        navbar.style.boxShadow = "none";

    }

});


// ===============================
// HERO ANIMATION
// ===============================

gsap.registerPlugin(ScrollTrigger);

// ===============================
// INTRO VIDEO SCREEN
// ===============================

let heroAnimTriggered = false;

function skipIntro() {
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    if (introVideo) {
        try { introVideo.pause(); } catch(e) {}
    }
    if (introScreen) {
        introScreen.classList.add('hidden');
        setTimeout(() => {
            introScreen.style.display = 'none';
        }, 800);
    }
    // Mark intro as already shown so back button doesn't replay it
    try { sessionStorage.setItem('introShown', '1'); } catch(e) {}
    triggerHeroAnim();
}

window.addEventListener('load', () => {

    const introScreen = document.getElementById('intro-screen');
    const introVideo  = document.getElementById('intro-video');

    // ✅ FIX: Back button press hone par intro dobara na chale
    const alreadyShown = sessionStorage.getItem('introShown') === '1';
    if (alreadyShown) {
        // Intro skip karo, seedha hero dikhao
        if (introScreen) {
            introScreen.style.display = 'none';
        }
        triggerHeroAnim();
        return;
    }

    if (introScreen) {
        // Tap anywhere to skip intro on mobile
        introScreen.addEventListener('click', skipIntro);
    }

    // Safety fallback: if video doesn't end or stalls on mobile, reveal site in 3.5s
    const fallbackTimer = setTimeout(() => {
        skipIntro();
    }, 3500);

    if (introVideo) {
        introVideo.muted = true;
        introVideo.volume = 1;

        const playPromise = introVideo.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setTimeout(() => {
                    introVideo.muted = false;
                }, 300);
            }).catch(() => {
                introVideo.muted = true;
                introVideo.play().catch(() => {
                    skipIntro();
                });
            });
        }

        introVideo.addEventListener('ended', () => {
            clearTimeout(fallbackTimer);
            skipIntro();
        });
    } else {
        skipIntro();
    }

});

function triggerHeroAnim() {

    if (heroAnimTriggered) return;
    heroAnimTriggered = true;

    // Ensure all hero elements are visible
    document.querySelectorAll('.hero-buttons, .hero-buttons a, .hero-left, .hero-right, .hero-image, .hero-image img, .social, .social a, .scroll-down').forEach(el => {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
    });

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.set('.hero-buttons a, .hero-buttons, .hero-left, .hero-right, .hero-image, .hero-image img, .social, .social a, .scroll-down', { clearProps: 'opacity,transform,visibility,filter,x,y' });
        }
    });

    tl.from('header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    })
    .from('.hero-left .welcome', {
        y: 80,
        opacity: 0,
        duration: .8
    })
    .from('.hero-left h1', {
        y: 100,
        opacity: 0,
        duration: 1
    }, '-=0.4')
    .from('.hero-left h3', {
        y: 80,
        opacity: 0,
        duration: .8
    }, '-=0.5')
    .from('.hero-text', {
        opacity: 0,
        y: 50,
        duration: .8
    }, '-=0.4')
    .from('.hero-buttons a', {
        y: 60,
        opacity: 0,
        stagger: .2,
        duration: .7
    }, '-=0.3')
    .from('.hero-image', {
        x: 200,
        opacity: 0,
        scale: .7,
        rotate: 10,
        duration: 1.4,
        ease: 'power4.out'
    }, '-=1');

}



// ===============================
// SMOOTH SCROLL & HOME NAV
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const href = this.getAttribute("href");
        if (!href) return;

        e.preventDefault();

        if (href === "#" || href === "#hero" || href === "#home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        try {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        } catch (err) {
            console.warn("Smooth scroll target not found:", href);
        }

    });

});


// ===============================
// SCROLL INDICATOR
// ===============================

const scrollIndicator = document.querySelector(".scroll-down");

window.addEventListener("scroll", () => {

    if (window.scrollY > 100) {

        scrollIndicator.style.opacity = "0";

    } else {

        scrollIndicator.style.opacity = "1";

    }

});
// =====================================
// MOUSE PARALLAX EFFECT (DESKTOP ONLY)
// =====================================

const heroImage = document.querySelector(".hero-image");

if (heroImage && window.matchMedia("(min-width: 769px)").matches) {
    document.addEventListener("mousemove", (e) => {

        const x = (window.innerWidth / 2 - e.clientX) / 40;
        const y = (window.innerHeight / 2 - e.clientY) / 40;

        heroImage.style.transform = `translate(${x}px, ${y}px)`;

    });
}


// ===============================
// MOBILE NAVIGATION MENU
// ===============================
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenuBtn.classList.toggle("active");
        navLinks.classList.toggle("active");
        document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });

    // Close menu when clicking any link
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenuBtn.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains("active")) {
            mobileMenuBtn.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

// =====================================
// BUTTON HOVER
// =====================================

if (window.matchMedia("(min-width: 769px)").matches) {
    document.querySelectorAll(".btn-primary,.btn-secondary,.btn-red,.btn-black").forEach(btn => {

        btn.addEventListener("mouseenter", () => {
            btn.style.transition = ".35s";
            btn.style.transform = "translateY(-5px) scale(1.03)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translateY(0) scale(1)";
        });

    });
}


// =====================================
// NAV LINK ACTIVE
// =====================================

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {

    link.addEventListener("click", () => {

        links.forEach(item => item.classList.remove("active"));

        link.classList.add("active");

    });

});


// =====================================
// SCROLL REVEAL
// =====================================

const revealItems = document.querySelectorAll(".hero-left,.hero-right");

const reveal = () => {

    revealItems.forEach(item => {

        const top = item.getBoundingClientRect().top;

        if (top < window.innerHeight - 100) {

            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

        }

    });

};

window.addEventListener("scroll", reveal);

reveal();
gsap.from(".service-card",{

    scrollTrigger:{
        trigger:".service-grid",
        start:"top 75%"
    },

    opacity:0,
    y:100,
    rotateX:20,
    stagger:.15,
    duration:1,
    ease:"power4.out"

});
VanillaTilt.init(document.querySelectorAll(".service-card"),{
    max:8,
    speed:400,
    glare:true,
    "max-glare":0.25
});
gsap.from(".section-title",{

    scrollTrigger:{
        trigger:".services",
        start:"top 80%"
    },

    opacity:0,
    y:60,
    duration:1

});
const light=document.querySelector(".mouse-light");

document.addEventListener("mousemove",(e)=>{

gsap.to(light,{

x:e.clientX,

y:e.clientY,

duration:.25,

ease:"power2.out"

});

});

if (window.matchMedia("(min-width: 769px)").matches) {
    document.querySelectorAll(".book-btn,.btn-primary,.btn-secondary,.btn-red,.btn-black").forEach(btn=>{

        btn.addEventListener("mousemove",(e)=>{
            const rect=btn.getBoundingClientRect();
            const x=e.clientX-rect.left-rect.width/2;
            const y=e.clientY-rect.top-rect.height/2;

            gsap.to(btn,{
                x:x*.18,
                y:y*.18,
                duration:.3
            });
        });

        btn.addEventListener("mouseleave",()=>{
            gsap.to(btn,{
                x:0,
                y:0,
                duration:.4
            });
        });

    });
}

gsap.utils.toArray("section").forEach(sec=>{

gsap.from(sec,{

scrollTrigger:{
trigger:sec,
start:"top 80%"
},

opacity:0,

y:120,

duration:1.2,

ease:"power4.out"

});

});
gsap.from(".navbar",{

y:-120,

opacity:0,

duration:1,

ease:"power4.out"

});

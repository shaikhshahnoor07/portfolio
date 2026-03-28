/* =============================================
   SHAHNOOR SHAIKH — PORTFOLIO SCRIPT
   ============================================= */

// Wait for GSAP to be ready
window.addEventListener('load', function () {

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create('expo', '0.16, 1, 0.3, 1');

  /* ===================== CURSOR ===================== */
  var cursor   = document.getElementById('cursor');
  var follower = document.getElementById('cursor-follower');
  var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  var folX = mouseX, folY = mouseY;

  gsap.set(cursor,   { x: mouseX, y: mouseY });
  gsap.set(follower, { x: folX,   y: folY   });

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX; mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.04, overwrite: true });
  });

  (function animFol() {
    folX += (mouseX - folX) * 0.1;
    folY += (mouseY - folY) * 0.1;
    gsap.set(follower, { x: folX, y: folY });
    requestAnimationFrame(animFol);
  })();

  document.querySelectorAll('a, button, .info-card, .contact-card, .skill-category, .nav-hamburger').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      gsap.to(follower, { width: 48, height: 48, duration: 0.25 });
      gsap.to(cursor,   { scale: 0, duration: 0.15 });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(follower, { width: 28, height: 28, duration: 0.25 });
      gsap.to(cursor,   { scale: 1, duration: 0.15 });
    });
  });

  /* ===================== LOADER ===================== */
  var loader      = document.getElementById('loader');
  var loaderPct   = loader.querySelector('.loader-percent');
  var loaderLine  = loader.querySelector('.loader-line');
  var loaderName  = loader.querySelector('.loader-name');

  // Split letters — plain CSS transitions, zero GSAP dependency
  var letters = loaderName.textContent.trim().split('');
  loaderName.innerHTML = letters.map(function (ch) {
    return '<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity 0.45s ease,transform 0.45s ease">' + ch + '</span>';
  }).join('');

  // Animate letters in staggered
  loaderName.querySelectorAll('span').forEach(function (sp, i) {
    setTimeout(function () {
      sp.style.opacity   = '1';
      sp.style.transform = 'translateY(0)';
    }, 80 + i * 55);
  });

  // Percent counter
  var count = 0;
  var ticker = setInterval(function () {
    count = Math.min(count + Math.floor(Math.random() * 9) + 3, 100);
    loaderPct.textContent = count + '%';
    if (count >= 100) clearInterval(ticker);
  }, 32);

  // Progress line — simple CSS transition
  loaderLine.style.transition = 'background 1.8s cubic-bezier(0.16,1,0.3,1)';
  setTimeout(function () {
    loaderLine.style.background = 'linear-gradient(to right, #e8d5a3 100%, rgba(255,255,255,0.07) 100%)';
  }, 60);

  // Step 1 — after 2.3s fade name out
  setTimeout(function () {
    loaderName.style.transition = 'opacity 0.25s ease';
    loaderName.style.opacity    = '0';

    // Step 2 — after name fades, slide loader up
    setTimeout(function () {
      loader.style.transition = 'transform 0.75s cubic-bezier(0.16,1,0.3,1)';
      loader.style.transform  = 'translateY(-100%)';

      // Step 3 — after slide, hide loader and run hero
      setTimeout(function () {
        loader.style.display = 'none';
        ScrollTrigger.refresh();
        runHeroIntro();
      }, 760);

    }, 280);
  }, 2300);

  /* ===================== HERO INTRO ===================== */
  function runHeroIntro() {
    gsap.set('.hero-tag',             { opacity: 0, y: 20 });
    gsap.set('.hero-sub-row',         { opacity: 0, y: 20 });
    gsap.set('.hero-desc',            { opacity: 0, y: 20 });
    gsap.set('.hero-actions',         { opacity: 0, y: 20 });
    gsap.set('#statsCard',            { opacity: 0, y: 30 });
    gsap.set('.hero-scroll-indicator',{ opacity: 0 });
    gsap.set('#nav',                  { opacity: 0, y: -16 });

    var tl = gsap.timeline({ defaults: { ease: 'expo' } });
    tl.to('.hero-title .line',          { y: 0, duration: 1, stagger: 0.12 },            0)
      .to('#nav',                        { opacity: 1, y: 0, duration: 0.7 },             0.05)
      .to('.hero-tag',                   { opacity: 1, y: 0, duration: 0.7 },             0.15)
      .to('.hero-sub-row',               { opacity: 1, y: 0, duration: 0.7 },             0.30)
      .to('.hero-desc',                  { opacity: 1, y: 0, duration: 0.7 },             0.42)
      .to('.hero-actions',               { opacity: 1, y: 0, duration: 0.7 },             0.52)
      .to('#statsCard',                  { opacity: 1, y: 0, duration: 0.8,
                                           onComplete: runStatCounters },                  0.60)
      .to('.hero-scroll-indicator',      { opacity: 1, duration: 0.6 },                   0.85);
  }

  /* ===================== STAT COUNTERS ===================== */
  function runStatCounters() {
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target = parseFloat(el.dataset.target);
      var isDecimal = String(target).includes('.');
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: 'power2.out',
        onUpdate: function () {
          el.textContent = isDecimal ? obj.val.toFixed(2) : Math.round(obj.val);
        }
      });
    });
  }

  /* ===================== NAV SCROLL ===================== */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ===================== SCROLL REVEALS ===================== */
  function reveal(selector, from, opts) {
    opts = opts || {};
    gsap.utils.toArray(selector).forEach(function (el, i) {
      gsap.from(el, Object.assign({}, from, {
        duration: opts.duration || 0.85,
        ease: 'expo',
        delay: opts.stagger ? i * opts.stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: opts.start || 'top 88%',
          toggleActions: 'play none none none',
          once: true
        }
      }));
    });
  }

  setTimeout(function () {
    reveal('.section-label',  { opacity: 0, y: 20 });
    reveal('.about-left',     { opacity: 0, y: 50 },  { duration: 1 });
    reveal('.about-right',    { opacity: 0, x: 50 },  { duration: 1 });
    reveal('.info-card',      { opacity: 0, x: 30 },  { stagger: 0.07 });
    reveal('.timeline-item',  { opacity: 0, x: -40 }, { stagger: 0.1 });
    reveal('.tl-title',       { opacity: 0, y: 24 },  { stagger: 0.05 });
    reveal('.tl-skills',      { opacity: 0, y: 12 },  { stagger: 0.05 });
    reveal('.skill-category', { opacity: 0, y: 32, scale: 0.96 }, { stagger: 0.07 });
    reveal('.contact-left',   { opacity: 0, y: 40 },  { duration: 1 });
    reveal('.contact-card',   { opacity: 0, x: 32 },  { stagger: 0.08 });
    reveal('.section-heading',{ opacity: 0, y: 50 },  { duration: 1 });

    gsap.utils.toArray('.skill-pills').forEach(function (pills) {
      gsap.from(pills.querySelectorAll('span'), {
        opacity: 0, y: 10, scale: 0.9, duration: 0.4, stagger: 0.03, ease: 'expo',
        scrollTrigger: { trigger: pills, start: 'top 90%', toggleActions: 'play none none none', once: true }
      });
    });

    gsap.utils.toArray('.tl-dot').forEach(function (dot) {
      ScrollTrigger.create({
        trigger: dot, start: 'top 65%', once: true,
        onEnter: function () {
          gsap.to(dot, { boxShadow: '0 0 18px rgba(232,213,163,0.55)', duration: 0.5 });
        }
      });
    });

    ScrollTrigger.refresh();
  }, 2400);

  /* ===================== PARALLAX ===================== */
  gsap.to('.orb-1', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });
  gsap.to('.orb-2', { yPercent: -15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 3 } });
  gsap.to('.hero-bg-grid', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });

  /* ===================== MARQUEE ===================== */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function () { marqueeTrack.style.animationPlayState = 'paused'; });
    marqueeTrack.addEventListener('mouseleave', function () { marqueeTrack.style.animationPlayState = 'running'; });
  }

  /* ===================== HAMBURGER ===================== */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOpen   = false;

  hamburger.addEventListener('click', function () {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    var spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      gsap.to(spans[0], { rotation: 45,  y:  7, duration: 0.3 });
      gsap.to(spans[1], { rotation: -45, y: -7, duration: 0.3 });
    } else {
      gsap.to(spans, { rotation: 0, y: 0, duration: 0.3 });
    }
  });

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      gsap.to(hamburger.querySelectorAll('span'), { rotation: 0, y: 0, duration: 0.3 });
    });
  });

  /* ===================== SMOOTH SCROLL ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offsetY = nav.offsetHeight + 8;
        var top = target.getBoundingClientRect().top + window.scrollY - offsetY;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===================== CONTACT FORM ===================== */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn        = document.getElementById('submitBtn');
      var successMsg = document.getElementById('formSuccess');
      btn.disabled   = true;
      btn.querySelector('.submit-text').textContent = 'Sending…';
      try {
        var res = await fetch(contactForm.action, {
          method: 'POST', body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          successMsg.classList.add('visible');
          btn.querySelector('.submit-text').textContent = 'Sent!';
          setTimeout(function () {
            successMsg.classList.remove('visible');
            btn.disabled = false;
            btn.querySelector('.submit-text').textContent = 'Send Message';
          }, 5000);
        } else { throw new Error(); }
      } catch (err) {
        btn.disabled = false;
        btn.querySelector('.submit-text').textContent = 'Send Message';
        alert('Something went wrong. Please email: official.shahnoor@gmail.com');
      }
    });
  }

}); // end window.load

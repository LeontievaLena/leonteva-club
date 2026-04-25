/* ============================================
   $IM Investment Club — Main Script
   ============================================ */

(function () {
  'use strict';

  // ---------- Sticky Header ----------
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ---------- Mobile Menu ----------
  const burgerBtn = document.getElementById('burgerBtn');
  const headerNav = document.getElementById('headerNav');
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMobileMenu);
  }

  function openMobileMenu() {
    burgerBtn.classList.add('active');
    headerNav.classList.add('active');
    if (!overlay) createOverlay();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    burgerBtn.classList.remove('active');
    headerNav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', function () {
    if (headerNav.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu on nav link click
  headerNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Scroll Animations (IntersectionObserver) ----------
  const fadeElements = document.querySelectorAll('.fade-in');

  // Initially hide all fade-in elements
  fadeElements.forEach(function (el) {
    el.classList.add('fade-in--hidden');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('fade-in--hidden');
        entry.target.classList.add('fade-in--visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ---------- FAQ Accordion ----------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-item__question');
    btn.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- Review Carousel: drag to scroll ----------
  const carousel = document.querySelector('.review-carousel');
  if (carousel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', function (e) {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', function () {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', function () {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - carousel.offsetLeft;
      var walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.style.cursor = 'grab';
  }

  // ---------- YouTube Lite Player ----------
  const ytPlayer = document.getElementById('yt-player');
  if (ytPlayer) {
    // Check if we're inside an iframe (e.g. Perplexity preview)
    var isEmbedded = window.self !== window.top;

    ytPlayer.addEventListener('click', function () {
      var videoId = ytPlayer.getAttribute('data-id');

      if (isEmbedded) {
        // Inside iframe — open YouTube in new tab
        window.open('https://www.youtube.com/watch?v=' + videoId, '_blank');
        return;
      }

      // Direct site — embed the player
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + videoId
        + '?autoplay=1&rel=0&modestbranding=1';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';

      ytPlayer.classList.add('playing');
      ytPlayer.innerHTML = '';
      ytPlayer.appendChild(iframe);
    });
  }

})();

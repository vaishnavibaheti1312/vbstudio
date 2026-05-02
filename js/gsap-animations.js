/* ============================================================
   VB Studio — GSAP Text Reveals
   js/gsap-animations.js
   Requires: GSAP 3.x + ScrollTrigger loaded before this script
   ============================================================ */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Utility: split element text into per-character <span>s ── */
  function splitChars(el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = Array.from(text).map(function (ch) {
      return ch === ' '
        ? '<span aria-hidden="true" style="display:inline-block">&nbsp;</span>'
        : '<span aria-hidden="true" style="display:inline-block">' + ch + '</span>';
    }).join('');
    return el.querySelectorAll('span');
  }

  /* ── Ensure any [data-reveal] ancestor is already visible ── */
  function ensureParentRevealed(el) {
    var parent = el.closest('[data-reveal]');
    if (parent && !parent.classList.contains('hp-revealed')) {
      parent.classList.add('hp-revealed');
      parent.querySelectorAll('[data-reveal-child]').forEach(function (c) {
        c.classList.add('hp-revealed');
      });
    }
  }

  /* ── 1. Script headings — character stagger ── */
  document.querySelectorAll(
    '.hp-section-title--script, .hp-process__heading, .hp-instagram__heading'
  ).forEach(function (el) {
    var chars = splitChars(el);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        ensureParentRevealed(el);
        gsap.from(chars, {
          opacity: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.028,
          ease: 'power3.out',
          delay: 0.12,
          clearProps: 'all',
        });
      },
    });
  });

  /* ── 2. Process subtitle tag — letter-spacing unfurl ── */
  var subtitle = document.querySelector('.hp-process__subtitle');
  if (subtitle) {
    ScrollTrigger.create({
      trigger: subtitle,
      start: 'top 82%',
      once: true,
      onEnter: function () {
        ensureParentRevealed(subtitle);
        gsap.from(subtitle, {
          opacity: 0,
          letterSpacing: '0.42em',
          duration: 1.1,
          ease: 'power2.out',
          delay: 0.22,
          clearProps: 'all',
        });
      },
    });
  }

  /* ── 3. Services section heading — fade + letter-space ── */
  var servicesH = document.querySelector('.hp-services__heading');
  if (servicesH) {
    ScrollTrigger.create({
      trigger: servicesH,
      start: 'top 78%',
      once: true,
      onEnter: function () {
        gsap.from(servicesH, {
          opacity: 0,
          y: 28,
          letterSpacing: '0.28em',
          duration: 1,
          ease: 'power3.out',
          clearProps: 'all',
        });
      },
    });
  }

  /* ── 4. CTA heading — word-by-word stagger ── */
  var ctaH = document.querySelector('.hp-cta__heading');
  if (ctaH) {
    var words = ctaH.textContent.trim().split(/\s+/);
    ctaH.setAttribute('aria-label', ctaH.textContent);
    ctaH.innerHTML = words.map(function (w) {
      return '<span aria-hidden="true" style="display:inline-block;margin-right:0.22em">' + w + '</span>';
    }).join(' ');
    var wordEls = ctaH.querySelectorAll('span');
    ScrollTrigger.create({
      trigger: ctaH,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        gsap.from(wordEls, {
          opacity: 0,
          y: 22,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'all',
        });
      },
    });
  }

})();

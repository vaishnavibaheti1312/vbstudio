/* ============================================================
   VB Studio — shared.js
   Loads header/footer partials and runs interactions common
   to every page (mobile menu, scroll shadow, scroll-reveal,
   smooth scroll, copyright year).
   Page-specific code (hero stagger, carousel, parallax, etc.)
   stays in each page's own inline <script>.
   ============================================================ */
(function () {
  'use strict';

  /* ── Utility: fetch a partial and swap a placeholder div ── */
  function loadPartial(placeholderId, url, onDone) {
    var placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html.trim();
        var node = tmp.firstElementChild;
        if (node) {
          placeholder.replaceWith(node);
          if (onDone) onDone(node);
        }
      })
      .catch(function (err) {
        console.warn('[VBStudio] Could not load partial:', url, err);
      });
  }

  /* ── Scroll-reveal IntersectionObserver (shared instance) ── */
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('hp-revealed');
        entry.target.querySelectorAll('[data-reveal-child]').forEach(function (child, i) {
          setTimeout(function () { child.classList.add('hp-revealed'); }, 200 + i * 250);
        });
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  function observeRevealEls(root) {
    (root || document).querySelectorAll('[data-reveal]').forEach(function (el) {
      sectionObserver.observe(el);
    });
  }

  /* ── DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {

    /* Page load fade-in */
    document.body.classList.add('hp-loaded');

    /* Observe reveal elements already in the static DOM */
    observeRevealEls(document);

    /* Smooth scroll for in-page anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ── Load header partial ── */
    var currentPage = document.body.getAttribute('data-page') || '';

    loadPartial('header-placeholder', 'partials/header.html', function (headerEl) {

      /* Mark the active nav link for this page */
      headerEl.querySelectorAll('.hp-header__nav-link[data-nav-page]').forEach(function (link) {
        if (link.getAttribute('data-nav-page') === currentPage) {
          link.classList.add('hp-header__nav-link--active');
        }
      });

      /* Mobile menu toggle */
      var burger = document.getElementById('hp-burger');
      var menu   = document.getElementById('hp-mobile-menu');
      if (burger && menu) {
        burger.addEventListener('click', function () {
          burger.classList.toggle('active');
          menu.classList.toggle('active');
          document.body.classList.toggle('hp-menu-open');
        });
        menu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            burger.classList.remove('active');
            menu.classList.remove('active');
            document.body.classList.remove('hp-menu-open');
          });
        });
      }

      /* Header scroll shadow */
      window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        headerEl.classList.toggle('hp-header--scrolled', scrollY > 60);
      }, { passive: true });

    }); /* end header callback */

    /* ── Load footer partial ── */
    loadPartial('footer-placeholder', 'partials/footer.html', function (footerEl) {

      /* Dynamic copyright year */
      var yearEl = footerEl.querySelector('#footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

      /* The footer contains [data-reveal]; observe it now that it's in the DOM */
      observeRevealEls(footerEl);

    }); /* end footer callback */

  }); /* end DOMContentLoaded */

})();

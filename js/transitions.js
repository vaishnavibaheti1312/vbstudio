/* ============================================================
   VB Studio — Page Transitions  (js/transitions.js)
   Dark curtain wipes across → VB logo punctuates briefly →
   curtain sweeps away to reveal the new page.
   ============================================================ */
(function () {
  'use strict';

  /* ── Inject styles ── */
  var style = document.createElement('style');
  style.textContent = '\
#pg-curtain {\
  position: fixed; inset: 0; z-index: 9999;\
  background: #3D2B1F;\
  display: flex; align-items: center; justify-content: center;\
  transform: translateX(-100%);\
  pointer-events: none;\
  will-change: transform;\
}\
#pg-curtain.pg-c--covered { transform: translateX(0); transition: none; }\
#pg-curtain.pg-c--entering { animation: pg-slide-in 0.55s cubic-bezier(0.77,0,0.18,1) both; }\
#pg-curtain.pg-c--leaving  { animation: pg-slide-out 0.62s cubic-bezier(0.77,0,0.18,1) both; }\
#pg-curtain__logo {\
  width: 120px; max-width: 28vw;\
  opacity: 0;\
  transition: opacity 0.32s ease;\
}\
#pg-curtain.pg-c--logo #pg-curtain__logo { opacity: 1; }\
@keyframes pg-slide-in  { from { transform: translateX(-100%); } to { transform: translateX(0); } }\
@keyframes pg-slide-out { from { transform: translateX(0); }     to { transform: translateX(100%); } }';
  document.head.appendChild(style);

  /* ── Create overlay element ── */
  var curtain = document.createElement('div');
  curtain.id = 'pg-curtain';

  var logoImg = document.createElement('img');
  logoImg.id  = 'pg-curtain__logo';
  logoImg.src = 'img/assets/media/homePage/vb-logo-footer.png';
  logoImg.alt = 'VB Studio';
  curtain.appendChild(logoImg);

  document.body.appendChild(curtain);

  /* ── Timing ── */
  var SLIDE_IN_MS = 550;   // curtain slides in
  var LOGO_HOLD   = 380;   // logo visible duration before navigate
  var SLIDE_OUT_DELAY = 180; // ms after arrive before curtain slides out

  /* ══ PAGE ENTER: arrive on new page ══
     sessionStorage flag signals we arrived via a transition.
     Start with curtain fully covering screen + logo showing,
     then animate both away.                                    */
  if (sessionStorage.getItem('vb-tr')) {
    sessionStorage.removeItem('vb-tr');

    // Instantly position curtain covering screen with logo visible
    curtain.classList.add('pg-c--covered', 'pg-c--logo');

    // Fade logo out first, then sweep curtain off to the right
    setTimeout(function () {
      curtain.classList.remove('pg-c--logo');
    }, SLIDE_OUT_DELAY);

    setTimeout(function () {
      curtain.classList.remove('pg-c--covered');
      curtain.classList.add('pg-c--leaving');
    }, SLIDE_OUT_DELAY + 150);
  }

  /* ══ BFCACHE RESTORE: browser back/forward button ══
     When a page is restored from bfcache the IIFE doesn't re-run,
     so the curtain may still have 'pg-c--covered' left over from
     the exit animation. Reset it immediately so the page is visible. */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      sessionStorage.removeItem('vb-tr');
      curtain.classList.remove('pg-c--covered', 'pg-c--entering', 'pg-c--logo');
      // Force reflow then sweep curtain away
      void curtain.offsetWidth;
      curtain.classList.add('pg-c--leaving');
    }
  });

  /* ══ PAGE EXIT: intercept internal link clicks ══ */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;

    var href = anchor.getAttribute('href');
    if (
      !href ||
      href === '#' ||
      href === '' ||
      anchor.target === '_blank' ||
      /^(mailto:|tel:|https?:|\/\/)/.test(href)
    ) return;

    e.preventDefault();

    // Tell the next page it's arriving via transition
    sessionStorage.setItem('vb-tr', '1');

    // Reset any lingering classes and trigger entry animation
    curtain.classList.remove('pg-c--covered', 'pg-c--leaving', 'pg-c--logo');
    // Force reflow so removing and re-adding the class triggers the animation
    void curtain.offsetWidth;
    curtain.classList.add('pg-c--entering');

    // Show logo once curtain fully covers the screen
    setTimeout(function () {
      curtain.classList.add('pg-c--logo');
    }, SLIDE_IN_MS - 80);

    // Navigate
    setTimeout(function () {
      window.location.href = href;
    }, SLIDE_IN_MS + LOGO_HOLD);
  });
})();

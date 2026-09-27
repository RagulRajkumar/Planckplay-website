/**
 * BackToTop — frosted-glass round button, bottom-right. Appears after the first
 * screen of scrolling; its ring fills with scroll progress. Click / Enter /
 * Space scrolls smoothly to the top and moves focus to the page.
 */
(() => {
  'use strict';
  const { html, defineBehavior, motionEnabled } = PP;
  const R = 22, C = 2 * Math.PI * R;

  const BackToTop = () => html`
    <button type="button" class="to-top" aria-label="Back to top" data-behavior="to-top">
      <svg class="to-top__ring" viewBox="0 0 52 52" aria-hidden="true">
        <defs><linearGradient id="to-top-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF3B2E"/><stop offset="1" stop-color="#FB6002"/></linearGradient></defs>
        <circle class="to-top__track" cx="26" cy="26" r="${R}"/>
        <circle class="to-top__progress" cx="26" cy="26" r="${R}" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${C.toFixed(2)}"/>
      </svg>
      <svg class="to-top__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;

  defineBehavior('to-top', (btn) => {
    const ring = btn.querySelector('.to-top__progress');
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY, p = max > 0 ? Math.min(1, y / max) : 0;
      ring.setAttribute('stroke-dashoffset', (C * (1 - p)).toFixed(2));
      const show = y > window.innerHeight * 0.8;
      btn.classList.toggle('is-visible', show);
      btn.tabIndex = show ? 0 : -1;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onClick = () => {
      window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'auto' });
      const main = document.getElementById('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    btn.addEventListener('click', onClick);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); btn.removeEventListener('click', onClick); cancelAnimationFrame(raf); };
  });

  Object.assign(PP, { BackToTop });
})();

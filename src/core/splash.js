/**
 * Splash — brand loader shown while the site boots.
 * The markup lives in index.html (so it paints instantly); this file drives it
 * and removes it. config.splash: 'session' (once per tab session) | 'always' | 'off'.
 *
 * Progress is real: it eases toward 90% while the page loads, and reaches 100%
 * once the window's load event and the web fonts are done. It then holds a
 * moment and lifts away. Minimum ~1.2 s so it never flashes; hard cap 4 s so a
 * slow asset never blocks the site. Click / tap / any key skips.
 */
(() => {
  'use strict';
  const KEY = 'pp-splash-seen';
  const MIN_MS = 1200, MAX_MS = 4000, HOLD_MS = 280;
  const C = 2 * Math.PI * 56;                     // ring circumference (r = 56)
  function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function mark() { try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage blocked */ } }

  function run() {
    const el = document.getElementById('splash');
    if (!el) return Promise.resolve();
    const mode = PP.config.splash;
    const skip = mode === 'off' || (mode === 'session' && seen()) || PP.isStaticMode();
    if (skip) { el.remove(); document.documentElement.classList.remove('splash-active'); return Promise.resolve(); }
    mark();

    const reduced = PP.prefersReducedMotion();
    const ring = el.querySelector('.splash__ring-fill');
    const pct = el.querySelector('[data-splash-pct]');
    const t0 = performance.now();
    let loaded = document.readyState === 'complete', fonts = !(document.fonts && document.fonts.ready);
    if (!loaded) window.addEventListener('load', () => { loaded = true; }, { once: true });
    if (!fonts) document.fonts.ready.then(() => { fonts = true; }, () => { fonts = true; });

    return new Promise((resolve) => {
      let done = false, shown = 0, raf = 0, completeAt = 0;
      const paint = (p) => {
        ring.style.strokeDashoffset = String(C * (1 - p));
        pct.textContent = String(Math.round(p * 100));
      };
      const finish = () => {
        if (done) return; done = true;
        cancelAnimationFrame(raf);
        paint(1);
        el.classList.add('is-out');
        document.documentElement.classList.remove('splash-active');
        window.removeEventListener('keydown', finish);
        resolve();
        setTimeout(() => el.remove(), reduced ? 320 : 900);
      };
      const tick = (now) => {
        const t = now - t0;
        const ready = (loaded && fonts) || t > MAX_MS;
        // Before ready: approach 90% with an ease-out over ~1.6 s. After: run to 100%.
        const target = ready ? 1 : 0.9 * (1 - Math.pow(1 - Math.min(1, t / 1600), 3));
        // Ease toward the target, but never faster than ~0.8 s for a full sweep.
        shown += Math.min((target - shown) * (ready ? 0.18 : 0.12), 0.022);
        if (target - shown < 0.002) shown = target;
        paint(shown);
        if (shown >= 1 && t >= MIN_MS) {
          if (!completeAt) { completeAt = now; el.classList.add('is-done'); }
          if (now - completeAt >= HOLD_MS) { finish(); return; }
        }
        raf = requestAnimationFrame(tick);
      };
      el.classList.add(reduced ? 'is-reduced' : 'is-playing');
      el.addEventListener('click', finish);
      window.addEventListener('keydown', finish);
      raf = requestAnimationFrame(tick);
    });
  }
  PP.splash = { run };
})();

/**
 * FX — the site-wide motion engine. Everything is opt-in with data attributes,
 * so components stay markup-only:
 *
 *   data-reveal[="up|fade|scale|left|right|blur|mask"]
 *                          fade/slide in once when scrolled into view
 *   data-stagger           on a parent: children reveal one after another
 *   data-parallax="0.2"    drift at a different speed than the scroll
 *                          (never combine with data-reveal on the same element)
 *   data-progress[="pin|view"]
 *                          exposes scroll progress as the CSS variable --p (0→1).
 *                          "pin"  = through a tall section with a sticky child
 *                          "view" = from entering the bottom to leaving the top
 *                          "exit" = 0 at page top → 1 once the element has scrolled away (heroes)
 *   data-steps="4"         with data-progress: also sets data-step="0…3"
 *   data-words             splits text into words that light up with --p of the
 *                          nearest data-progress ancestor (Apple-style statement)
 *   data-count="72"        counts up from 0 when revealed
 *   data-magnetic          button leans toward the pointer
 *   data-spotlight         sets --mx/--my for a pointer-following glow
 *   data-tilt              3D tilt toward the pointer
 *
 * Progress and parallax values are eased toward their target each frame,
 * which gives the scroll-linked motion its smooth, weighted feel.
 */
(() => {
  'use strict';
  const { motionEnabled, clamp } = PP;
  document.documentElement.classList.toggle('fx-on', motionEnabled());

  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="fx-word" aria-hidden="true">${PP.escapeHTML(w)}</span>`).join(' ');
  }

  function countUp(el) {
    const target = Number(el.dataset.count) || 0, t0 = performance.now(), dur = 1600;
    const step = (now) => {
      const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * e));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  function mount(root) {
    const on = motionEnabled();
    const offs = [];
    const listen = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); };

    // Words: split even without motion (harmless), light them all when static.
    root.querySelectorAll('[data-words]').forEach(splitWords);

    if (!on) {
      root.querySelectorAll('[data-progress]').forEach((el) => {
        el.style.setProperty('--p', '1');
        if (el.dataset.steps) el.dataset.step = String(Number(el.dataset.steps) - 1);
      });
      root.querySelectorAll('.fx-word').forEach((w) => { w.style.opacity = '1'; });
      return () => {};
    }

    /* ---- Reveal (IntersectionObserver) ---- */
    root.querySelectorAll('[data-stagger]').forEach((parent) => {
      const kind = parent.dataset.stagger || 'up';
      Array.from(parent.children).forEach((child, i) => {
        if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', kind);
        child.style.setProperty('--i', String(i));
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        if (en.target.hasAttribute('data-count')) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    root.querySelectorAll('[data-count]').forEach((el) => { if (!el.closest('[data-reveal]')) io.observe(el); });
    offs.push(() => io.disconnect());

    /* ---- Scroll-linked: progress, parallax, words ---- */
    const progress = Array.from(root.querySelectorAll('[data-progress]')).map((el) => ({ el, cur: 0, tgt: 0, step: -1 }));
    const parallax = Array.from(root.querySelectorAll('[data-parallax]')).map((el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0.15, cur: 0, tgt: 0 }));
    const words = Array.from(root.querySelectorAll('[data-words]')).map((el) => ({
      el, spans: Array.from(el.querySelectorAll('.fx-word')), host: el.closest('[data-progress]'), last: -1,
    }));
    const hostState = new Map(progress.map((p) => [p.el, p]));

    let raf = 0;
    const measure = () => {
      const vh = window.innerHeight;
      progress.forEach((p) => {
        const r = p.el.getBoundingClientRect();
        const mode = p.el.dataset.progress;
        p.tgt = mode === 'view' ? clamp((vh - r.top) / (vh + r.height))
          : mode === 'exit' ? clamp(-r.top / Math.max(1, r.height))
          : clamp(-r.top / Math.max(1, r.height - vh));
      });
      parallax.forEach((p) => {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        p.tgt = (r.top + r.height / 2 - vh / 2) * -p.speed;
      });
    };
    const frame = () => {
      raf = 0;
      let moving = false;
      progress.forEach((p) => {
        const d = p.tgt - p.cur;
        p.cur = Math.abs(d) < 0.0005 ? p.tgt : p.cur + d * 0.2;
        if (p.cur !== p.tgt) moving = true;
        p.el.style.setProperty('--p', p.cur.toFixed(4));
        if (p.el.dataset.steps) {
          const n = Number(p.el.dataset.steps), s = Math.min(n - 1, Math.floor(p.cur * n));
          if (s !== p.step) { p.step = s; p.el.dataset.step = String(s); }
        }
      });
      parallax.forEach((p) => {
        const d = p.tgt - p.cur;
        p.cur = Math.abs(d) < 0.1 ? p.tgt : p.cur + d * 0.16;
        if (p.cur !== p.tgt) moving = true;
        p.el.style.transform = `translate3d(0, ${p.cur.toFixed(1)}px, 0)`;
      });
      words.forEach((w) => {
        const hs = w.host && hostState.get(w.host);
        const pr = hs ? hs.cur : 1;
        const n = w.spans.length, lit = clamp((pr - 0.08) / 0.7) * n;
        const key = Math.round(lit * 20);
        if (key === w.last) return;
        w.last = key;
        w.spans.forEach((s, i) => { s.style.opacity = String(0.16 + 0.84 * clamp(lit - i)); });
      });
      if (moving) raf = requestAnimationFrame(frame);
    };
    const schedule = () => { measure(); if (!raf) raf = requestAnimationFrame(frame); };
    listen(window, 'scroll', schedule, { passive: true });
    listen(window, 'resize', schedule);
    schedule();
    // Snap to the true position on first paint (no easing from 0 on load).
    progress.forEach((p) => { p.cur = p.tgt; });
    parallax.forEach((p) => { p.cur = p.tgt; });
    offs.push(() => cancelAnimationFrame(raf));

    /* ---- Pointer interactions (fine pointers only) ---- */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      root.querySelectorAll('[data-magnetic]').forEach((el) => {
        listen(el, 'pointermove', (e) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px)`;
        });
        listen(el, 'pointerleave', () => { el.style.transform = ''; });
      });
      root.querySelectorAll('[data-spotlight]').forEach((el) => {
        listen(el, 'pointermove', (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
          el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
        });
      });
      root.querySelectorAll('[data-tilt]').forEach((el) => {
        listen(el, 'pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
        });
        listen(el, 'pointerleave', () => { el.style.transform = ''; });
      });
    }

    return () => offs.forEach((off) => off());
  }

  PP.fx = { mount };
})();

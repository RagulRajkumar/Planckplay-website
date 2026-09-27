/**
 * Highlights — "Get the highlights." horizontal gallery (Apple product-page style).
 * Snap-scrolling cards, dot pagination, autoplay with play/pause, arrow keys.
 * Autoplay pauses on hover/focus/touch and when the gallery is off-screen.
 * @param {{ items: {title, caption, icon, tone, href, image?}[] }} props
 */
(() => {
  'use strict';
  const { html, icon, defineBehavior, motionEnabled, ArtPanel } = PP;

  function Highlights({ items, title = 'Get the highlights.' }) {
    return html`
      <section id="highlights" class="hl theme-black" data-behavior="highlights">
        <div class="container hl__head">
          <h2 class="headline" data-reveal>${title}</h2>
          <a class="link-arrow" href="${PP.href('solutions')}" data-reveal="fade">All solutions ${icon('chevronRight', { size: 18 })}</a>
        </div>
        <div class="hl__track" data-track tabindex="0" role="region" aria-roledescription="carousel" aria-label="Highlights">
          ${items.map((it, i) => html`
            <a class="hl__card" href="${it.href}" data-slide aria-label="${i + 1} of ${items.length}: ${it.title}">
              <div class="hl__media">${ArtPanel({ iconName: it.icon, tone: it.tone, image: it.image })}</div>
              <div class="hl__text">
                <h3>${it.title}</h3>
                <p>${it.caption}</p>
              </div>
              <span class="hl__plus" aria-hidden="true">${icon('arrowUpRight', { size: 18 })}</span>
            </a>`)}
        </div>
        <div class="hl__controls">
          <div class="hl__dots" role="tablist">
            ${items.map((it, i) => html`<button type="button" class="hl__dot" role="tab" aria-label="Go to ${it.title}" data-dot="${i}"><i></i></button>`)}
          </div>
          <button type="button" class="hl__play" aria-label="Pause" data-play>
            <svg class="hl__icon-pause" viewBox="0 0 24 24" width="16" height="16"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>
            <svg class="hl__icon-play" viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          </button>
        </div>
      </section>`;
  }

  defineBehavior('highlights', (root) => {
    const track = root.querySelector('[data-track]');
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-dot]'));
    const play = root.querySelector('[data-play]');
    const DWELL = 5000;
    let index = 0, playing = motionEnabled(), hovered = false, visible = false, timer = 0, raf = 0;

    const setActive = (i) => {
      index = i;
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', String(k === i)); });
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    };
    const goTo = (i) => {
      const s = slides[(i + slides.length) % slides.length];
      track.scrollTo({ left: s.offsetLeft - slides[0].offsetLeft, behavior: motionEnabled() ? 'smooth' : 'auto' });
    };
    const arm = () => {
      clearTimeout(timer);
      root.classList.toggle('is-playing', playing && !hovered && visible);
      if (playing && !hovered && visible) timer = setTimeout(() => goTo(index + 1 >= slides.length ? 0 : index + 1), DWELL);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = track.scrollLeft + slides[0].offsetLeft;
        let best = 0, bestD = Infinity;
        slides.forEach((s, k) => { const d = Math.abs(s.offsetLeft - x); if (d < bestD) { bestD = d; best = k; } });
        if (best !== index) { setActive(best); arm(); }
      });
    };
    const setPlaying = (p) => {
      playing = p; root.classList.toggle('is-paused', !p);
      play.setAttribute('aria-label', p ? 'Pause' : 'Play'); arm();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; arm(); }, { threshold: 0.35 });
    io.observe(root);

    const handlers = [
      [track, 'scroll', onScroll, { passive: true }],
      [track, 'pointerenter', () => { hovered = true; arm(); }],
      [track, 'pointerleave', () => { hovered = false; arm(); }],
      [track, 'focusin', () => { hovered = true; arm(); }],
      [track, 'focusout', () => { hovered = false; arm(); }],
      [track, 'keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); } }],
      [play, 'click', () => setPlaying(!playing)],
    ];
    dots.forEach((d, k) => handlers.push([d, 'click', () => goTo(k)]));
    handlers.forEach(([el, ev, fn, o]) => el.addEventListener(ev, fn, o));
    setActive(0); setPlaying(playing);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); io.disconnect(); handlers.forEach(([el, ev, fn, o]) => el.removeEventListener(ev, fn, o)); };
  });

  Object.assign(PP, { Highlights });
})();

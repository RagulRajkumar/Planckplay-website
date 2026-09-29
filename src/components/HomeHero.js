/**
 * HomeHero — "Engineering What's Next." (reference image 2).
 *   • canvas of circuit traces; the cursor lights up
 *     traces near it
 *   • the 3D Planck mark: tilts to the pointer, drag to spin, click / Enter
 *     sends a pulse wave through the circuit
 *   • capability chips orbit the mark
 *   • on scroll the copy lifts and fades, the mark scales up (CSS, via --p)
 */
(() => {
  'use strict';
  const { html, defineBehavior, motionEnabled, prefersReducedMotion, clamp, EASE_EXPO } = PP;
  const C = PP.homeContent;

  function HomeHero() {
    const { hero, orbit } = C;
    const wide = window.innerWidth >= 960, rx0 = wide ? 44 : 40;
    return html`
      <section id="top" class="hhero" data-behavior="home-hero" data-progress="exit">
        <canvas class="hhero__canvas" aria-hidden="true" data-canvas></canvas>
        <div class="hhero__floor" aria-hidden="true"></div>
        <div class="container hhero__grid">
          <div class="hhero__copy">
            ${hero.eyebrow ? html`<p class="hhero__eyebrow" data-rise><span class="hhero__led" aria-hidden="true"></span>${hero.eyebrow}</p>` : ''}
            <h1 class="hhero__title">
              <span data-rise>${hero.line1}</span>
              <span data-rise class="gradient-text">${hero.line2.replace(/\.$/, '')}<span class="hhero__dot">.</span></span>
            </h1>
            <p class="hhero__lede" data-rise>${hero.lede}</p>
            <div class="btn-row" data-rise>
              <a href="#highlights" class="btn btn-primary btn-pill btn-lg" data-magnetic>Explore solutions</a>
              <a href="${PP.href('contact')}" class="btn btn-secondary btn-pill btn-lg" data-magnetic>Talk to us</a>
            </div>
          </div>
          <div class="hhero__stage" data-stage>
            <div class="hhero__glow" aria-hidden="true" data-glow></div>
            <div class="hhero__ring" aria-hidden="true"></div>
            <svg class="hhero__link" aria-hidden="true"><line data-link x1="0" y1="0" x2="0" y2="0" stroke="#FB6002" stroke-width="1" stroke-dasharray="3 4"/></svg>
            <div class="hhero__waves" aria-hidden="true" data-waves></div>
            <div class="hhero__core" role="button" tabindex="0" aria-label="Planck Play mark. Drag to spin, press Enter to send a pulse through the circuit." data-core>
              <div class="hhero__mark" data-mark><img src="assets/images/brand/pp-mark.png" alt="" draggable="false"></div>
            </div>
            ${orbit.map(([long, short, target], i) => {
              const a = (i * Math.PI * 2) / orbit.length;
              return html`<a href="${target}" class="hhero__chip" data-orbit data-long="${long}" data-short="${short}"
                style="left:${(50 + rx0 * Math.cos(a)).toFixed(2)}%; top:${(50 + 13 * Math.sin(a)).toFixed(2)}%"><i aria-hidden="true"></i><b>${wide ? long : short}</b></a>`;
            })}
          </div>
        </div>
      </section>`;
  }

  defineBehavior('home-hero', (hero) => {
    const q = (s) => hero.querySelector(s), qa = (s) => Array.from(hero.querySelectorAll(s));
    const canvas = q('[data-canvas]'), stage = q('[data-stage]'), core = q('[data-core]'), mark = q('[data-mark]');
    const glow = q('[data-glow]'), waves = q('[data-waves]'), link = q('[data-link]'), hint = q('[data-hint]');
    const live = motionEnabled(), reduce = prefersReducedMotion();
    const offs = [];
    const on = (el, ev, fn, opt) => { if (!el) return; el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); };
    const s = { wide: window.innerWidth >= 960, spin: 0, spinVel: 0, orbitA: 0, hov: 0, tiltX: 0, tiltY: 0, pulseAmt: 0,
      mx: null, my: null, hoverChip: null, drag: null, cursorIn: false, cx: -1e4, cy: -1e4, bursts: [] };
    const cv = {};
    let loopId = 0;

    /* ---- circuit canvas ---- */
    function initCanvas() {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.max(1, r.width), H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); cv.dpr = dpr;
      let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const g = 32, dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      const n = Math.max(18, Math.round((W * H) / 20000)), traces = [];
      for (let i = 0; i < n; i++) {
        let x = Math.round((rnd() * W) / g) * g, y = Math.round((rnd() * H) / g) * g, d = Math.floor(rnd() * 4) * 2;
        const pts = [[x, y]], segs = 2 + Math.floor(rnd() * 4);
        for (let k = 0; k < segs; k++) {
          const len = (1 + Math.floor(rnd() * 5)) * g; x += dirs[d][0] * len; y += dirs[d][1] * len; pts.push([x, y]);
          d = (d + (rnd() < 0.5 ? 1 : 7)) % 8;
        }
        let L = 0; const cum = [0];
        for (let j = 1; j < pts.length; j++) { L += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); cum.push(L); }
        traces.push({ pts, cum, L });
      }
      const layer = () => { const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height; return c; };
      const off = layer(), o = off.getContext('2d'); o.scale(dpr, dpr); o.lineWidth = 1; o.lineJoin = 'round';
      traces.forEach((t) => {
        o.strokeStyle = 'rgba(255,255,255,0.08)'; o.beginPath(); t.pts.forEach((p, j) => (j ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1]))); o.stroke();
        const e = t.pts[t.pts.length - 1]; o.strokeStyle = 'rgba(255,255,255,0.16)'; o.beginPath(); o.arc(e[0], e[1], 2.6, 0, Math.PI * 2); o.stroke();
        const st = t.pts[0]; o.fillStyle = 'rgba(255,255,255,0.14)'; o.fillRect(st[0] - 2, st[1] - 2, 4, 4);
      });
      for (let i = 0; i < Math.max(3, Math.round(n / 12)); i++) {
        const cx = Math.round((rnd() * W) / g) * g, cy = Math.round((rnd() * H) / g) * g, w = g * (2 + Math.floor(rnd() * 2));
        o.strokeStyle = 'rgba(255,255,255,0.1)'; o.strokeRect(cx + 0.5, cy + 0.5, w, w);
        o.beginPath(); for (let p = 1; p < 4; p++) { const px = cx + (w * p) / 4; o.moveTo(px, cy); o.lineTo(px, cy - 6); o.moveTo(px, cy + w); o.lineTo(px, cy + w + 6); } o.stroke();
      }
      const br = layer(), bx = br.getContext('2d'); bx.scale(dpr, dpr); bx.lineWidth = 1.25; bx.lineJoin = 'round'; bx.strokeStyle = 'rgba(251,96,2,.8)'; bx.fillStyle = 'rgba(252,204,39,.9)';
      traces.forEach((t) => { bx.beginPath(); t.pts.forEach((p, j) => (j ? bx.lineTo(p[0], p[1]) : bx.moveTo(p[0], p[1]))); bx.stroke(); const e = t.pts[t.pts.length - 1]; bx.beginPath(); bx.arc(e[0], e[1], 2.6, 0, Math.PI * 2); bx.fill(); });
      Object.assign(cv, { traces, staticLayer: off, brightLayer: br, tmpLayer: layer() });
      draw(0);
    }
    function draw(dt) {
      if (!cv.staticLayer) return;
      const x = canvas.getContext('2d'), dpr = cv.dpr;
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, canvas.width, canvas.height); x.drawImage(cv.staticLayer, 0, 0);
      if (!dt) return;
      const reveal = (mk) => {
        const t2 = cv.tmpLayer.getContext('2d');
        t2.setTransform(1, 0, 0, 1, 0, 0); t2.globalCompositeOperation = 'source-over'; t2.clearRect(0, 0, cv.tmpLayer.width, cv.tmpLayer.height);
        t2.drawImage(cv.brightLayer, 0, 0); t2.globalCompositeOperation = 'destination-in'; t2.fillStyle = mk(t2); t2.fillRect(0, 0, cv.tmpLayer.width, cv.tmpLayer.height);
        x.drawImage(cv.tmpLayer, 0, 0);
      };
      if (s.cursorIn) reveal((t2) => { const gr = t2.createRadialGradient(s.cx * dpr, s.cy * dpr, 0, s.cx * dpr, s.cy * dpr, 220 * dpr); gr.addColorStop(0, 'rgba(0,0,0,.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); return gr; });
      if (s.bursts.length) {
        s.bursts.forEach((b) => {
          b.r += 700 * dt; const fade = Math.max(0, 1 - b.r / b.max);
          reveal((t2) => { const gr = t2.createRadialGradient(b.x * dpr, b.y * dpr, Math.max(0, b.r - 110) * dpr, b.x * dpr, b.y * dpr, (b.r + 8) * dpr); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.85, `rgba(0,0,0,${fade.toFixed(3)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); return gr; });
        });
        s.bursts = s.bursts.filter((b) => b.r < b.max);
      }
    }

    /* ---- 3D mark ---- */
    const hideHint = () => { if (hint) hint.style.opacity = '0'; };
    function pulse() {
      s.pulseAmt = 1; hideHint();
      for (let k = 0; k < 2 && waves.animate; k++) {
        const d = document.createElement('div'); d.className = 'hhero__wave'; waves.appendChild(d);
        d.animate([{ transform: 'scale(.7)', opacity: 1 }, { transform: 'scale(3.2)', opacity: 0 }], { duration: 1400, delay: k * 180, easing: EASE_EXPO, fill: 'backwards' }).onfinish = () => d.remove();
      }
      if (!live || !cv.traces) return;
      const hr = hero.getBoundingClientRect(), cr = core.getBoundingClientRect();
      const bx = cr.left + cr.width / 2 - hr.left, by = cr.top + cr.height / 2 - hr.top;
      s.bursts.push({ x: bx, y: by, r: 0, max: Math.hypot(hr.width, hr.height) });
    }
    on(core, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pulse(); } });
    on(core, 'pointerdown', (e) => {
      if (e.button) return;
      s.drag = { last: e.clientX, moved: 0, t: performance.now() }; s.spinVel = 0;
      try { core.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      core.classList.add('is-grabbing');
    });
    on(core, 'pointermove', (e) => {
      const d = s.drag; if (!d) return;
      const now = performance.now(), dx = e.clientX - d.last, dts = Math.max(0.008, (now - d.t) / 1000);
      d.last = e.clientX; d.t = now; d.moved += Math.abs(dx);
      s.spin += dx * 0.6; s.spinVel = clamp((dx * 0.6) / dts, -1400, 1400);
      if (d.moved > 6) hideHint();
    });
    const release = () => { const d = s.drag; if (!d) return; s.drag = null; core.classList.remove('is-grabbing'); if (d.moved < 6) pulse(); };
    on(core, 'pointerup', release);
    on(core, 'pointercancel', () => { s.drag = null; core.classList.remove('is-grabbing'); });
    qa('[data-orbit]').forEach((c, i) => {
      const enter = () => { s.hoverChip = i; }, leave = () => { if (s.hoverChip === i) s.hoverChip = null; };
      on(c, 'mouseenter', enter); on(c, 'focus', enter); on(c, 'mouseleave', leave); on(c, 'blur', leave);
    });

    function tick(dt, now) {
      const t = now / 1000, hr = hero.getBoundingClientRect(), cr = core.getBoundingClientRect(), has = s.mx != null;
      s.cx = has ? s.mx - hr.left : -1e4; s.cy = has ? s.my - hr.top : -1e4;
      s.cursorIn = has && s.cx >= 0 && s.cy >= 0 && s.cx <= hr.width && s.cy <= hr.height;
      const dx = has ? s.mx - (cr.left + cr.width / 2) : 0, dy = has ? s.my - (cr.top + cr.height / 2) : 0;
      const near = s.cursorIn ? Math.max(0, 1 - Math.hypot(dx, dy) / (cr.width * 0.9)) : 0;
      const f = 1 - Math.pow(0.0005, dt);
      s.tiltX += (clamp(dx / 500, -1, 1) - s.tiltX) * f; s.tiltY += (clamp(dy / 500, -1, 1) - s.tiltY) * f; s.hov += (near - s.hov) * f;
      if (!s.drag) {
        s.spin += s.spinVel * dt; s.spinVel *= Math.pow(0.05, dt);
        if (Math.abs(s.spinVel) < 40) s.spin += (Math.round(s.spin / 360) * 360 - s.spin) * (1 - Math.pow(0.05, dt));
      }
      s.pulseAmt *= Math.pow(0.08, dt);
      const h = s.hov, pa = s.pulseAmt;
      const ry = s.spin + Math.sin(t * 0.34) * 10 + s.tiltX * 26, rx = Math.cos(t * 0.27) * 6 - s.tiltY * 22;
      const y = Math.sin(t * 0.6) * 10 + s.tiltY * 18 * h, sc = 1 + h * 0.05 + pa * 0.08;
      mark.style.transform = `translate3d(${(s.tiltX * 18 * h).toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${(Math.sin(t * 0.2) * 3).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      mark.style.filter = `drop-shadow(0 40px 80px rgba(0,0,0,.6)) brightness(${(1 + h * 0.25 + pa * 0.4).toFixed(3)})`;
      glow.style.opacity = String(Math.min(1, 0.7 + h * 0.3 + pa * 0.5));
      glow.style.transform = `scale(${(1 + h * 0.08 + pa * 0.2).toFixed(3)})`;
      const chips = qa('[data-orbit]'), n = chips.length || 1, hc = s.hoverChip == null ? -1 : s.hoverChip;
      s.orbitA += (hc >= 0 ? 0 : 0.16 + Math.min(2.5, Math.abs(s.spinVel) / 250)) * dt;
      const rx0 = s.wide ? 44 : 40, sr = stage.getBoundingClientRect();
      let lx = 0, ly = 0;
      chips.forEach((el, i) => {
        const a = s.orbitA + (i * Math.PI * 2) / n, X = 50 + rx0 * Math.cos(a), Y = 50 + 13 * Math.sin(a), dz = (Math.sin(a) + 1) / 2, act = i === hc;
        el.style.left = X.toFixed(2) + '%'; el.style.top = Y.toFixed(2) + '%';
        el.style.transform = `translate(-50%, -50%) scale(${(act ? 1.12 : 0.8 + 0.2 * dz).toFixed(3)})`;
        el.style.opacity = act ? '1' : (0.4 + 0.6 * dz).toFixed(3);
        el.style.zIndex = act ? '4' : Math.sin(a) > 0 ? '3' : '1';
        if (act) { lx = (X / 100) * sr.width; ly = (Y / 100) * sr.height; }
      });
      if (hc >= 0) { link.setAttribute('x1', sr.width / 2); link.setAttribute('y1', sr.height / 2); link.setAttribute('x2', lx); link.setAttribute('y2', ly); link.style.opacity = '1'; }
      else link.style.opacity = '0';
    }

    const onResize = () => {
      const wide = window.innerWidth >= 960;
      if (wide !== s.wide) {
        s.wide = wide;
        qa('[data-orbit]').forEach((c) => { c.querySelector('b').textContent = wide ? c.dataset.long : c.dataset.short; });
        if (hint) hint.textContent = '';
      }
      initCanvas();
    };
    on(window, 'resize', onResize);
    initCanvas();

    if (live) {
      hero.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' });
      qa('[data-rise]').forEach((el, i) => el.animate(
        [{ opacity: 0, transform: 'translateY(48px)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 1400, delay: 150 + i * 120, easing: EASE_EXPO, fill: 'backwards' }));
      stage.animate([{ opacity: 0, transform: 'translateY(80px) scale(.86)', filter: 'blur(20px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 2000, delay: 450, easing: EASE_EXPO, fill: 'backwards' });
      on(window, 'pointermove', (e) => { s.mx = e.clientX; s.my = e.clientY; }, { passive: true });
      let last = performance.now();
      const loop = (now) => {
        loopId = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (hero.getBoundingClientRect().bottom < 0) return;
        draw(dt); tick(dt, now);
      };
      loopId = requestAnimationFrame(loop);
    } else if (!reduce) {
      mark.style.transform = 'none';
    }
    return () => { offs.forEach((f) => f()); cancelAnimationFrame(loopId); };
  });

  Object.assign(PP, { HomeHero });
})();

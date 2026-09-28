/**
 * Pcb3D — the circuit board as a CSS 3D model, driven by scroll (Apple
 * Pro-page style). No WebGL, no libraries: it runs from file://.
 *
 * The board (PP.pcbModel) is split into real layers stacked in 3D:
 *   FR-4 core (a slab with thickness) → copper → solder mask + gold pads →
 *   silkscreen → components (every part is a box with a top and four sides).
 *
 * Scroll progress --p (data-progress="pin" on the host) drives it in CSS:
 *   tilt from top-down into 3D → explode into layers → copper lights up →
 *   parts lift and are named. The parts row picks one chip and lifts it.
 */
(() => {
  'use strict';
  const { html, raw, defineBehavior, motionEnabled } = PP;

  const face = (cls, inner = '') => `<i class="p3-f p3-f--${cls}">${inner}</i>`;

  /** One component body as a box, in board units relative to the board's corner. */
  function solid(s, B) {
    const style = `--x:${s.x - B.x};--y:${s.y - B.y};--w:${s.w};--h:${s.h};--d:${s.d};--r:${s.r || 1.5}`;
    let top = '';
    if (s.kind === 'ic' || s.kind === 'can') {
      top = `<span class="p3-dot"></span><b class="p3-mark">${s.name}</b><span class="p3-sub">${s.sub}</span>`;
    }
    const tag = s.part ? `<span class="p3-tag"><span>${s.name}</span></span>` : '';
    return `<div class="p3-solid p3-solid--${s.kind}${s.main ? ' p3-solid--main' : ''}${s.vert ? ' p3-solid--vert' : ''}"
      style="${style}"${s.part ? ` data-part="${s.part}"` : ''}>
      ${face('top', top)}${face('n')}${face('s', s.kind === 'usb' ? '<span class="p3-usb-slot"></span>' : '')}${face('e')}${face('w')}${tag}
    </div>`;
  }

  /** A flat layer of the board (SVG) with its floating label. */
  const plane = (cls, label, svg, box) => `<div class="p3-layer p3-layer--${cls}">
      ${svg ? `<svg class="pcb" viewBox="${box}" preserveAspectRatio="none" aria-hidden="true">${svg}</svg>` : ''}
      <span class="p3-label"><span>${label}</span></span>
    </div>`;

  function Pcb3D({ parts, steps }) {
    const m = PP.pcbModel(), B = m.B, box = `${B.x} ${B.y} ${B.w} ${B.h}`;
    return html`
      <div class="p3" data-progress="pin" data-steps="${steps.length}" data-behavior="pcb-3d">
        <div class="p3__sticky">
          <div class="p3__halo" aria-hidden="true"></div>
          <div class="p3__stage" aria-hidden="true">
            ${raw(`<svg class="p3-defs" width="0" height="0" focusable="false">${m.defs}</svg>`)}
            <div class="p3-scene" style="--bu:${B.w};--bv:${B.h}">
              <div class="p3-shadow"></div>
              <div class="p3-core">${raw(face('top') + face('n') + face('s') + face('e') + face('w'))}<span class="p3-label"><span>FR-4 core</span></span></div>
              ${raw(plane('copper', 'Copper', m.copper, box))}
              ${raw(plane('mask', 'Solder mask &amp; pads', m.pads, box))}
              ${raw(plane('silk', 'Silkscreen', m.silk, box))}
              <div class="p3-layer p3-layer--parts">
                ${raw(m.solids.map((s) => solid(s, B)).join(''))}
                <span class="p3-label"><span>Components</span></span>
              </div>
            </div>
          </div>

          <div class="container p3__ui">
            <div class="p3__captions" aria-live="polite">
              ${steps.map(([k, t, d], i) => html`
                <div class="p3__cap" data-cap="${i}"><p class="p3__kicker">${k}</p><h3>${t}</h3><p>${d}</p></div>`)}
              ${parts.map((b) => html`
                <div class="p3__cap p3__cap--part" data-cap-part="${b.key}"><p class="p3__kicker">${b.name}</p><h3>${b.title}</h3><p>${b.text}</p></div>`)}
            </div>
            <div class="p3__parts" role="group" aria-label="Show a part on the board">
              ${parts.map((b) => html`<button type="button" data-part-btn="${b.key}" aria-pressed="false">${b.name}</button>`)}
            </div>
            <div class="p3__progress" aria-hidden="true">${steps.map(() => html`<i></i>`)}</div>
          </div>
        </div>
      </div>`;
  }

  /**
   * Parts row: hover / focus previews a chip, click pins it (tap on touch).
   * Pointer over the stage orbits the model a few degrees (fine pointers).
   */
  defineBehavior('pcb-3d', (root) => {
    const btns = Array.from(root.querySelectorAll('[data-part-btn]'));
    const offs = [];
    const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); };
    let pinned = '';
    const show = (key) => {
      if (key) root.dataset.focus = key; else delete root.dataset.focus;
      btns.forEach((b) => b.classList.toggle('is-active', b.dataset.partBtn === key));
    };
    btns.forEach((b) => {
      const key = b.dataset.partBtn;
      on(b, 'mouseenter', () => show(key));
      on(b, 'mouseleave', () => show(pinned));
      on(b, 'focus', () => show(key));
      on(b, 'blur', () => show(pinned));
      on(b, 'click', () => {
        pinned = pinned === key ? '' : key;
        btns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.partBtn === pinned)));
        show(pinned);
      });
    });

    if (motionEnabled() && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const stage = root.querySelector('.p3__sticky');
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const tick = () => {
        cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
        root.style.setProperty('--ox', cx.toFixed(4));
        root.style.setProperty('--oy', cy.toFixed(4));
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
      on(stage, 'pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; kick();
      });
      on(stage, 'pointerleave', () => { tx = 0; ty = 0; kick(); });
      offs.push(() => cancelAnimationFrame(raf));
    }
    return () => offs.forEach((f) => f());
  });

  Object.assign(PP, { Pcb3D });
})();

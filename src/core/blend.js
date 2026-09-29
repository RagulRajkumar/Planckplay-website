/**
 * Section blends — where two neighbouring sections (or the last section and
 * the footer) have different background colours, the edge between them is
 * replaced by one long ease-in-out colour ramp.
 *
 *   • The ramp straddles the edge: the upper section eases half-way to the
 *     next colour in its empty bottom space, the lower section finishes it in
 *     its empty top space. Both halves meet at the same mid tone, so there is
 *     no line to find, and the ramp is twice as long (gentler) as one side.
 *   • Each half sits between its section's background and content: text,
 *     cards and pinned stages stay crisp above it, while background
 *     decoration (glows, canvases: absolutely positioned children) fades.
 *   • Between near-identical darks (hero → black) there is no tone to split:
 *     one long fade inside the upper section dissolves its decoration instead.
 *   • Dark ↔ light halves never reach into content, so no text sits on a
 *     half-way tone.
 *
 * Runs after every page render and reads the real computed colours, so it
 * works for any theme order on any page.
 */
(() => {
  'use strict';
  const { clamp, lerp } = PP;

  const rgb = (c) => (c.match(/[\d.]+/g) || []).map(Number);
  const isClear = (c) => { const v = rgb(c); return !v.length || (v.length > 3 && v[3] === 0); };
  /** WCAG relative luminance, 0 (black) → 1 (white). */
  const luminance = (c) => {
    const [r, g, b] = rgb(c).slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const inFlow = (el) => {
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.position !== 'absolute' && cs.position !== 'fixed' && !el.classList.contains('section-fade');
  };
  /** Empty space at one end of a section: padding (and margin) down the chain of first/last children. */
  function emptySpace(el, side) {
    const pad = side === 'top' ? 'paddingTop' : 'paddingBottom', mar = side === 'top' ? 'marginTop' : 'marginBottom';
    let space = 0, node = el;
    for (let depth = 0; node && depth < 4; depth++) {
      space += parseFloat(getComputedStyle(node)[pad]) || 0;
      const kids = [...node.children].filter(inFlow);
      const edge = side === 'top' ? kids[0] : kids[kids.length - 1];
      if (!edge) break;
      space += parseFloat(getComputedStyle(edge)[mar]) || 0;
      node = edge;
    }
    return space;
  }

  /** Content above the fade, decoration below it. */
  function prepare(el) {
    if (el.classList.contains('has-fade')) return;
    el.classList.add('has-fade');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    [...el.children].forEach((c) => {
      if (!inFlow(c)) return;
      const cs = getComputedStyle(c);
      if (cs.position === 'static') c.style.position = 'relative';
      if (cs.zIndex === 'auto') c.style.zIndex = '1';
    });
  }

  function addFade(el, side, colour, height) {
    const fade = document.createElement('div');
    fade.className = `section-fade section-fade--${side}`;
    fade.setAttribute('aria-hidden', 'true');
    fade.style.setProperty('--fade-to', colour);
    fade.style.height = `${Math.round(height)}px`;
    el.appendChild(fade);
  }

  function blendSections(root) {
    const main = root.querySelector('main');
    if (!main) return;
    const bands = [...main.children, root.querySelector('.footer')].filter(Boolean);
    bands.forEach((el, i) => {
      const next = bands[i + 1];
      if (!next) return;
      const from = getComputedStyle(el).backgroundColor, to = getComputedStyle(next).backgroundColor;
      if (isClear(to) || isClear(from) || from === to) return;

      const contrast = Math.abs(luminance(from) - luminance(to));
      prepare(el);
      // Near-identical darks: one long fade inside the upper section, which
      // mostly serves to dissolve its decoration (glows, circuit lines).
      if (contrast <= 0.25) { addFade(el, 'full', to, 240); return; }
      // Dark ↔ light: half of the ramp on each side of the edge.
      const half = lerp(150, 240, clamp(contrast / 0.8));
      prepare(next);
      addFade(el, 'bottom', to, Math.min(half, Math.max(90, emptySpace(el, 'bottom'))));
      addFade(next, 'top', from, Math.min(half, Math.max(90, emptySpace(next, 'top'))));
    });
  }

  Object.assign(PP, { blendSections });
})();

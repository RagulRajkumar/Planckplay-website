/**
 * ArtPanel — branded generative artwork used where photography is not yet
 * available (highlights, industries). A glowing line icon over layered
 * gradients and a faint engineering grid. Pass `image` to use a real photo.
 * pcbModel — deterministic circuit board (traces, pads, parts) for Pcb3D.
 */
(() => {
  'use strict';
  const { html, raw, icon } = PP;

  function ArtPanel({ iconName, tone = 'red', image = null, alt = '' }) {
    if (image) return html`<img class="art art--photo" src="${image}" alt="${alt}" loading="lazy">`;
    return html`
      <div class="art art--${tone}" aria-hidden="true">
        <div class="art__grid"></div>
        <div class="art__orb"></div>
        <div class="art__icon">${icon(iconName, { size: 120 })}</div>
      </div>`;
  }

  /**
   * pcbModel — a realistic, engineered circuit board, as data for the 3D
   * viewer (Pcb3D). Matte-black solder mask, gold (ENIG) pads, real package
   * outlines: a QFP-56 microcontroller, a QFN power IC with exposed pad, a
   * shielded RF module with a meander PCB antenna, SOIC ADC and flash, a
   * crystal, decoupling caps, USB-C, a debug header, power rails, via
   * stitching, fiducials, test points and silkscreen reference designators.
   *
   * Returned as separate layers in board coordinates (viewBox = B):
   * copper (pour, rails, traces, vias, signal pulses), pads (gold), silk
   * (outlines, refdes, board text), plus `solids`: every component body as a
   * box ({ x, y, w, h, d, kind, … }) so the viewer can build it in 3D.
   * Chip pads and silk carry data-part="mcu|pmic|rf|adc|flash".
   */
  function pcbModel() {
    const W = 1600, H = 900, animate = PP.motionEnabled();
    const B = { x: 60, y: 40, w: 1480, h: 820, r: 26 };               // board outline
    const PITCH = 14, P0 = 18.5;                                      // pin pitch, first pin centre
    const pinC = (start, i) => start + P0 + PITCH * i;

    const mcu = { key: 'mcu', x: 690, y: 330, w: 220, h: 220, pkg: 'qfp', n: 14, len: 12, name: 'MCU', sub: 'ARM Cortex-M', ref: 'U1' };
    const pmic = { key: 'pmic', x: 230, y: 190, w: 150, h: 150, pkg: 'qfn', n: 9, len: 6, name: 'PMIC', sub: 'Power', ref: 'U2' };
    const rf = { key: 'rf', x: 1180, y: 170, w: 210, h: 150, pkg: 'module', n: 9, len: 6, name: 'RF', sub: 'Wi-Fi · BLE', ref: 'U3' };
    const adc = { key: 'adc', x: 230, y: 580, w: 130, h: 170, pkg: 'soic', n: 11, len: 12, name: 'ADC', sub: '24-bit', ref: 'U4' };
    const flash = { key: 'flash', x: 1200, y: 600, w: 124, h: 130, pkg: 'soic', n: 8, len: 12, name: 'FLASH', sub: '128 Mb', ref: 'U5' };

    const copper = [], rails = [], pads = [], solids = [], silk = [], hot = [];
    const byPart = { mcu: { pads: [], silk: [] }, pmic: { pads: [], silk: [] }, rf: { pads: [], silk: [] }, adc: { pads: [], silk: [] }, flash: { pads: [], silk: [] } };

    /* ---- Packages ---- */
    function pkgPads(c) {
      const out = [], t = c.pkg === 'qfn' || c.pkg === 'module' ? 7 : 7, L = c.len;
      const sides = c.pkg === 'soic' ? ['left', 'right'] : c.pkg === 'module' ? ['left', 'top', 'bottom'] : ['left', 'right', 'top', 'bottom'];
      for (let i = 0; i < c.n; i++) {
        const vx = pinC(c.x, i), vy = pinC(c.y, i);
        if (sides.includes('top') && (c.pkg !== 'soic')) out.push(`<rect x="${vx - t / 2}" y="${c.y - L}" width="${t}" height="${L + (c.pkg === 'qfp' ? 0 : 4)}" rx="1.5" class="pcb-pad"/>`);
        if (sides.includes('bottom')) out.push(`<rect x="${vx - t / 2}" y="${c.y + c.h - (c.pkg === 'qfp' ? 0 : 4)}" width="${t}" height="${L + (c.pkg === 'qfp' ? 0 : 4)}" rx="1.5" class="pcb-pad"/>`);
        if (sides.includes('left')) out.push(`<rect x="${c.x - L}" y="${vy - t / 2}" width="${L + (c.pkg === 'qfp' || c.pkg === 'soic' ? 0 : 4)}" height="${t}" rx="1.5" class="pcb-pad"/>`);
        if (sides.includes('right')) out.push(`<rect x="${c.x + c.w - (c.pkg === 'qfp' || c.pkg === 'soic' ? 0 : 4)}" y="${vy - t / 2}" width="${L + (c.pkg === 'qfp' || c.pkg === 'soic' ? 0 : 4)}" height="${t}" rx="1.5" class="pcb-pad"/>`);
      }
      if (c.pkg === 'qfn') out.push(`<rect x="${c.x + 38}" y="${c.y + 38}" width="${c.w - 76}" height="${c.h - 76}" rx="4" class="pcb-pad pcb-pad--thermal"/>`);
      return out.join('');
    }
    function pkgSilk(c, refX, refY, anchor = 'start') {
      const m = c.len + 6;
      const o = c.pkg === 'soic' ? { x: c.x - 4, y: c.y - 8, w: c.w + 8, h: c.h + 16 } : { x: c.x - m, y: c.y - m, w: c.w + 2 * m, h: c.h + 2 * m };
      // Corner brackets rather than a full box, like a real courtyard mark.
      const k = 14, x2 = o.x + o.w, y2 = o.y + o.h;
      return `<path d="M${o.x} ${o.y + k} V${o.y} H${o.x + k} M${x2 - k} ${o.y} H${x2} V${o.y + k} M${x2} ${y2 - k} V${y2} H${x2 - k} M${o.x + k} ${y2} H${o.x} V${y2 - k}" class="pcb-silk-line"/>
        <circle cx="${o.x - 7}" cy="${o.y - 7}" r="3.5" class="pcb-silk-fill"/>
        <text x="${refX}" y="${refY}" text-anchor="${anchor}" class="pcb-ref">${c.ref}</text>`;
    }
    // Body heights (d) are in board units, roughly true to the parts (1 mm ≈ 25).
    const HEIGHT = { qfp: 36, qfn: 22, module: 52, soic: 40 };
    [mcu, pmic, rf, adc, flash].forEach((c) => {
      byPart[c.key].pads.push(pkgPads(c));
      solids.push({ x: c.x, y: c.y, w: c.w, h: c.h, d: HEIGHT[c.pkg], kind: c.pkg === 'module' ? 'can' : 'ic',
        part: c.key, name: c.name, sub: c.sub, main: c === mcu, r: c.pkg === 'qfn' ? 6 : 4 });
    });
    byPart.mcu.silk.push(pkgSilk(mcu, 924, 312, 'end'));
    byPart.pmic.silk.push(pkgSilk(pmic, 222, 374));
    byPart.rf.silk.push(pkgSilk(rf, 1174, 150));
    byPart.adc.silk.push(pkgSilk(adc, 226, 562));
    byPart.flash.silk.push(pkgSilk(flash, 1206, 582));

    /* ---- Buses: 6 traces from each chip to the MCU, 45° dog-legs with even spacing ---- */
    function bus(c, chipPins, mcuPins, left, top) {
      const x1 = left ? c.x + c.w + c.len : c.x - c.len;
      const x2 = left ? mcu.x - mcu.len : mcu.x + mcu.w + mcu.len;
      const dir = left ? 1 : -1, base = Math.abs(x2 - x1);
      chipPins.forEach((pi, k) => {
        const y1 = pinC(c.y, pi), y2 = pinC(mcu.y, mcuPins[k]);
        const dy = y2 - y1, lane = top ? -k * 6 : k * 6;
        const mid = x1 + dir * ((base - Math.abs(dy)) / 2 + lane);
        const d = `M${x1} ${y1} H${mid.toFixed(1)} L${(mid + dir * Math.abs(dy)).toFixed(1)} ${y2} H${x2}`;
        copper.push(`<path d="${d}" class="pcb-trace"/>`);
        if (k === 2) hot.push(d);
      });
    }
    const up = [1, 2, 3, 4, 5, 6], down = [7, 8, 9, 10, 11, 12];
    bus(pmic, [2, 3, 4, 5, 6, 7], up, true, true);
    bus(rf, [2, 3, 4, 5, 6, 7], up, false, true);
    bus(adc, [3, 4, 5, 6, 7, 8], down, true, false);
    bus(flash, [1, 2, 3, 4, 5, 6], down, false, false);

    /* ---- Power rails (wide copper) from the PMIC ---- */
    const pY = (i) => pinC(pmic.y, i), pX = (i) => pinC(pmic.x, i);
    rails.push(`M${pmic.x - 6} ${pY(4)} H184 L172 ${pY(4) + 12} V${pinC(adc.y, 5) - 12} L184 ${pinC(adc.y, 5)} H${adc.x - adc.len}`);
    rails.push(`M${pX(5)} ${pmic.y - 6} V162 L${pX(5) + 12} 150 H${pinC(rf.x, 6) - 12} L${pinC(rf.x, 6)} 162 V${rf.y - 6}`);
    rails.push(`M${pinC(rf.x, 7)} ${rf.y + rf.h + 6} V388 L${pinC(rf.x, 7) + 12} 400 H1388 L1400 412 V${pinC(flash.y, 6) - 12} L1388 ${pinC(flash.y, 6)} H${flash.x + flash.w + flash.len}`);
    copper.push(`<path d="M${pinC(mcu.x, 9)} 150 V${mcu.y - mcu.len}" class="pcb-trace pcb-trace--power"/>`);

    /* ---- Crystal, USB-C and debug header wiring ---- */
    copper.push(`<path d="M648 258 H712 L722.5 268.5 V${mcu.y - mcu.len}" class="pcb-trace"/><path d="M648 270 H698 L708.5 280.5 V${mcu.y - mcu.len}" class="pcb-trace"/>`);
    const mb = mcu.y + mcu.h + mcu.len;
    copper.push(`<path d="M470 804 V780 L480 770 H712.5 L722.5 760 V${mb}" class="pcb-trace"/><path d="M484 804 V794 L494 784 H726.5 L736.5 774 V${mb}" class="pcb-trace"/>`);
    [7, 8, 9, 10].forEach((i, k) => {
      const x = pinC(mcu.x, i), hx = 810 + k * 30, dx = hx - x;
      copper.push(`<path d="M${x} ${mb} V730 L${hx} ${(730 + dx).toFixed(1)} V796" class="pcb-trace"/>`);
    });

    /* ---- Meander antenna next to the RF module ---- */
    let ant = `M${rf.x + rf.w + 4} ${pinC(rf.y, 1)} H1440 V200`;
    for (let i = 0; i < 6; i++) ant += i % 2 ? ` H1440 V${220 + i * 20}` : ` H1490 V${220 + i * 20}`;
    copper.push(`<path d="${ant}" class="pcb-trace pcb-trace--ant"/>`);
    silk.push(`<rect x="1424" y="186" width="84" height="164" rx="4" class="pcb-silk-dash"/><text x="1466" y="372" text-anchor="middle" class="pcb-ref">ANT1</text>`);

    /* ---- Passives, crystal, connectors (pads + bodies + refdes) ---- */
    const chipR = (x, y, w, h, ref, rx, ry, vert = false) => {
      const e = vert ? h * 0.3 : w * 0.3;
      pads.push(vert
        ? `<rect x="${x}" y="${y}" width="${w}" height="${e}" rx="1.5" class="pcb-pad"/><rect x="${x}" y="${y + h - e}" width="${w}" height="${e}" rx="1.5" class="pcb-pad"/>`
        : `<rect x="${x}" y="${y}" width="${e}" height="${h}" rx="1.5" class="pcb-pad"/><rect x="${x + w - e}" y="${y}" width="${e}" height="${h}" rx="1.5" class="pcb-pad"/>`);
      solids.push({ x, y, w, h, d: ref && ref[0] === 'R' ? 10 : 14, kind: ref && ref[0] === 'R' ? 'res' : 'cap', vert });
      if (ref) silk.push(`<text x="${rx}" y="${ry}" class="pcb-ref pcb-ref--sm">${ref}</text>`);
    };
    chipR(646, 296, 20, 10, 'C3', 646, 290); chipR(924, 296, 20, 10, 'C4', 924, 290);
    chipR(646, 568, 20, 10, 'C5', 646, 594); chipR(924, 568, 20, 10, 'C6', 924, 594);
    chipR(344, 374, 30, 15, 'C1', 380, 386); chipR(344, 398, 30, 15, 'C2', 380, 410);
    chipR(384, 594, 20, 10, 'R1', 410, 603); chipR(384, 612, 20, 10, 'R2', 410, 621);
    // Inductor L1
    pads.push(`<rect x="286" y="370" width="12" height="44" rx="2" class="pcb-pad"/><rect x="322" y="370" width="12" height="44" rx="2" class="pcb-pad"/>`);
    solids.push({ x: 290, y: 368, w: 40, h: 48, d: 46, kind: 'ind', r: 7 });
    silk.push(`<text x="290" y="436" class="pcb-ref pcb-ref--sm">L1</text>`);
    // Crystal Y1
    pads.push(`<rect x="592" y="252" width="12" height="24" rx="2" class="pcb-pad"/><rect x="640" y="252" width="12" height="24" rx="2" class="pcb-pad"/>`);
    solids.push({ x: 598, y: 250, w: 48, h: 28, d: 20, kind: 'xtal', r: 12 });
    silk.push(`<text x="594" y="242" class="pcb-ref pcb-ref--sm">Y1</text>`);
    // USB-C J2 (overhangs the board edge like the real part)
    pads.push(Array.from({ length: 6 }, (_, i) => `<rect x="${452 + i * 7}" y="800" width="4" height="12" rx="1" class="pcb-pad"/>`).join(''));
    solids.push({ x: 436, y: 810, w: 84, h: 56, d: 64, kind: 'usb', r: 10 });
    silk.push(`<text x="428" y="826" text-anchor="end" class="pcb-ref">J2</text><text x="428" y="846" text-anchor="end" class="pcb-ref pcb-ref--sm">USB-C</text>`);
    // Debug header J1
    for (let i = 0; i < 12; i++) pads.push(`<rect x="${620 + i * 30}" y="800" width="20" height="20" rx="${i ? 10 : 2}" class="pcb-pad"/><circle cx="${630 + i * 30}" cy="810" r="4.5" class="pcb-drill"/>`);
    silk.push(`<rect x="612" y="792" width="356" height="36" rx="3" class="pcb-silk-line"/><text x="612" y="782" class="pcb-ref">J1</text><text x="968" y="846" text-anchor="end" class="pcb-ref pcb-ref--sm">SWD · UART · GPIO</text>`);

    /* ---- Test points, fiducials, mounting holes, via stitching ---- */
    [[560, 720, 'TP1'], [1000, 700, 'TP2'], [1000, 250, 'TP3']].forEach(([x, y, r]) => {
      pads.push(`<circle cx="${x}" cy="${y}" r="9" class="pcb-pad"/>`);
      silk.push(`<circle cx="${x}" cy="${y}" r="14" class="pcb-silk-line"/><text x="${x + 20}" y="${y + 5}" class="pcb-ref pcb-ref--sm">${r}</text>`);
    });
    [[440, 470], [1100, 760], [1450, 470]].forEach(([x, y]) => pads.push(`<circle cx="${x}" cy="${y}" r="10" class="pcb-fid-ring"/><circle cx="${x}" cy="${y}" r="4" class="pcb-pad"/>`));
    const holes = [[104, 84], [1496, 84], [104, 816], [1496, 816]];
    holes.forEach(([x, y]) => pads.push(`<circle cx="${x}" cy="${y}" r="20" class="pcb-pad"/><circle cx="${x}" cy="${y}" r="11" class="pcb-drill"/>`));
    const vias = [];
    const nearHole = (x, y) => holes.some(([hx, hy]) => Math.hypot(hx - x, hy - y) < 44);
    const nearUsb = (x, y) => y > 790 && x > 420 && x < 540;
    for (let x = 140; x <= 1460; x += 40) [64, 836].forEach((y) => { if (!nearHole(x, y) && !nearUsb(x, y)) vias.push([x, y]); });
    for (let y = 120; y <= 780; y += 40) [84, 1516].forEach((x) => { if (!nearHole(x, y)) vias.push([x, y]); });
    // Vias where rails and buses change layer
    vias.push([172, 470], [760, 150], [1080, 150], [1400, 540], [540, 770], [880, 770]);
    copper.push(vias.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" class="pcb-via"/><circle cx="${x}" cy="${y}" r="2" class="pcb-drill"/>`).join(''));

    /* ---- Board-level silkscreen ---- */
    silk.push(`<text x="960" y="110" class="pcb-silk-brand">PLANCK PLAY</text>
      <text x="960" y="130" class="pcb-ref pcb-ref--sm">PP-IOT-01  REV B</text>
      <text x="560" y="142" class="pcb-ref pcb-ref--sm">3V3</text>`);

    const pulses = animate ? hot.map((d, i) => `<circle r="4" class="pcb-pulse"><animateMotion dur="${(2.8 + i * 0.35).toFixed(2)}s" begin="${(i * 0.6).toFixed(1)}s" repeatCount="indefinite" path="${d}"/></circle>`).join('') : '';
    const partGroups = (layer) => Object.entries(byPart).map(([k, v]) => `<g data-part="${k}">${v[layer].join('')}</g>`).join('');

    // Shared paint servers: rendered once (in a 0×0 SVG) and referenced by every layer.
    const defs = `<defs>
        <pattern id="pcb-pour" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" class="pcb-pour-line"/></pattern>
        <linearGradient id="pcb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1CF7A"/><stop offset="1" stop-color="#B8893A"/></linearGradient>
        <filter id="pcb-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="pcb-board-clip"><rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}"/></clipPath>
      </defs>`;

    return {
      W, H, B, defs, solids,
      copper: `<rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}" fill="url(#pcb-pour)" class="pcb-pour" clip-path="url(#pcb-board-clip)"/>
        ${rails.map((d) => `<path d="${d}" class="pcb-rail"/>`).join('')}
        ${copper.join('')}
        <g class="l-signal" filter="url(#pcb-glow)">${pulses}</g>`,
      pads: pads.join('') + partGroups('pads'),
      silk: silk.join('') + partGroups('silk'),
    };
  }

  Object.assign(PP, { ArtPanel, pcbModel });
})();

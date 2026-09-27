(() => {
  'use strict';
  const { html, raw, defineBehavior, motionEnabled } = PP;

  const pad = (x) => String(x).padStart(2, '0');

  /**
   * ProcessTimeline — numbered steps drawn on a line.
   * Horizontal when the container is at least `breakpoint` px wide, vertical
   * list below that. Optional loop arc ("iterate") and go/no-go gate above the
   * line, and brackets grouping steps below it.
   * The vertical list has one continuous rail from the first to the last node
   * (group labels sit beside it, not across it). As the page scrolls, a red
   * fill runs down the rail and each node lights up when the fill reaches it.
   *
   * @param {{ steps: {index: string, title: string, text: string}[],
   *           brackets?: {from: number, to: number, label: string}[],
   *           loopFrom?: number, loopTo?: number, loopLabel?: string,
   *           gateAfter?: number, gateLabel?: string, breakpoint?: number }} props
   */
  function ProcessTimeline({ steps = [], brackets = [], loopFrom = 0, loopTo = 0, loopLabel = 'Iterate', gateAfter = 0, gateLabel = 'Go / no-go', breakpoint }) {
    const n = steps.length || 6;
    const dense = n > 6;
    const bp = breakpoint || (dense ? 1040 : 760);
    const stagger = dense ? 90 : 150;
    const delay = (i) => `${200 + i * stagger}ms`;
    const hasLoop = !!(loopFrom && loopTo), hasGate = !!gateAfter, hasAnno = hasLoop || hasGate;
    const cols = `repeat(${n}, minmax(0, 1fr))`;
    const d = (i) => raw(`style="--d:${delay(i)}"`);

    const horizontal = html`
      <div class="timeline__h${hasAnno ? ' has-anno' : ''}">
        ${hasAnno ? html`
          <div class="timeline__anno" aria-hidden="true" style="grid-template-columns:${cols}">
            ${hasLoop ? html`
              <div class="timeline__loop fade" style="grid-column:${loopFrom} / ${loopTo}; --d:${delay(loopTo)}">
                <svg class="timeline__loop-arc" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M100 40 C100 6 0 6 0 40" fill="none" stroke="#FB6002" stroke-width="1" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/></svg>
                <svg class="timeline__loop-head" width="10" height="10" viewBox="0 0 10 10"><path d="M1 2.5 5 7 9 2.5" fill="none" stroke="#FB6002" stroke-width="1"/></svg>
                <span class="timeline__loop-label">${loopLabel}</span>
              </div>` : ''}
            ${hasGate ? html`
              <div class="timeline__gate fade" style="grid-column:${gateAfter} / ${gateAfter + 1}; --d:${delay(gateAfter + 0.5)}">
                <span class="timeline__gate-diamond"></span>
                <span class="timeline__gate-label">${gateLabel}</span>
              </div>` : ''}
          </div>` : ''}
        <div class="timeline__line" aria-hidden="true"></div>
        <ol class="timeline__steps" style="grid-template-columns:${cols}">
          ${steps.map((s, i) => html`
            <li class="timeline__step rise" ${d(i)}>
              <span class="timeline__node" aria-hidden="true"></span>
              <span class="timeline__index">${s.index}</span>
              <h3 class="timeline__title">${s.title}</h3>
              <p class="timeline__text">${s.text}</p>
            </li>`)}
        </ol>
        ${brackets.length ? html`
          <div class="timeline__brackets" aria-hidden="true" style="grid-template-columns:${cols}">
            ${brackets.map((b) => html`
              <div class="timeline__bracket fade" style="grid-column:${b.from} / ${b.to + 1}; --d:${delay(b.to)}">
                <span class="timeline__bracket-line"></span>
                <span class="timeline__bracket-label">${b.label}</span>
              </div>`)}
          </div>` : ''}
      </div>`;

    const vertical = html`
      <div class="timeline__v-wrap">
      <span class="timeline__v-track" aria-hidden="true"><span class="timeline__v-fill"></span></span>
      <ol class="timeline__v">
        ${steps.map((s, i) => {
          const group = brackets.find((b) => b.from === i + 1);
          const loopNote = hasLoop && loopTo === i + 1 ? `${loopLabel} · back to ${pad(loopFrom)}` : '';
          const gateNote = hasGate && gateAfter === i + 1 ? `${gateLabel} decision` : '';
          return html`
            ${group ? html`<li class="timeline__v-group fade" ${d(i)}>${group.label}</li>` : ''}
            <li class="timeline__v-step rise" ${d(i)}>
              <div class="timeline__v-rail">
                <span class="timeline__node" aria-hidden="true"></span>
              </div>
              <div class="timeline__v-body">
                <span class="timeline__index">${s.index}</span>
                <h3 class="timeline__title">${s.title}</h3>
                <p class="timeline__text">${s.text}</p>
                ${loopNote ? html`<span class="timeline__v-loop">${loopNote}</span>` : ''}
                ${gateNote ? html`<span class="timeline__v-gate"><span aria-hidden="true"></span>${gateNote}</span>` : ''}
              </div>
            </li>`;
        })}
      </ol>
      </div>`;

    return html`
      <div class="timeline${dense ? ' timeline--dense' : ''}" data-behavior="process-timeline" data-breakpoint="${bp}" style="--line-dur:${n * stagger + 500}ms">
        ${horizontal}${vertical}
      </div>`;
  }

  defineBehavior('process-timeline', (root) => {
    const bp = Number(root.dataset.breakpoint) || 760;
    const wrap = root.querySelector('.timeline__v-wrap');
    const track = root.querySelector('.timeline__v-track');
    const vNodes = Array.from(root.querySelectorAll('.timeline__v .timeline__node'));
    const motion = motionEnabled();
    let raf = 0;

    /* Vertical rail: span exactly from the first node's centre to the last one's. */
    const placeRail = () => {
      if (!wrap || !vNodes.length || root.classList.contains('is-horizontal')) return;
      const w = wrap.getBoundingClientRect();
      const c = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 - w.top; };
      const top = c(vNodes[0]), bottom = c(vNodes[vNodes.length - 1]);
      track.style.top = `${top}px`;
      track.style.height = `${Math.max(0, bottom - top)}px`;
    };
    /* Scroll fill: the rail fills up to a line 62% down the viewport. */
    const paint = () => {
      raf = 0;
      if (!wrap || root.classList.contains('is-horizontal')) return;
      if (!motion) { root.style.setProperty('--fill', '1'); vNodes.forEach((n) => n.classList.add('is-lit')); return; }
      const mark = window.innerHeight * 0.62;
      const t = track.getBoundingClientRect();
      root.style.setProperty('--fill', String(Math.max(0, Math.min(1, (mark - t.top) / Math.max(1, t.height)))));
      vNodes.forEach((n) => { const r = n.getBoundingClientRect(); n.classList.toggle('is-lit', r.top + r.height / 2 <= mark + 1); });
    };
    const update = () => { if (!raf) raf = requestAnimationFrame(() => { placeRail(); paint(); }); };

    const layout = (w) => { root.classList.toggle('is-horizontal', w >= bp); update(); };
    layout(root.getBoundingClientRect().width);
    const ro = 'ResizeObserver' in window ? new ResizeObserver((e) => layout(e[0].contentRect.width)) : null;
    ro?.observe(root);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const stopRail = () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(raf); };

    if (!motion) { root.classList.add('is-shown', 'is-still'); return () => { ro?.disconnect(); stopRail(); }; }

    const check = () => {
      const r = root.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) { root.classList.add('is-shown'); unlisten(); }
    };
    const unlisten = () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const t = setTimeout(check, 300);
    // Steps rise in over ~1s; re-place the rail once they have settled.
    const t2 = setTimeout(update, 1400);
    return () => { ro?.disconnect(); unlisten(); stopRail(); clearTimeout(t); clearTimeout(t2); };
  });

  Object.assign(PP, { ProcessTimeline });
})();

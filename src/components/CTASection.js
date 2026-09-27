/**
 * CTASection — closing "start a project" band. Centered huge headline with the
 * animated logo mark rising behind it (replaces the old line-art drawing).
 * @param {{ index?: string, label?: string, title?: string, lede?: string, note?: string }} props
 */
(() => {
  'use strict';
  const { html, icon, href, LogoMark } = PP;

  function CTASection({
    label = 'Start a project',
    title = 'Bring us a difficult technical problem.',
    lede = 'We research it, engineer a solution and deliver it.',
    note = '',
  } = {}) {
    const dot = title.endsWith('.');
    return html`
      <section class="cta" data-progress="view">
        <div class="cta__glow" aria-hidden="true"></div>
        <div class="cta__mark" data-parallax="0.18">${LogoMark({ size: 'xl', rings: true })}</div>
        <div class="cta__inner container" data-stagger>
          <p class="kicker">${label}</p>
          <h2 class="headline headline--xl">${dot ? title.slice(0, -1) : title}${dot ? html`<span class="accent-dot">.</span>` : ''}</h2>
          <p class="lede">${lede}</p>
          <div class="btn-row center">
            <a class="btn btn-primary btn-pill btn-lg" href="${href('contact')}" data-magnetic>Discuss your project${icon('arrowRight', { size: 18 })}</a>
            <a class="btn btn-secondary btn-pill btn-lg" href="${href('contact', 'rfp')}">${icon('upload', { size: 18 })}Submit an RFP</a>
          </div>
          ${note ? html`<p class="cta__note">${note}</p>` : ''}
        </div>
      </section>`;
  }
  Object.assign(PP, { CTASection });
})();

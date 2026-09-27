/**
 * PageHero — inner-page hero. Headline left, the animated LogoMark right
 * (this replaces the old line-art drawing). As the page scrolls, the copy
 * lifts and fades while the mark drifts at its own parallax speed.
 * A trailing "." in the title is rendered in brand red.
 * @param {{ eyebrow: string, title: string, lede: string, primaryLabel?: string, primaryHref?: string, secondaryLabel?: string, secondaryHref?: string }} props
 */
(() => {
  'use strict';
  const { html, icon, LogoMark } = PP;

  function PageHero({ eyebrow, title, lede, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) {
    const dot = title.endsWith('.');
    return html`
      <section class="phero" data-progress="exit">
        <div class="phero__bg" aria-hidden="true"></div>
        <div class="phero__inner container">
          <div class="phero__copy">
            <p class="phero__eyebrow" data-reveal="fade"><span class="phero__led"></span>${eyebrow}</p>
            <h1 class="phero__title" data-reveal="blur">${dot ? title.slice(0, -1) : title}${dot ? html`<span class="accent-dot">.</span>` : ''}</h1>
            <p class="phero__lede" data-reveal>${lede}</p>
            ${primaryLabel ? html`
              <div class="btn-row" data-reveal>
                <a class="btn btn-primary btn-pill btn-lg" href="${primaryHref}" data-magnetic>${primaryLabel}${icon('arrowRight', { size: 18 })}</a>
                ${secondaryLabel ? html`<a class="btn btn-secondary btn-pill btn-lg" href="${secondaryHref}">${secondaryLabel}</a>` : ''}
              </div>` : ''}
          </div>
          <div class="phero__art" data-parallax="-0.12">
            <div data-reveal="scale">${LogoMark({ size: 'xl' })}</div>
          </div>
        </div>
      </section>`;
  }
  Object.assign(PP, { PageHero });
})();

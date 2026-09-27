(() => {
  'use strict';
  const { html, icon } = PP;

  /**
   * SectionHeader — numbered eyebrow, big title, lede and an optional link.
   * @param {{ index?: string, label: string, title: string, lede?: string, linkLabel?: string, linkHref?: string }} props
   */
  function SectionHeader({ index, label, title, lede, linkLabel, linkHref }) {
    return html`
      <div class="section-header">
        <p class="eyebrow">${index ? html`<span class="index">${index}</span>` : ''}<span>${label}</span></p>
        <div class="section-header__row">
          <h2 class="section-header__title">${title}</h2>
          ${lede || linkHref ? html`
            <div class="section-header__aside">
              ${lede ? html`<p class="section-header__lede">${lede}</p>` : ''}
              ${linkHref ? html`<a class="link-mono link-mono--underline" href="${linkHref}">${linkLabel}${icon('arrowRight', { size: 14 })}</a>` : ''}
            </div>` : ''}
        </div>
      </div>`;
  }

  Object.assign(PP, { SectionHeader });
})();

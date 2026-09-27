(() => {
  'use strict';
  const { html, icon } = PP;

  /**
   * ImageSlot — a photo when `src` is set; otherwise branded generative artwork
   * (glowing line icon over a gradient), so the live site never shows an empty
   * "photo goes here" box.
   * @param {{ id: string, placeholder: string, src?: string|null, alt?: string, iconName?: string, className?: string }} props
   */
  function ImageSlot({ id, placeholder, src = null, alt = '', iconName = 'cpu', className = '' }) {
    if (src) return html`<img class="image-slot image-slot--filled ${className}" data-slot="${id}" src="${src}" alt="${alt || placeholder}" loading="lazy">`;
    return html`
      <div class="art art--red image-slot--art ${className}" data-slot="${id}" aria-hidden="true">
        <div class="art__grid"></div><div class="art__orb"></div>
        <div class="art__icon">${icon(iconName, { size: 120 })}</div>
      </div>`;
  }

  Object.assign(PP, { ImageSlot });
})();

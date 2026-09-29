(() => {
  'use strict';
  const { html, icon } = PP;

  /**
   * InfoPanel — the flat panels used for R&D work types, the six
   * "why us" commitments and the engagement models.
   */

  /** @param {{ title: string, text: string, output?: string }} item */
  const RDKindPanel = (item) => html`
    <div class="info-panel">
      <h4 class="info-panel__title">${item.title}</h4>
      <p class="info-panel__text">${item.text}</p>
      ${item.output ? html`<p class="info-panel__output">→ ${item.output}</p>` : ''}
    </div>`;

  /** @param {{ title: string, text: string }} item */
  const WhyPanel = (item) => html`
    <div class="info-panel info-panel--why">
      <h3 class="info-panel__title">${item.title}</h3>
      <p class="info-panel__text">${item.text}</p>
    </div>`;

  /** @param {{ title: string, text: string, icon: string }} item */
  const EngagementPanel = (item) => html`
    <li class="info-panel info-panel--engagement" ${item.id ? html`id="${item.id}"` : ''}>
      ${icon(item.icon, { size: 28, color: 'var(--pp-red)' })}
      <h3 class="info-panel__title">${item.title}</h3>
      <p class="info-panel__text">${item.text}</p>
    </li>`;

  Object.assign(PP, { RDKindPanel, WhyPanel, EngagementPanel });
})();

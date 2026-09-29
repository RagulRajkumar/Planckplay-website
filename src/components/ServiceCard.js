(() => {
  'use strict';
  const { html, icon } = PP;

  /**
   * ServiceCard — one of the services, linking to its Solutions entry.
   * @param {{ item: { index: string, title: string, summary: string, href: string } }} props
   */
  function ServiceCard({ item }) {
    return html`
      <a class="pp-card pp-card--link service-card" href="${item.href}">
        <div class="pp-card__head">
          ${icon('arrowUpRight', { size: 20, className: 'pp-card__arrow' })}
        </div>
        <h3 class="pp-card__title">${item.title}</h3>
        <p class="pp-card__body">${item.summary}</p>
      </a>`;
  }

  Object.assign(PP, { ServiceCard });
})();

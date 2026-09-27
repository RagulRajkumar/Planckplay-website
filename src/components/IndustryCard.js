(() => {
  'use strict';
  const { html, icon, TechTag } = PP;

  /**
   * IndustryCard — sector, the problems we solve there, and what applies.
   * @param {{ item: { index: string, name: string, problems: string, capabilities: string[], href: string } }} props
   */
  function IndustryCard({ item }) {
    return html`
      <a class="pp-card pp-card--link industry-card" href="${item.href}">
        <div class="pp-card__head">
          <span class="pp-card__index">${item.index}</span>
          ${icon('arrowUpRight', { size: 20, className: 'pp-card__arrow' })}
        </div>
        <h3 class="pp-card__title industry-card__title">${item.name}</h3>
        <div class="industry-card__block">
          <span class="pp-card__label">Problems we solve</span>
          <p class="industry-card__problems">${item.problems}</p>
        </div>
        <div class="industry-card__block industry-card__applies">
          <span class="pp-card__label">What applies</span>
          <div class="tag-list">${(item.capabilities || []).map((c) => TechTag({ label: c }))}</div>
        </div>
      </a>`;
  }

  Object.assign(PP, { IndustryCard });
})();

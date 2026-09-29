(() => {
  'use strict';
  const { html, icon, config, TechTag } = PP;

  /**
   * CapabilityCard — a discipline and its technologies.
   * Pending tags/categories are shown dashed in review mode and dropped otherwise.
   * Hover: the card lifts, a red rule sweeps across the top, the icon tile
   * fills and the tags tint one after another (styles/components/cards.css).
   * @param {{ item: { name: string, icon?: string, pending?: boolean, tags: {label: string, pending?: boolean}[] }, review?: boolean }} props
   */
  function CapabilityCard({ item, review = config.reviewMode }) {
    const tags = (item.tags || [])
      .filter((t) => review || !t.pending)
      .map((t) => ({ label: t.label, pending: !!t.pending || !!item.pending }));
    return html`
      <div class="pp-card capability-card${item.pending ? ' is-pending' : ''}" ${item.id ? html`id="${item.id}"` : ''} data-spotlight>
        <div class="pp-card__head">
          ${item.icon ? html`<span class="capability-card__icon" aria-hidden="true">${icon(item.icon, { size: 22 })}</span>` : ''}
          ${item.pending && review ? html`<span class="pp-card__label accent-text">Category to confirm</span>` : ''}
        </div>
        <h3 class="pp-card__title">${item.name}</h3>
        <div class="tag-list">${tags.map((t, i) => html`<span class="capability-card__tag" style="--t:${i}">${TechTag(t)}</span>`)}</div>
      </div>`;
  }

  Object.assign(PP, { CapabilityCard });
})();

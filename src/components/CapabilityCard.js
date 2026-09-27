(() => {
  'use strict';
  const { html, config, TechTag } = PP;

  /**
   * CapabilityCard — a discipline and its technologies.
   * Pending tags/categories are shown dashed in review mode and dropped otherwise.
   * @param {{ item: { index: string, name: string, pending?: boolean, tags: {label: string, pending?: boolean}[] }, review?: boolean }} props
   */
  function CapabilityCard({ item, review = config.reviewMode }) {
    const tags = (item.tags || [])
      .filter((t) => review || !t.pending)
      .map((t) => ({ label: t.label, pending: !!t.pending || !!item.pending }));
    return html`
      <div class="pp-card capability-card${item.pending ? ' is-pending' : ''}" ${item.id ? html`id="${item.id}"` : ''}>
        <div class="pp-card__head pp-card__label">
          <span class="accent-text">${item.index}</span>
          ${item.pending && review ? html`<span class="accent-text">Category to confirm</span>` : ''}
        </div>
        <h3 class="pp-card__title">${item.name}</h3>
        <div class="tag-list">${tags.map(TechTag)}</div>
      </div>`;
  }

  Object.assign(PP, { CapabilityCard });
})();

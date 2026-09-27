(() => {
  'use strict';
  const { html } = PP;

  /**
   * TechTag — small mono pill for a technology or capability.
   * @param {{ label: string, pending?: boolean }} props
   *   pending → dashed outline + "confirm" badge (only rendered in review mode).
   */
  function TechTag({ label, pending = false }) {
    if (pending) {
      return html`<span class="tech-tag tech-tag--pending" title="Awaiting confirmation. Hidden on the live site until approved.">${label}<span class="tech-tag__badge">confirm</span></span>`;
    }
    return html`<span class="tech-tag">${label}</span>`;
  }

  const TagList = (tags) => html`<div class="tag-list">${tags.map((t) => TechTag(typeof t === 'string' ? { label: t } : t))}</div>`;

  Object.assign(PP, { TechTag, TagList });
})();

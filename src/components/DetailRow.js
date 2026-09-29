(() => {
  'use strict';
  const { html, icon, TechTag } = PP;

  /**
   * DetailRow — one anchored entry on a listing page (a service, an industry…):
   * [index] | title + text (+ problem/answer pairs) (+ tags) | action link.
   * `points` is a list of [problem, what we do] pairs, shown as two columns.
   * @param {{ id?: string, index?: string, title: string, text?: string, label?: string,
   *           points?: [string, string][], pointsHead?: [string, string],
   *           tags?: (string|{label:string,pending?:boolean})[], tagsLabel?: string,
   *           linkLabel?: string, linkHref?: string }} props
   */
  function DetailRow({ id, index, title, text, label, points = [], pointsHead = ['The problem', 'What we do'], tags = [], tagsLabel, linkLabel, linkHref }) {
    return html`
      <article class="detail-row${index ? '' : ' detail-row--no-index'}" ${id ? html`id="${id}"` : ''} data-reveal>
        ${index ? html`<span class="detail-row__index">${index}</span>` : ''}
        <div class="detail-row__main">
          <h2 class="detail-row__title">${title}</h2>
          ${label && !points.length ? html`<span class="pp-card__label">${label}</span>` : ''}
          ${text ? html`<p class="detail-row__text">${text}</p>` : ''}
          ${points.length ? html`
            <div class="detail-row__points">
              ${label ? html`<h3 class="detail-row__points-title">${label}</h3>` : ''}
              <div class="detail-row__points-head" aria-hidden="true"><span>${pointsHead[0]}</span><span>${pointsHead[1]}</span></div>
              <ul>
                ${points.map(([problem, answer]) => html`
                  <li>
                    <p class="detail-row__problem"><span class="visually-hidden">${pointsHead[0]}: </span>${problem}</p>
                    <p class="detail-row__answer"><span class="visually-hidden">${pointsHead[1]}: </span>${answer}</p>
                  </li>`)}
              </ul>
            </div>` : ''}
          ${tags.length ? html`
            <div class="detail-row__tags">
              ${tagsLabel ? html`<span class="pp-card__label">${tagsLabel}</span>` : ''}
              <div class="tag-list">${tags.map((t) => TechTag(typeof t === 'string' ? { label: t } : t))}</div>
            </div>` : ''}
        </div>
        ${linkHref ? html`<a class="link-mono link-mono--underline detail-row__link" href="${linkHref}">${linkLabel}${icon('arrowRight', { size: 14 })}</a>` : ''}
      </article>`;
  }

  Object.assign(PP, { DetailRow });
})();

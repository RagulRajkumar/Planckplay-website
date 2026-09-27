(() => {
  'use strict';
  const { html, icon, config } = PP;

  /**
   * RegistrationList — Udyam / GST / ISO … slots.
   * Only `live: true` entries render in production; review mode shows all.
   * Returns '' when nothing is visible, so the section disappears cleanly.
   * @param {{ items: { key: string, label: string, value: string, live: boolean }[] }} props
   */
  function RegistrationList({ items }) {
    const review = config.reviewMode;
    const regs = review ? items : items.filter((r) => r.live);
    if (!regs.length) return '';
    return html`
      <div class="registrations" data-reveal>
        <div class="registrations__head">
          <h3 class="eyebrow registrations__title">Registrations and certifications</h3>
          ${review ? html`<p class="registrations__note">Review view: each slot stays hidden on the live site until the registration is real.</p>` : ''}
        </div>
        <ul class="registrations__list">
          ${regs.map((r) => html`
            <li class="registrations__item${r.live ? ' is-live' : ''}">
              <span class="registrations__label">${r.label}</span>
              <span class="registrations__value">${r.value}</span>
              ${r.live ? '' : html`<span class="registrations__hidden">${icon('eyeOff', { size: 12 })}Hidden until registered</span>`}
            </li>`)}
        </ul>
      </div>`;
  }

  Object.assign(PP, { RegistrationList });
})();

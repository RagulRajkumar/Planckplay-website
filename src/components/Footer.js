/** Footer — brand lockup, link columns, contact facts that are confirmed, and the legal line. */
(() => {
  'use strict';
  const { html, icon, known, href, Brand } = PP;
  const { footerColumns, legalLinks, company } = PP.site;

  function Footer() {
    const year = new Date().getFullYear();
    const regs = [['LLPIN', company.llpin], ['GSTIN', company.gstin], ['Udyam', company.udyam]].filter(([, v]) => known(v));
    const social = company.social.filter((s) => known(s.href));
    return html`
      <footer class="footer">
        <div class="footer__inner">
          <div class="footer__cols">
            <div class="footer__brand">
              <a class="footer__logo" href="${href('home')}" aria-label="Planck Play, home">${Brand({ className: 'brand--footer' })}</a>
              <p class="footer__tagline">${company.oneLine}</p>
            </div>
            ${footerColumns.map((col) => html`
              <div class="footer__col">
                <h2>${col.title}</h2>
                <ul>${col.links.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
              </div>`)}
            <div class="footer__col">
              <h2>Contact</h2>
              <ul class="footer__contact">
                ${known(company.email) ? html`<li>${icon('mail', { size: 16 })}<a href="mailto:${company.email}">${company.email}</a></li>` : ''}
                ${known(company.phone) ? html`<li>${icon('phone', { size: 16 })}<a href="tel:${company.phone.replace(/\s/g, '')}">${company.phone}</a></li>` : ''}
                ${known(company.whatsapp) ? html`<li>${icon('messageCircle', { size: 16 })}<a href="https://wa.me/${company.whatsapp.replace(/\D/g, '')}" rel="noopener">${company.whatsapp}</a></li>` : ''}
                ${known(company.address) ? html`<li>${icon('mapPin', { size: 16 })}<span>${company.address}</span></li>` : ''}
              </ul>
              ${social.length ? html`<div class="footer__social">${social.map((s) => html`<a href="${s.href}" rel="noopener" target="_blank">${s.label} ↗</a>`)}</div>` : ''}
            </div>
          </div>
          <div class="footer__legal">
            <p>Copyright © ${year} ${company.name}. All rights reserved.${regs.length ? ` ${regs.map(([k, v]) => `${k} ${v}`).join(' · ')}` : ''}</p>
            <div>${legalLinks.map((l) => html`<a href="${l.href}">${l.label}</a>`)}</div>
          </div>
        </div>
      </footer>`;
  }
  Object.assign(PP, { Footer });
})();

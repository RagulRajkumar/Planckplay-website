(() => {
  'use strict';
  const { html, icon, known, pageMeta, Layout, PageHero, ContactForm, LogoMark } = PP;
  const { company } = PP.site;

  /** Anchors: #/contact/engineer, #/contact/rfp, #/contact/nda preselect the form. */
  function applyAnchor(anchor, root) {
    const form = root.querySelector('.contact-form');
    if (!form) return;
    const type = { engineer: 'engineer', rfp: 'rfp', nda: 'project' }[anchor];
    if (type) form.querySelector(`input[name="type"][value="${type}"]`).checked = true;
    if (anchor === 'nda') form.querySelector('input[name="nda"]').checked = true;
  }

  const render = ({ anchor }) => Layout({
    current: 'contact',
    children: html`
      ${PageHero({ eyebrow: 'Contact', title: 'Describe the problem. An engineer replies.',
        lede: 'Describe your technical problem or upload an RFP. An engineer replies within one working day. NDA available before the first technical conversation.' })}

      <section class="band theme-paper" id="engineer">
        <div class="section-inner contact-layout">
          <div class="contact-layout__form">${ContactForm({
            type: { engineer: 'engineer', rfp: 'rfp' }[anchor] || 'project', nda: anchor === 'nda' })}</div>
          <aside class="contact-layout__aside theme-dark">
          <h2 class="eyebrow">Direct</h2>
          <ul class="contact-details">
            ${known(company.email) ? html`<li>${icon('mail', { size: 18, color: 'var(--pp-orange)' })}<a href="mailto:${company.email}">${company.email}</a></li>` : ''}
            ${known(company.phone) ? html`<li>${icon('phone', { size: 18, color: 'var(--pp-orange)' })}<a href="tel:${company.phone.replace(/\s/g, '')}">${company.phone}</a></li>` : ''}
            ${known(company.whatsapp) ? html`<li>${icon('messageCircle', { size: 18, color: 'var(--pp-orange)' })}<a href="https://wa.me/${company.whatsapp.replace(/\D/g, '')}" rel="noopener">WhatsApp ${company.whatsapp}</a></li>` : ''}
            ${known(company.address) ? html`<li class="top">${icon('mapPin', { size: 18, color: 'var(--pp-orange)' })}<span>${company.address}</span></li>` : ''}
          </ul>
          <div class="contact-promises">
            <p><strong>1 working day</strong> to a reply from an engineer</p>
            <p><strong>72 hours</strong> from discovery to a written proposal</p>
            <p><strong>NDA first</strong>, before any technical detail is shared</p>
          </div>
          <div class="contact-aside-mark">${LogoMark({ size: 'md', rings: true })}</div>
        </aside>
        </div>
      </section>`,
  });

  PP.pages.Contact = {
    key: 'contact', ...pageMeta('contact'), render,
    mount: (root, { anchor }) => applyAnchor(anchor, root),
    onAnchor: applyAnchor,
  };
})();

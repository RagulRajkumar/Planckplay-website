/**
 * Legal pages — Privacy, Terms, Cookies. The text describes what this website
 * actually does: no cookies, no analytics or advertising trackers; enquiries
 * are sent by the visitor from their own email; fonts are self-hosted.
 * Update `updated` and the copy if the site's behaviour changes.
 */
(() => {
  'use strict';
  const { html, pageMeta, Layout, PageHero } = PP;
  const { company } = PP.site;
  const mail = html`<a href="mailto:${company.email}">${company.email}</a>`;
  const updated = 'September 2026';

  const DOCS = {
    privacy: {
      eyebrow: 'Legal', title: 'Privacy policy.', lede: `How ${company.name} collects, uses and protects personal data submitted through this website.`,
      sections: [
        ['Who we are', [html`${company.name} ("Planck Play", "we") is an engineering company based in ${company.city}. For any question about this policy or your data, write to ${mail}.`]],
        ['What we collect', [
          'We only collect what you choose to send us: the details you include in the email the contact form prepares, or in any email you send us — typically your name, work email, company, phone number, a description of your technical problem, and any files you attach such as an RFP or drawings.',
          'This website does not use cookies, analytics, advertising pixels or any other tracking technology.',
        ]],
        ['How we use it', [
          'To reply to your enquiry, discuss your project, prepare an NDA or proposal, and deliver and support work you engage us for. We do not sell, rent or trade personal data, and we do not use it for unrelated marketing.',
          'Technical material you share with us is treated as confidential and is used only to evaluate and deliver your project.',
        ]],
        ['Sharing', [
          'The contact form does not send anything from this website: it prepares an email that you send from your own email account, so your enquiry reaches us directly. We share personal data only with service providers that help us operate (such as email hosting), under confidentiality obligations, or where the law requires it.',
          'All fonts, images and code on this website are served from our own site; no third-party content is loaded while you browse.',
        ]],
        ['Retention', ['We keep enquiry data for as long as needed to respond and, if we work together, for the duration of the engagement and any period required by law or for accounting and contractual records. You can ask us to delete it sooner.']],
        ['Your rights', [html`Under the Digital Personal Data Protection Act, 2023 you may ask to access, correct or erase your personal data, withdraw consent, or raise a grievance. Email ${mail} and we will respond within a reasonable time.`]],
        ['Changes', ['We may update this policy when our practices change. The date below shows the latest version.']],
      ],
    },
    terms: {
      eyebrow: 'Legal', title: 'Terms of use.', lede: `The terms that apply when you use the ${company.name} website.`,
      sections: [
        ['Using this website', ['This website describes the services of Planck Play. By using it you agree to these terms. If you do not agree, please do not use the website.']],
        ['Information on the site', ['The content is provided for general information about our capabilities. It is not an offer or a binding commitment: the scope and terms of any engagement are set out in a written proposal or agreement signed by both parties.']],
        ['Intellectual property', ['The Planck Play name and logo, and the text, graphics and code of this website, belong to Planck Play or its licensors. You may view and share pages for personal or internal business purposes; any other reproduction needs our written permission.']],
        ['What you send us', ['When you submit an enquiry or files, you confirm you are entitled to share them. We treat submitted technical information as confidential and offer an NDA before the first technical conversation.']],
        ['Liability', ['We work to keep the website accurate and available but provide it "as is", without warranties. To the extent permitted by law, Planck Play is not liable for any loss arising from use of, or reliance on, the website.']],
        ['Governing law', [`These terms are governed by the laws of India. Courts at ${company.city.split(',')[0]} have jurisdiction over any dispute relating to this website.`]],
      ],
    },
    cookies: {
      eyebrow: 'Legal', title: 'Cookie policy.', lede: 'Which cookies and browser storage this website uses.',
      sections: [
        ['Cookies', ['This website does not set any cookies — no analytics, advertising or tracking cookies, and no cookie banner is needed.']],
        ['Browser storage', ['The site stores a single value in your browser’s session storage (pp-splash-seen) so the opening animation plays only once per visit. It contains no personal data and is deleted automatically when you close the tab.']],
        ['Third parties', ['No third-party content is loaded while you browse. The contact form prepares an email in your own mail app (or Gmail or Outlook, if you choose one); the enquiry is sent from your account, not from this website.']],
        ['Managing storage', ['You can clear session storage at any time from your browser settings. The website works fully without it.']],
      ],
    },
  };

  function legalPage(key) {
    const d = DOCS[key];
    return {
      key, ...pageMeta(key),
      render: () => Layout({
        current: key,
        children: html`
          ${PageHero({ eyebrow: d.eyebrow, title: d.title, lede: d.lede })}
          <section class="band theme-paper">
            <div class="section-inner legal">
              <article class="legal__body">
                ${d.sections.map(([h, ps]) => html`
                  <section class="legal__section" data-reveal>
                    <h2>${h}</h2>
                    ${ps.map((p) => html`<p>${p}</p>`)}
                  </section>`)}
                <p class="legal__updated">Last updated: ${updated}</p>
              </article>
            </div>
          </section>`,
      }),
    };
  }

  Object.assign(PP.pages, { Privacy: legalPage('privacy'), Terms: legalPage('terms'), Cookies: legalPage('cookies') });
})();

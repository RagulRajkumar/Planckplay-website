(() => {
  'use strict';
  const { html, href, config, pageMeta, Layout, Section, PageHero, SectionHeader, CapabilityCard, EngagementPanel, CTASection } = PP;
  const { capabilities, engagement } = PP.site;

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  function render() {
    const review = config.reviewMode;
    const caps = capabilities.filter((c) => review || !c.pending).map((c) => ({ ...c, id: slug(c.name) }));
    return Layout({
      current: 'capabilities',
      children: html`
        ${PageHero({ eyebrow: 'Capabilities', title: 'Electronics, mechanics, software and AI in one team.',
          lede: 'The technologies our team works with, grouped by discipline. Integration between them is handled inside the team, not across vendors.' })}

        ${Section({ id: 'disciplines', theme: 'white', children: html`
          <div data-reveal>${SectionHeader({ label: 'By discipline', title: 'What we work with',
            lede: 'Describe the problem rather than the technology and we will tell you plainly whether it fits.', linkLabel: 'Talk to an engineer', linkHref: href('contact', 'engineer') })}</div>
          <div class="grid-auto" style="--min:280px" data-reveal>${caps.map((item) => CapabilityCard({ item }))}</div>
          ${review ? html`<p class="review-note"><span class="review-note__badge">confirm</span>Review view: dashed items await confirmation and are hidden on the live site until approved.</p>` : ''}` })}

        ${Section({ id: 'engagement', theme: 'paper', children: html`
          <div data-reveal>${SectionHeader({ label: 'Engagement models', title: 'Five ways to work with us',
            lede: 'We recommend a model after discovery, based on the technical risk, the scope and your timeline.' })}</div>
          <ul class="engagement-list engagement-list--white" data-reveal>${engagement.map(EngagementPanel)}</ul>` })}

        ${CTASection()}`,
    });
  }

  PP.pages.Capabilities = { key: 'capabilities', ...pageMeta('capabilities'), render };
})();

(() => {
  'use strict';
  const { html, href, pageMeta, numberWord, Layout, Section, PageHero, SectionHeader, DetailRow, ProcessTimeline, CTASection } = PP;
  const { services, deliverySteps, deliveryBrackets } = PP.site;

  const render = () => Layout({
    current: 'solutions',
    children: html`
      ${PageHero({ eyebrow: 'Solutions', title: `${numberWord(services.length, true)} ways to engage our engineers.`,
        lede: 'From feasibility studies and prototypes to ERP, CRM and factory systems, end-to-end software and dedicated engineering teams. Each service runs on its own or as one stage of an end-to-end project.',
        primaryLabel: 'Discuss your project', primaryHref: href('contact') })}

      ${Section({ id: 'services', theme: 'paper', children: html`
        <div class="detail-list">
          ${services.map((s) => DetailRow({ id: s.id, title: s.title, text: s.summary,
            linkLabel: 'Discuss this', linkHref: href('contact', 'engineer') }))}
        </div>` })}

      ${Section({ id: 'delivery', theme: 'dark-raised', innerClass: 'section-inner--wide-gap', children: html`
        <div data-reveal>${SectionHeader({ label: 'How delivery works', title: 'From your requirement to a supported system',
          lede: `${numberWord(deliverySteps.length, true)} stages, each with a named output. You receive a written proposal with the scope, phases and timeline before any build work starts.`,
          linkLabel: 'Submit an RFP', linkHref: href('contact', 'rfp') })}</div>
        ${ProcessTimeline({ steps: deliverySteps, brackets: deliveryBrackets, breakpoint: 1180 })}` })}

      ${CTASection()}`,
  });

  /**
   * #/solutions/<id> (from the nav flyout, the footer or a home card) marks
   * that solution as selected. The row is revealed without its entrance
   * animation first, so the router's scroll lands exactly on it (a row still
   * mid-animation sits 48px lower and the scroll would stop short).
   */
  function select(anchor, root) {
    const rows = Array.from(root.querySelectorAll('#services .detail-row'));
    rows.forEach((r) => { r.classList.remove('is-target'); r.removeAttribute('aria-current'); });
    const row = anchor && rows.find((r) => r.id === anchor);
    if (!row) return;
    row.style.transition = 'none';
    row.classList.add('is-in', 'is-target');
    row.setAttribute('aria-current', 'true');
    void row.offsetHeight;          // apply the revealed state now
    row.style.transition = '';
  }

  PP.pages.Solutions = {
    key: 'solutions', ...pageMeta('solutions'), render,
    mount: (root, { anchor }) => select(anchor, root),
    onAnchor: select,
  };
})();

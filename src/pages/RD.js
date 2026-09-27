(() => {
  'use strict';
  const { html, href, pageMeta, Layout, Section, PageHero, SectionHeader, ProcessTimeline, RDKindPanel, DemoFlowCard, CTASection } = PP;
  const { rdSteps, rdKinds, demos } = PP.site;

  const render = () => Layout({
    current: 'rd',
    children: html`
      ${PageHero({ eyebrow: 'R&D approach', title: 'We prove it on the bench before the full build.',
        lede: 'How we run feasibility studies, technology evaluations and proofs-of-concept, and how we de-risk an engineering project before production.',
        primaryLabel: 'Start with a feasibility study', primaryHref: href('contact', 'engineer') })}

      ${Section({ id: 'method', theme: 'dark', className: 'band--glow-top', innerClass: 'section-inner--wide-gap', children: html`
        <div data-reveal>${SectionHeader({ index: '01', label: 'R&D method', title: 'Six steps, with a decision gate',
          lede: 'The risky part is prototyped and validated, with the results written down, before full engineering starts. If the result says stop, we stop.' })}</div>
        ${ProcessTimeline({ steps: rdSteps, loopFrom: 3, loopTo: 4, loopLabel: 'Iterate until proven', gateAfter: 4, gateLabel: 'Go / no-go', breakpoint: 960 })}` })}

      ${Section({ id: 'kinds', theme: 'dark-raised', children: html`
        <div data-reveal>${SectionHeader({ index: '02', label: 'Four kinds of R&D work', title: 'Each one ends in a written output' })}</div>
        <div class="grid-fit" style="--min:250px; gap:32px 24px; --pp-panel: var(--pp-ink-3)" data-reveal>${rdKinds.map(RDKindPanel)}</div>` })}

      ${Section({ id: 'lab', theme: 'dark', children: html`
        <div data-reveal>${SectionHeader({ index: '03', label: 'Built in our lab', title: 'In-house demos you can inspect' })}</div>
        <div class="grid-fit" style="--min:480px" data-reveal>${demos.map((item, i) => DemoFlowCard({ item, n: i + 1 }))}</div>` })}

      ${CTASection({ index: '04' })}`,
  });

  PP.pages.RD = { key: 'rd', ...pageMeta('rd'), render };
})();

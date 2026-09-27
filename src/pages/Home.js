/**
 * Home — Apple product-page structure:
 * hero → highlights gallery → pinned statement → pinned IoT flow →
 * circuit-board showcase → software → pinned approach →
 * industries carousel → closing CTA.
 */
(() => {
  'use strict';
  const { html, pageMeta, Layout, HomeHero, Highlights, Statement, IoTFlow, ZoomReveal, SoftwareShowcase,
    ApproachPinned, IndustryCarousel, CTASection } = PP;
  const C = PP.homeContent;

  PP.pages.Home = {
    key: 'home',
    ...pageMeta('home'),
    render: () => Layout({
      current: 'home',
      children: html`
        ${HomeHero()}
        ${Highlights({ items: C.highlights })}
        ${Statement({ text: C.statement })}
        ${IoTFlow({ nodes: C.iotNodes })}
        ${ZoomReveal({ features: C.electronics })}
        ${SoftwareShowcase({ list: C.software })}
        ${ApproachPinned({ stages: C.approach })}
        ${IndustryCarousel({ items: C.industries })}
        ${CTASection({ label: 'Start a project', title: 'Have an idea worth building?',
          lede: 'Send a short description or a full RFP. An engineer reads it, not a sales team.' })}`,
    }),
  };
})();

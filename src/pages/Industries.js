(() => {
  'use strict';
  const { html, href, pageMeta, Layout, Section, PageHero, DetailRow, CTASection } = PP;
  const { industries } = PP.site;

  const render = () => Layout({
    current: 'industries',
    children: html`
      ${PageHero({ eyebrow: 'Industries', title: 'The problems we solve, by industry.',
        lede: 'The everyday problems we hear from each sector, and what we do about them, in plain words. If your sector is not listed, describe the problem: the engineering usually carries over.' })}

      ${Section({ id: 'sectors', theme: 'paper', children: html`
        <div class="detail-list">
          ${industries.map((i) => DetailRow({ id: i.id, index: i.index, title: i.name, text: i.who,
            label: 'Problems we solve', points: i.points,
            tags: i.capabilities, tagsLabel: 'Skills involved', linkLabel: 'Talk to an engineer', linkHref: href('contact', 'engineer') }))}
        </div>` })}

      ${CTASection({ index: '02' })}`,
  });

  PP.pages.Industries = { key: 'industries', ...pageMeta('industries'), render };
})();

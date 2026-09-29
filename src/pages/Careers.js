(() => {
  'use strict';
  const { html, icon, href, pageMeta, Layout, Section, PageHero, SectionHeader } = PP;
  const { company } = PP.site;

  const tracks = [
    { id: 'roles', icon: 'users', title: 'Open roles', text: 'Engineering roles across electronics, firmware, mechanical design, software and QA.', note: 'Tell us which discipline you work in' },
    { id: 'trainee', icon: 'flask', title: 'Graduate Engineer Trainee programme', text: 'A paid programme for new engineering graduates, working on real projects under our engineers.', note: 'Paid · for new engineering graduates' },
    { id: 'internships', icon: 'code', title: 'Internships', text: 'Internships for engineering students who want to build and test real hardware and software.', note: 'For current engineering students' },
  ];

  const render = () => Layout({
    current: 'careers',
    children: html`
      ${PageHero({ eyebrow: 'Careers', title: 'Build real systems with us.',
        lede: 'Join our engineering team. Open roles, a paid Graduate Engineer Trainee programme and internships for engineering students.' })}

      ${Section({ id: 'tracks', theme: 'paper', children: html`
        <div data-reveal>${SectionHeader({ label: 'Ways to join', title: 'Three ways in' })}</div>
        <div class="grid-fit" style="--min:300px" data-reveal>
          ${tracks.map((t) => html`
            <div class="pp-card careers-card" id="${t.id}">
              ${icon(t.icon, { size: 28, color: 'var(--pp-red)' })}
              <h3 class="pp-card__title">${t.title}</h3>
              <p class="pp-card__body">${t.text}</p>
              <span class="careers-card__note">${t.note}</span>
            </div>`)}
        </div>` })}

      ${Section({ id: 'apply', theme: 'dark', children: html`
        <div data-reveal>${SectionHeader({ label: 'Apply', title: 'Send us what you have built',
          lede: 'A CV and one project you are proud of, with what you did on it. Hardware, code, drawings or a test report all count.' })}</div>
        <div class="btn-row" data-reveal>
          <a class="btn btn-primary btn-pill btn-lg" href="mailto:${company.careersEmail}?subject=${encodeURIComponent('Job application · Planck Play')}" data-magnetic>${icon('mail', { size: 18 })}Email your CV</a>
          <a class="btn btn-secondary btn-pill btn-lg" href="${href('contact')}">Ask a question first</a>
        </div>` })}`,
  });

  PP.pages.Careers = { key: 'careers', ...pageMeta('careers'), render };
})();

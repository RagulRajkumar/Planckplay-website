(() => {
  'use strict';
  const { html, href, pageMeta, numberWord, Layout, Section, PageHero, SectionHeader, WhyPanel, ImageSlot, RegistrationList, CTASection } = PP;
  const { company, whyUs, registrations } = PP.site;

  const disciplines = ['Electronics', 'Firmware', 'Mechanical design', 'Software', 'Test automation', 'Applied AI', 'SAP', 'Design'];

  function render() {
    const regs = RegistrationList({ items: registrations }); // '' when nothing is visible
    return Layout({
    current: 'about',
    children: html`
      ${PageHero({ eyebrow: 'About Planck Play', title: 'Different minds. One engineering vision.', lede: company.oneLine })}

      ${Section({ id: 'story', theme: 'paper', children: html`
        <div data-reveal>${SectionHeader({ label: 'Who we are', title: 'Specialists in every discipline, one team',
          lede: 'Planck Play brings together specialists with complementary expertise. We started the company to take on complex technical challenges and deliver end-to-end solutions.' })}</div>
        <div class="tag-list about-disciplines" data-reveal>${disciplines.map((d) => html`<span class="tech-tag">${d}</span>`)}</div>` })}

      ${Section({ id: 'commitments', theme: 'dark', children: html`
        <div data-reveal>${SectionHeader({ label: 'How we work', title: `${numberWord(whyUs.length, true)} commitments, in writing`,
          lede: 'They apply to every engagement, whatever its size, and they go into the proposal.' })}</div>
        <div class="grid-fit" style="--min:320px; gap:16px" data-reveal>
          ${whyUs.map((w) => html`<div class="why-with-key">${WhyPanel(w)}<span class="why-with-key__key">${w.key}</span></div>`)}
        </div>` })}

      ${company.team.length ? Section({ id: 'team', theme: 'white', children: html`
        <div data-reveal>${SectionHeader({ label: 'Team', title: 'The founding team' })}</div>
        <div class="grid-auto team-grid" style="--min:240px; gap:40px 20px" data-stagger>
          ${company.team.map((m, i) => html`
            <article class="team-card">
              <div class="team-card__photo">${ImageSlot({ id: `team-${i + 1}`, placeholder: m.name, src: m.photo, alt: m.name, iconName: 'users' })}</div>
              <h3 class="team-card__name">${m.name}</h3>
              <span class="team-card__role">${m.role}</span>
              ${m.expertise ? html`<span class="team-card__exp mono">${m.expertise}</span>` : ''}
            </article>`)}
        </div>` }) : ''}

      ${regs ? Section({ id: 'registrations', theme: 'dark-raised', children: regs }) : ''}

      ${CTASection({ label: 'Work with us', title: 'Talk directly to the engineers doing the work.' })}`,
    });
  }

  PP.pages.About = { key: 'about', ...pageMeta('about'), render };
})();

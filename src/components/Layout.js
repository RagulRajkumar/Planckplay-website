/**
 * Layout — page shell: skip link, the sticky GlobalNav, <main>, Footer.
 * Section — a themed full-width band with the standard inner container.
 */
(() => {
  'use strict';
  const { html, GlobalNav, Footer, BackToTop } = PP;
  const { pages } = PP.site;

  function Layout({ current, children }) {
    return html`
      <div class="page">
        <a class="skip-link" href="#main">Skip to content</a>
        ${GlobalNav({ current })}
        <main id="main">${children}</main>
        ${Footer()}
        ${BackToTop()}
      </div>`;
  }

  function Section({ id, theme = 'dark', label, className = '', innerClass = '', children }) {
    return html`
      <section ${id ? html`id="${id}"` : ''} class="band theme-${theme} ${className}" ${label ? html`aria-label="${label}"` : ''}>
        <div class="section-inner ${innerClass}">${children}</div>
      </section>`;
  }

  /** Title + meta description for a page key, from site-content.js. */
  function pageMeta(key) {
    const p = pages.find((x) => x.key === key) || {};
    return { title: p.title || 'Planck Play', description: p.meta || '' };
  }

  Object.assign(PP, { Layout, Section, pageMeta });
})();

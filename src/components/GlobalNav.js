/**
 * GlobalNav — thin top bar (scrolls away, like apple.com's global nav).
 * Desktop ≥1068px: links + "Solutions" flyout panel with a blurred backdrop.
 *   "Solutions" is a real link: hovering (or ArrowDown) opens the flyout,
 *   clicking goes to the Solutions page. Picking a solution in the flyout goes
 *   to #/solutions/<id>, which scrolls to and highlights that solution.
 * Mobile: burger → full-screen menu with staggered links + Solutions accordion.
 * @param {{ current?: string }} props
 */
(() => {
  'use strict';
  const { html, icon, href, defineBehavior, Brand, numberWord } = PP;
  const { nav, services, company } = PP.site;
  const DESKTOP = '(min-width: 1068px)';

  function GlobalNav({ current = 'home' } = {}) {
    const [solutions, ...links] = nav;
    const cur = (k) => (current === k ? 'page' : 'false');
    const mobileLinks = [...links, { key: 'contact', label: 'Contact', href: href('contact') }];

    return html`
      <header class="gnav" data-behavior="gnav">
        <div class="gnav__bar">
          <a class="gnav__logo" href="${href('home')}" aria-label="Planck Play, home">${Brand()}</a>
          <nav class="gnav__links" aria-label="Primary">
            <a class="gnav__link" href="${solutions.href}" aria-haspopup="true" aria-expanded="false" aria-controls="gnav-flyout" aria-current="${cur('solutions')}" data-flyout-toggle>
              ${solutions.label}${icon('chevronDown', { size: 14, className: 'gnav__chev' })}
            </a>
            ${links.map((l) => html`<a class="gnav__link" href="${l.href}" aria-current="${cur(l.key)}" data-flyout-close>${l.label}</a>`)}
          </nav>
          <a class="gnav__cta" href="${href('contact')}" data-flyout-close data-magnetic>Let’s talk</a>
          <button type="button" class="gnav__burger" aria-label="Open menu" aria-expanded="false" aria-controls="gnav-menu" data-menu-toggle>
            <span></span><span></span>
          </button>
        </div>

        <div id="gnav-flyout" class="gnav__flyout" data-flyout>
          <div class="gnav__flyout-inner">
            <div>
              <p class="gnav__flyout-label">Solutions · ${numberWord(services.length)} ways to engage</p>
              <div class="gnav__flyout-grid">
                ${services.map((s, i) => html`
                  <a class="gnav__flyout-item" href="${s.href}" style="--i:${i}" data-close-all>
                    <span class="gnav__flyout-index">S-${s.index}</span>
                    <span class="gnav__flyout-title">${s.short}</span>
                  </a>`)}
              </div>
            </div>
            <aside class="gnav__flyout-aside">
              <p class="gnav__flyout-label">Not sure where it fits?</p>
              <p>Describe the problem. An engineer will tell you which service applies, or whether we are the right team for it.</p>
              <a class="link-arrow" href="${href('contact', 'engineer')}" data-close-all>Talk to an engineer ${icon('chevronRight', { size: 16 })}</a>
              <a class="link-arrow" href="${href('solutions')}" data-close-all>All solutions ${icon('chevronRight', { size: 16 })}</a>
            </aside>
          </div>
        </div>
        <div class="gnav__scrim" data-flyout-scrim></div>

        <div id="gnav-menu" class="gnav__menu" role="dialog" aria-modal="true" aria-label="Site menu" data-menu>
          <nav class="gnav__menu-nav" aria-label="Mobile">
            <button type="button" class="gnav__menu-link" aria-expanded="false" data-sol-toggle style="--i:0">
              <span>${solutions.label}</span>${icon('chevronDown', { size: 24, className: 'gnav__chev' })}
            </button>
            <div class="gnav__menu-sub" hidden data-sol-panel>
              <a href="${solutions.href}" data-menu-close>All solutions</a>
              ${services.map((s) => html`<a href="${s.href}" data-menu-close>${s.short}</a>`)}
            </div>
            ${mobileLinks.map((l, i) => html`<a class="gnav__menu-link" href="${l.href}" aria-current="${cur(l.key)}" style="--i:${i + 1}" data-menu-close>${l.label}</a>`)}
          </nav>
          <div class="gnav__menu-foot">
            <a class="btn btn-primary btn-pill btn-lg" href="${href('contact')}" data-menu-close>Let’s talk</a>
            ${PP.known(company.email) ? html`<a class="gnav__menu-mail mono" href="mailto:${company.email}">${company.email}</a>` : ''}
          </div>
        </div>
      </header>`;
  }

  defineBehavior('gnav', (root) => {
    const q = (s) => root.querySelector(s);
    const flyout = q('[data-flyout]'), toggle = q('[data-flyout-toggle]'), scrim = q('[data-flyout-scrim]');
    const menu = q('[data-menu]'), burger = q('[data-menu-toggle]');
    const solBtn = q('[data-sol-toggle]'), solPanel = q('[data-sol-panel]');
    const mq = window.matchMedia(DESKTOP);
    let timer = 0;
    const offs = [];
    const on = (el, ev, fn, opt) => { if (!el) return; el.addEventListener(ev, fn, opt); offs.push(() => el.removeEventListener(ev, fn, opt)); };

    const setFly = (open) => {
      if (open && !mq.matches) return;
      root.classList.toggle('flyout-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    const setSol = (open) => { solPanel.hidden = !open; solBtn.setAttribute('aria-expanded', String(open)); };
    const setMenu = (open) => {
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (!open) setSol(false);
    };

    on(toggle, 'mouseenter', () => { clearTimeout(timer); setFly(true); });
    // Click follows the link to the Solutions page; just close the panel.
    on(toggle, 'click', () => { clearTimeout(timer); setFly(false); });
    on(toggle, 'keydown', (e) => {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault(); setFly(true);
      const first = flyout.querySelector('a'); if (first) setTimeout(() => first.focus(), 60);
    });
    on(flyout, 'mouseenter', () => clearTimeout(timer));
    on(root, 'mouseleave', () => { clearTimeout(timer); timer = setTimeout(() => setFly(false), 200); });
    on(scrim, 'click', () => setFly(false));
    on(scrim, 'mouseenter', () => { clearTimeout(timer); timer = setTimeout(() => setFly(false), 120); });
    on(window, 'scroll', () => { if (root.classList.contains('flyout-open')) setFly(false); }, { passive: true });
    on(burger, 'click', () => setMenu(!root.classList.contains('menu-open')));
    on(solBtn, 'click', () => setSol(solPanel.hidden));
    on(document, 'keydown', (e) => { if (e.key === 'Escape') { setFly(false); if (root.classList.contains('menu-open')) { setMenu(false); burger.focus(); } } });
    on(mq, 'change', () => { setFly(false); setMenu(false); });
    root.querySelectorAll('[data-flyout-close]').forEach((el) => on(el, 'mouseenter', () => { clearTimeout(timer); setFly(false); }));
    root.querySelectorAll('[data-close-all]').forEach((el) => on(el, 'click', () => { setFly(false); setMenu(false); }));
    root.querySelectorAll('[data-menu-close]').forEach((el) => on(el, 'click', () => setMenu(false)));
    // Mark the solution currently shown (#/solutions/<id>) in the flyout and mobile menu.
    const syncSelected = () => root.querySelectorAll('.gnav__flyout-item, .gnav__menu-sub a').forEach((a) => {
      const sel = a.getAttribute('href') === location.hash;
      a.classList.toggle('is-current', sel);
      if (sel) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    syncSelected();
    on(window, 'hashchange', syncSelected);
    return () => { clearTimeout(timer); offs.forEach((f) => f()); document.documentElement.style.overflow = ''; };
  });

  Object.assign(PP, { GlobalNav });
})();

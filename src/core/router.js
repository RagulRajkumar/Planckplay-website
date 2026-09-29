/**
 * Hash router — works from file:// and any static host with no rewrites.
 *   #/                        → home
 *   #/solutions               → solutions page
 *   #/solutions/embedded-iot  → solutions page, scrolled to #embedded-iot
 *
 * Page object: { key, title, description, render(route), mount?(root, route),
 *                onAnchor?(anchor, root) }
 */
(() => {
  'use strict';
  const pages = new Map();
  let outlet = null, current = null, cleanups = [];

  const href = (key = 'home', anchor = '') => `#/${key === 'home' && !anchor ? '' : key}${anchor ? `/${anchor}` : ''}`;

  function registerPages(list) {
    list.forEach((p) => {
      if (!p || !p.key || typeof p.render !== 'function') throw new Error('Invalid page: ' + (p && p.key));
      pages.set(p.key, p);
    });
  }
  function parseHash(hash = location.hash) {
    if (!hash || hash === '#' || hash === '#/') return { key: 'home', anchor: '' };
    if (!hash.startsWith('#/')) return null;
    const [key, anchor = ''] = hash.slice(2).split('/');
    return { key: key || 'home', anchor: decodeURIComponent(anchor) };
  }
  function scrollToAnchor(anchor, smooth) {
    const el = anchor && document.getElementById(anchor);
    if (!el) return false;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    return true;
  }
  function setMeta(page) {
    document.title = page.title || 'Planck Play';
    const d = document.querySelector('meta[name="description"]');
    if (d && page.description) d.setAttribute('content', page.description);
    document.documentElement.dataset.page = page.key;
  }

  function navigate() {
    const route = parseHash();
    if (!route) return;
    const page = pages.get(route.key) || pages.get('404');
    if (current && current.page === page) {
      if (!scrollToAnchor(route.anchor, true) && !route.anchor) window.scrollTo({ top: 0, behavior: 'smooth' });
      if (page.onAnchor) page.onAnchor(route.anchor, outlet);
      return;
    }
    const swap = () => {
      cleanups.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
      cleanups = [];
      document.documentElement.style.overflow = '';
      outlet.innerHTML = String(page.render(route));
      setMeta(page);
      window.scrollTo(0, 0);
      cleanups.push(...PP.mountBehaviors(outlet));
      const c = page.mount && page.mount(outlet, route);
      if (typeof c === 'function') cleanups.push(c);
      cleanups.push(PP.fx.mount(outlet));
      PP.blendSections(outlet);
      current = { page, route };
      requestAnimationFrame(() => {
        scrollToAnchor(route.anchor, false);
        outlet.classList.remove('is-leaving');
        outlet.classList.add('is-entering');
        setTimeout(() => outlet.classList.remove('is-entering'), 700);
      });
    };
    // Page transition: quick fade-out of the old page, then swap.
    if (current && PP.motionEnabled()) { outlet.classList.add('is-leaving'); setTimeout(swap, 220); }
    else swap();
  }

  /** Plain "#id" links scroll in-page without replacing the route in the URL. */
  function onClick(e) {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const h = a.getAttribute('href');
    if (h.startsWith('#/') || h === '#') return;
    const el = document.getElementById(h.slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: PP.motionEnabled() ? 'smooth' : 'auto', block: 'start' });
  }

  function startRouter(el) {
    outlet = el;
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', onClick);
    navigate();
  }
  Object.assign(PP, { href, registerPages, parseHash, startRouter });
})();

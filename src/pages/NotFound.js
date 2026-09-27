(() => {
  'use strict';
  const { html, href, Layout, PageHero } = PP;

  PP.pages.NotFound = {
    key: '404',
    title: 'Page not found | Planck Play',
    description: 'The page you were looking for does not exist.',
    render: () => Layout({
      current: '',
      children: html`${PageHero({ eyebrow: 'Error 404', title: 'This page does not exist.',
        lede: 'The link may be old, or the page may have moved.', primaryLabel: 'Go to the home page', primaryHref: href('home') })}`,
    }),
  };
})();

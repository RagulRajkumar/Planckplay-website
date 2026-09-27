/**
 * Site-wide switches. Change these instead of editing components.
 *
 * reviewMode    true  → `pending: true` items in site-content.js show with a dashed
 *                       "confirm" badge (internal review). Set false for production.
 * motion        false → disables every scroll / parallax / entrance animation.
 *                       Visitors with "reduce motion" enabled never get motion anyway.
 * splash        'session' → logo intro plays once per browser session
 *               'always'  → every load     'off' → never
 * Contact form  Nothing is sent from the website. The form prepares an email to
 *               company.email (site-content.js) and opens it in the visitor's mail
 *               app, with Gmail, Outlook on the web and "copy" as alternatives.
 *               No server, account or activation needed; works from file:// too.
 */
(() => {
  PP.config = {
    reviewMode: false,
    motion: true,
    splash: 'session',
  };
})();

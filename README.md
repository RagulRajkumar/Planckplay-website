# Planck Play LLP — website

Open **`index.html`** directly in a browser (double-click it). No server and
no build step, and the contact form works from the file too. It also deploys
as-is to any static host (S3 + CloudFront, GitHub Pages, Vercel, Nginx).

> No internet is needed to browse: fonts, images and code are all local.
> The site makes zero third-party requests. The contact form sends nothing itself: it prepares an email the visitor sends.

**Fonts:** Apple devices render **SF Pro**, Apple's own font, through the
system font stack; this is the only licensed way to use SF Pro on the web.
Every other device gets **Inter**, the closest open equivalent (SIL OFL,
licence in `assets/fonts/`). Inter is embedded in `styles/fonts.css`, so it
loads offline and from `file://`.

## What's in it

**Design language:** Apple Pro product pages — black ground with light
`#f5f5f7` bands, huge tight headlines, one sticky frosted navigation bar, and
motion tied to scroll position.

**Home, top to bottom:**
1. Brand loader: the mark inside a hairline ring that fills with real loading progress, the wordmark and a percentage; when loading completes it lifts away (min ~1.2 s, capped at 4 s).
2. Hero ("Engineering What's Next."): copy and calls to action on the left, the 3D mark on the right.
   - A circuit-trace canvas that lights up near the cursor.
   - A 3D logo you can drag to spin or click to send a pulse through the traces.
   - Capability chips orbit the logo.
   - On scroll the copy lifts and fades while the logo scales.
3. "Get the highlights." gallery.
   - Snap-scrolling cards, pill pagination and a play/pause autoplay.
   - The cards and the pagination respond to the arrow keys.
4. Pinned statement: the words light up one by one as you scroll.
5. Pinned "Connect Everything.": the six IoT nodes light in sequence.
6. "Designed down to the trace.": a realistic board shown in a viewer.
   - Matte-black solder mask, gold pads, real packages (QFP microcontroller, QFN power IC with
     exposed pad, shielded RF module with a PCB antenna, SOIC ADC and flash), passives, crystal,
     USB-C, debug header, power rails, via stitching, fiducials, test points and silkscreen.
   - A layer switch shows the assembled board, its copper, or its silkscreen.
   - Plain-language callouts, plus a legend below; hovering an entry highlights that chip.
7. Software, end to end (plan → design → build → test → cloud hosting → support), with parallax depth between the browser, phone and terminal.
8. Pinned "Think. Engineer. Build. Scale.": a stepped sequence with a giant counter.
9. Industries carousel.
10. Closing CTA with the animated logo rising behind it.

**Solutions:** the nav's "Solutions" link opens the page; hovering it shows the
flyout. `#/solutions/<id>` scrolls to that solution and highlights it, and the
flyout marks it too. The delivery pipeline has one continuous rail that fills
red as you scroll, lighting each stage as the fill reaches it.

**Every inner page** has the animated logo in its hero, replacing the old
line-art drawing. The logo floats, turns in 3D, has two orbiting rings and
tilts toward the pointer.

**Throughout:**
- Elements reveal as they scroll into view.
- Pages fade into each other on navigation.
- A back-to-top button (frosted glass, with a scroll-progress ring) appears after the first screen.
- Buttons lean toward the pointer (magnetic).
- The nav and footer logos spin on hover.

All motion switches off for visitors with "reduce motion" enabled, or when
`config.motion` is `false`.

## Production behaviour

The site is configured for production out of the box (`src/config.js`):

| Setting | Value | Effect |
| --- | --- | --- |
| `reviewMode` | `false` | Unconfirmed (`pending`) technologies and unregistered registrations are hidden. Set `true` for internal review. |
| `splash` | `'session'` | Logo intro once per visit (`'always'` / `'off'`). |
| `motion` | `true` | Master switch for all scroll / parallax effects. |

**Contact form: sent from the visitor's own email.** Nothing is sent from the
website, so there is no mail service, server, account or activation to manage.
When someone presses *Send by email*, the form checks the fields, writes a tidy
email to `company.email` (subject plus every field) and opens it in their mail
app. A confirmation panel then offers the same email through Gmail, Outlook on
the web, or *Copy email*, with a preview. RFPs and drawings are attached in the
mail app (the panel reminds RFP senders). To change the address, edit
`company.email` in `src/data/site-content.js`.

**No placeholder text is ever shown.** Company facts live in `company` in
`src/data/site-content.js`. Any value left empty (`''`) is simply omitted
wherever it would appear: phone, WhatsApp, street address, LLPIN, GSTIN,
Udyam and social links. Fill one in and it appears in the footer and on
Contact automatically. The same applies to `company.team`: the About page
shows team profiles only once entries exist. Photos work the same way: any
card without an `image` shows branded artwork instead.

**Legal pages** (Privacy, Terms, Cookies) describe how the site actually
behaves:
- There are no cookies and no analytics.
- There are no third-party requests while browsing.
- Enquiries are sent from the visitor's own email account.
- A single session-storage flag records that the splash has played.

Have them reviewed by counsel before relying on them, and update the text in
`src/pages/Legal.js` if the site's behaviour changes (for example, if you add
analytics).

## Structure

```
index.html            Entry. Links every stylesheet and loads every script in
                      dependency order (plain <script> tags, not modules, so it
                      works from file://). Contains the splash markup.
assets/images/brand/  Mark, wordmark (split from the logo), logos, favicon; /source = originals
styles/
  design-system.css   "Industry" design system (unchanged)
  theme.css           Brand tokens, spacing scale, type scale, surfaces
  base.css            Layout primitives, type utilities, cards, buttons
  fx.css              Reveal states, page transitions, word highlight
  splash.css          Brand loader
  components/*.css    One per component
  pages/*.css         home.css (all Home sections), inner-pages.css, contact.css
src/
  config.js           Site switches
  core/
    html.js           window.PP namespace + html`` templating (auto-escaping)
    router.js         Hash router (#/page/anchor) with page transitions
    fx.js             Motion engine (see below)
    splash.js         Plays / skips the splash
    behaviors.js      Interactive half of components
    motion.js, icons.js
  data/               site-content.js (the "CMS"), home-content.js
  components/         GlobalNav, Footer, Layout, PageHero, LogoMark (+Brand),
                      HomeHero, Highlights, HomeSections, ArtPanel (+PcbArt), CTASection,
                      cards, ProcessTimeline, ContactForm …
  pages/              Home, Solutions, Industries, Capabilities, RD, About,
                      Careers, Contact, Legal (Privacy/Terms/Cookies), NotFound
```

## The motion engine (`src/core/fx.js`)

Components only add data attributes. The engine does the work:

| Attribute | Effect |
| --- | --- |
| `data-reveal="up\|fade\|scale\|left\|right\|blur\|mask"` | Animates in once when scrolled into view |
| `data-stagger` (on a parent) | Its children reveal one after another |
| `data-parallax="0.2"` | Moves at a different speed from the scroll (don't combine with `data-reveal` on the same element) |
| `data-progress="pin\|view\|exit"` | Writes scroll progress to the CSS variable `--p` (0→1). CSS then drives scale, width and opacity from it |
| `data-steps="4"` | Adds `data-step="0…3"` alongside the progress value |
| `data-words` | The words light up with the progress of the nearest `data-progress` parent |
| `data-count="72"` | Counts up from 0 when revealed |
| `data-magnetic`, `data-spotlight`, `data-tilt` | Pointer interactions |

Progress and parallax values ease toward their target every frame, which
gives scrolling its smooth, weighted feel.

**Making a pinned section:** give the outer section a height (e.g. `300vh`)
and `data-progress="pin"`. Put a child with `position: sticky; top: 0` inside.
Then write CSS from `var(--p)`. See `.iot` and `.zoom__frame` in `home.css`.

## How to…

**Edit copy** — `src/data/*.js`.

**Add a page**
1. Create `src/pages/MyPage.js` that sets `PP.pages.MyPage = { key, title, description, render() }`.
2. Add a `<script>` tag for it in `index.html`.
3. Add it to `registerPages([...])` in the boot script.

**Add a component**
1. Create an IIFE that reads from `PP` and ends with `Object.assign(PP, { MyThing })`.
2. Load it in `index.html` before anything that uses it.

**Add photos** — pass `image:` on a highlight or demo item in the data files.
`ArtPanel` and `ImageSlot` switch to a real `<img>` automatically.

## Optional facts to add later

These fields are hidden until you fill them in, all in `site-content.js`:
- `company.phone`, `company.whatsapp` and `company.address`.
- `llpin`, `gstin` and `udyam`.
- Social URLs.
- `team` profiles.
- Demo and highlight photos (`image:`).
- Registrations, by setting `live: true` on each.

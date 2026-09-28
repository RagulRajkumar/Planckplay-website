/**
 * Home page scroll sections. Each is markup-only; the motion comes from the
 * FX engine (data-progress / data-parallax / data-reveal / data-words) and CSS.
 *   Statement      pinned, words light up as you scroll
 *   IoTFlow        pinned "Connect Everything." — nodes light in sequence (image 1)
 *   ZoomReveal     the circuit board as a pinned 3D model: it tilts, comes
 *                  apart into its layers and names its parts as you scroll
 *   SoftwareShowcase  layered browser / phone / terminal with parallax depth
 *   ApproachPinned pinned four-stage sequence with a giant counter
 *   IndustryCarousel  horizontal snap carousel with prev / next
 */
(() => {
  'use strict';
  const { html, icon, href, defineBehavior, motionEnabled, ArtPanel, Pcb3D } = PP;
  const pad = (n) => String(n).padStart(2, '0');

  const Statement = ({ text }) => html`
    <section class="statement theme-black" data-progress="pin">
      <div class="statement__sticky">
        <p class="statement__text container container--narrow" data-words>${text}</p>
      </div>
    </section>`;

  const IoTFlow = ({ nodes }) => html`
    <section id="iot" class="iot theme-black" data-progress="pin">
      <div class="iot__sticky">
        <div class="iot__glow" aria-hidden="true"></div>
        <div class="container iot__inner">
          <div class="iot__head center" data-stagger>
            <p class="kicker">IoT systems</p>
            <h2 class="headline headline--xl">Connect Everything.</h2>
            <p class="lede">One engineering team from the sensor on the machine to the app in someone’s hand.</p>
          </div>
          <div class="iot__flow">
            <div class="iot__track" aria-hidden="true"><i></i></div>
            ${nodes.map((n, i) => html`
              <div class="iot__node" style="--i:${i}">
                <div class="iot__orb"><span class="iot__orb-lit"></span>${icon(n.icon, { size: 28, color: '#FFFFFF' })}</div>
                <h3 class="iot__name">${n.name}</h3>
                <p class="iot__text">${n.text}</p>
              </div>`)}
          </div>
        </div>
      </div>
    </section>`;

  /** What each chip on the board is, in plain words (legend + hover highlight). */
  const BOARD_PARTS = [
    { key: 'mcu', name: 'MCU', title: 'Microcontroller', text: 'The brain of the board. It runs the firmware we write.' },
    { key: 'pmic', name: 'PMIC', title: 'Power management', text: 'Keeps every part on clean, stable power, from battery or mains.' },
    { key: 'rf', name: 'RF', title: 'Wireless', text: 'Wi-Fi and Bluetooth links to phones, gateways and the cloud.' },
    { key: 'adc', name: 'ADC', title: 'Sensor front-end', text: 'Turns signals from sensors into accurate digital readings.' },
    { key: 'flash', name: 'FLASH', title: 'Memory', text: 'Stores readings, logs and settings, even when power is off.' },
  ];

  /** The scroll story of the 3D board: [kicker, title, text]. */
  const BOARD_STEPS = [
    ['Assembled', 'One board, top side.', 'An example of the connected devices we design: power, sensing, wireless and memory around one microcontroller.'],
    ['Taken apart', 'Every layer, designed.', 'Glass-fibre core, copper, solder mask with gold pads, silkscreen and parts, each one drawn with a purpose.'],
    ['Copper', 'Routed with intent.', 'Matched signal buses, wide power rails and a ring of stitching vias along the edge to keep noise down.'],
    ['Parts', 'Chosen for the job.', 'Pick a part below to see what it does. Every part we choose has a second source, so the board can still be built.'],
  ];

  const ZoomReveal = ({ features }) => html`
    <section id="engineering" class="zoom theme-black">
      <div class="container zoom__head" data-stagger>
        <p class="kicker">PCB &amp; electronics</p>
        <h2 class="headline headline--xl">Designed down<br>to the trace.</h2>
        <p class="lede">From the first schematic to a board that passes its tests, designed and brought up in-house.</p>
      </div>
      ${Pcb3D({ parts: BOARD_PARTS, steps: BOARD_STEPS })}
      <div class="container zoom__features" data-stagger>
        ${features.map(([t, d]) => html`<div class="zoom__feature"><h3>${t}</h3><p>${d}</p></div>`)}
      </div>
    </section>`;

  const SoftwareShowcase = ({ list }) => html`
    <section id="software" class="sw theme-paper">
      <div class="container sw__inner">
        <div class="sw__copy" data-stagger>
          <p class="kicker">Software &amp; automation</p>
          <h2 class="headline">Software, from idea to cloud.</h2>
          <p class="lede">One team for every stage: we plan it, design it, build it, test it, host it in the cloud and keep it running after launch. You don’t have to juggle separate vendors.</p>
          <ul class="sw__list">${list.map((s) => html`<li>${icon('checkCircle', { size: 18, color: 'var(--pp-red)' })}${s}</li>`)}</ul>
        </div>
        <div class="sw__devices" aria-hidden="true" data-reveal="scale">
          <div class="sw__browser" data-parallax="0.04">
            <div class="sw__bar"><i></i><i></i><i></i><b></b></div>
            <div class="sw__body">
              <div class="sw__side"><span class="w70 ink"></span><span class="w85 mt"></span><span class="w60 red"></span><span class="w75"></span><span class="w55"></span></div>
              <div class="sw__main">
                <div class="sw__kpis"><span><em>OEE</em><strong>87%</strong></span><span><em>Uptime</em><strong>99.2%</strong></span><span><em>Alerts</em><strong>3</strong></span></div>
                <div class="sw__chart"><svg viewBox="0 0 400 150" preserveAspectRatio="none"><path class="sw__line" d="M0 110 C40 100 60 70 100 76 S160 112 200 90 S260 36 300 48 S360 80 400 30" fill="none" stroke="#E90B00" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="M0 110 C40 100 60 70 100 76 S160 112 200 90 S260 36 300 48 S360 80 400 30 V150 H0 Z" fill="rgba(233,11,0,.08)"/></svg></div>
              </div>
            </div>
          </div>
          <div class="sw__phone" data-parallax="-0.14"><div><span class="w50"></span><span class="hero"></span><span></span><span></span><span></span></div></div>
          <div class="sw__term" data-parallax="0.12">
            <div class="dim">$ release v2.4</div>
            <div><b>✓</b> tests passed</div><div><b>✓</b> deployed to cloud</div><div><b>✓</b> monitoring live</div>
          </div>
        </div>
      </div>
    </section>`;

  const ApproachPinned = ({ stages }) => html`
    <section id="approach" class="approach theme-white" data-progress="pin" data-steps="${stages.length}">
      <div class="approach__sticky">
        <div class="container approach__grid">
          <div class="approach__left">
            <p class="kicker">Our approach</p>
            <h2 class="headline">Think. Engineer.<br>Build. Scale.</h2>
            <div class="approach__nums" aria-hidden="true">${stages.map((_, i) => html`<span style="--i:${i}">${pad(i + 1)}</span>`)}</div>
          </div>
          <ol class="approach__stages">
            ${stages.map(([t, d], i) => html`
              <li style="--i:${i}">
                <div class="approach__row"><span>${pad(i + 1)}</span><h3>${t}</h3></div>
                <p>${d}</p>
                <div class="approach__bar"><i></i></div>
              </li>`)}
          </ol>
        </div>
      </div>
    </section>`;

  const IndustryCarousel = ({ items }) => html`
    <section id="industries" class="ind theme-black" data-behavior="carousel">
      <div class="container ind__head">
        <div data-stagger>
          <p class="kicker">Industries</p>
          <h2 class="headline">Engineering for every<br>sector that builds.</h2>
        </div>
        <div class="ind__btns">
          <button type="button" aria-label="Previous" data-dir="-1">${icon('chevronLeft', { size: 22 })}</button>
          <button type="button" aria-label="Next" data-dir="1">${icon('chevronRight', { size: 22 })}</button>
        </div>
      </div>
      <div class="ind__track" data-track tabindex="0" role="region" aria-label="Industries">
        ${items.map((it, i) => html`
          <article class="ind__card" data-spotlight>
            ${ArtPanel({ iconName: it.icon, tone: ['red', 'orange', 'amber', 'steel'][i % 4] })}
            <div class="ind__shade"></div>
            <div class="ind__body">
              <span class="ind__n">${it.n} / ${pad(items.length)}</span>
              <h3>${it.name}</h3>
              <p>${it.text}</p>
            </div>
          </article>`)}
      </div>
      <div class="container"><a class="link-arrow" href="${href('industries')}">Problems we solve, by industry ${icon('chevronRight', { size: 18 })}</a></div>
    </section>`;

  defineBehavior('carousel', (root) => {
    const track = root.querySelector('[data-track]');
    const btns = Array.from(root.querySelectorAll('[data-dir]'));
    const step = (dir) => {
      const card = track.firstElementChild;
      track.scrollBy({ left: dir * ((card ? card.getBoundingClientRect().width : 400) + 20), behavior: motionEnabled() ? 'smooth' : 'auto' });
    };
    const sync = () => {
      btns[0].disabled = track.scrollLeft < 8;
      btns[1].disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    };
    const fns = btns.map((b) => () => step(Number(b.dataset.dir)));
    btns.forEach((b, i) => b.addEventListener('click', fns[i]));
    track.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => { btns.forEach((b, i) => b.removeEventListener('click', fns[i])); track.removeEventListener('scroll', sync); };
  });

  Object.assign(PP, { Statement, IoTFlow, ZoomReveal, SoftwareShowcase, ApproachPinned, IndustryCarousel });
})();

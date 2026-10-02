// Copy used only on the Home page. Shared collections (services, capabilities,
// industries…) live in site-content.js.
(() => {
  'use strict';
  const { href } = PP;

  Object.assign(PP.homeContent, {
    hero: {
      eyebrow: '',
      line1: 'Engineering', line2: 'What’s Next.',
      lede: 'Next-generation engineering, technology, IoT and digital solutions built to solve real-world problems.',
    },
    /** Chips orbiting the 3D mark: [wide label, short label, target] */
    orbit: [
      ['Product Engineering', 'Product', '#highlights'], ['IoT & Embedded', 'IoT', '#iot'],
      ['PCB & Electronics', 'PCB', '#engineering'], ['Software', 'Software', '#software'],
      ['Automation & Testing', 'Testing', '#software'], ['AI Systems', 'AI', '#highlights'],
    ],

    highlights: [
      { icon: 'package', title: 'Product engineering', caption: 'Concept to working product. Requirements, architecture, prototypes and production-ready design files.', href: href('solutions', 'rd-prototypes'), tone: 'red' },
      { icon: 'radio', title: 'IoT & embedded systems', caption: 'Firmware, controllers and connected devices that report reliably from the field.', href: href('solutions', 'embedded-iot'), tone: 'orange' },
      { icon: 'cpu', title: 'PCB & electronics', caption: 'Schematics, layout, bring-up, and redesigns when parts go obsolete.', href: href('solutions', 'embedded-iot'), tone: 'amber' },
      { icon: 'code', title: 'Software, end to end', caption: 'From the first screen design to a live, cloud-hosted product, then updates and support after launch.', href: href('solutions', 'software-qa'), tone: 'steel' },
      { icon: 'checkCircle', title: 'Automation & testing', caption: 'Process automation and test automation for web, API and mobile.', href: href('solutions', 'software-qa'), tone: 'red' },
      { icon: 'sparkles', title: 'AI & intelligent systems', caption: 'Machine-data analytics, LLM tools, applied where they earn their place.', href: href('capabilities'), tone: 'orange' },
    ],

    statement: 'Real products fail at the seams between disciplines. We put hardware, firmware and software in one team, so the seams are designed, not discovered.',

    iotNodes: [
      { icon: 'activity', name: 'Sensors', text: 'Custom sensors, designed from scratch and calibrated' },
      { icon: 'cpu', name: 'Devices', text: 'Rugged boards, controllers and firmware for the field' },
      { icon: 'server', name: 'Edge', text: 'Gateways that process and buffer data on site' },
      { icon: 'cloud', name: 'Cloud', text: 'Secure ingestion, storage and APIs' },
      { icon: 'chartLine', name: 'Analytics', text: 'Trends, alerts and insight from machine data' },
      { icon: 'smartphone', name: 'Applications', text: 'Dashboards and phone apps for the people who act' },
    ],

    electronics: [
      ['PCB design', 'Schematic capture, multilayer layout and manufacturing outputs.'],
      ['Electronics development', 'Power, analog and digital circuits designed for the environment they run in.'],
      ['Sensor integration', 'Selecting, interfacing and calibrating sensors for reliable readings.'],
      ['Embedded systems', 'Microcontroller firmware, drivers and communication stacks.'],
      ['Hardware prototyping', 'Bench builds and board spins that prove the risky part first.'],
      ['Product development', 'Enclosure, electronics and firmware carried through to pilot batches.'],
    ],

    software: ['Planning and UI design', 'Web and mobile apps', 'APIs and integrations', 'Automated testing', 'Cloud hosting and deployment', 'Monitoring and support'],

    approach: [
      ['Discover', 'We study the problem, the constraints and what a working result must measure. NDA first.'],
      ['Design', 'Architecture, feasibility and a proof-of-concept of the riskiest part, before the full build.'],
      ['Engineer', 'Hardware, firmware, mechanical and software built and tested together as one system.'],
      ['Scale', 'Pilot, deployment and support as the product and your operation grow.'],
    ],

    /** Same list as the Industries page (site-content.js), so the two never drift apart. */
    industries: PP.site.industries.map((it) => ({ name: it.name, text: it.summary, icon: it.icon, href: it.href })),
  });
})();

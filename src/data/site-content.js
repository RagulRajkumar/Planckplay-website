(() => {
  'use strict';
  const { href } = PP;

  // Planck Play LLP — site content. Stand-in for the CMS: every collection below
  // (services, capabilities, industries, …) is what a CMS would serve.
  // Items flagged `pending: true` are awaiting confirmation from Planck Play and
  // are hidden when config.reviewMode is false. Text in [brackets] is a placeholder.
  //
  // Links use href(pageKey, anchor) from the router, so changing the URL scheme
  // later means editing one function, not this file.
  const pages = [
    { key: 'home', label: 'Home', url: '/',
      title: 'Planck Play LLP | R&D-led engineering company',
      meta: 'Planck Play takes hard technical problems from research and proof-of-concept to production-ready electronics, mechanical designs and software.' },
    { key: 'solutions', label: 'Solutions', url: '/solutions',
      title: 'Engineering solutions: R&D, embedded, CAD, software | Planck Play',
      meta: 'Seven ways to engage our engineers, from feasibility studies and prototypes to ERP, CRM and factory systems, end-to-end software and dedicated engineering teams.' },
    { key: 'rd', label: 'R&D', url: '/rd',
      title: 'Our R&D approach: feasibility, PoCs and validation | Planck Play',
      meta: 'How we run feasibility studies, technology evaluations and proofs-of-concept, and how we de-risk an engineering project before production.' },
    { key: 'capabilities', label: 'Capabilities', url: '/capabilities',
      title: 'Engineering capabilities and technologies | Planck Play',
      meta: 'Embedded and electronics, mechanical CAD, software, AI solutions, quality engineering, cloud and enterprise systems (ERP and CRM): the technologies our team works with, by discipline.' },
    { key: 'industries', label: 'Industries', url: '/industries',
      title: 'Industries we engineer for | Planck Play',
      meta: 'Healthcare, manufacturing, industrial automation, energy, automotive, agriculture and smart infrastructure: the everyday problems we solve in each, explained in plain language.' },
    { key: 'about', label: 'About', url: '/about',
      title: 'About Planck Play LLP',
      meta: 'The specialists behind an R&D-led engineering company. Our mission, engineering philosophy and how we work with clients.' },
    { key: 'careers', label: 'Careers', url: '/careers',
      title: 'Careers: engineering jobs and paid trainee programme | Planck Play',
      meta: 'Join our engineering team. Open roles, a paid Graduate Engineer Trainee programme and internships for engineering students.' },
    { key: 'contact', label: 'Contact', url: '/contact',
      title: 'Contact us or submit an RFP | Planck Play',
      meta: 'Describe your technical problem or upload an RFP, drawings or a specification, and an engineer will get back to you.' },
    { key: 'privacy', label: 'Privacy', url: '/privacy',
      title: 'Privacy policy | Planck Play', meta: 'How Planck Play LLP collects, uses and protects personal data submitted through this website.' },
    { key: 'terms', label: 'Terms', url: '/terms',
      title: 'Terms of use | Planck Play', meta: 'Terms governing the use of the Planck Play LLP website.' },
    { key: 'cookies', label: 'Cookies', url: '/cookies',
      title: 'Cookie policy | Planck Play', meta: 'Which cookies this website uses and how to manage them.' }
  ];

  const nav = [
    { key: 'solutions', label: 'Solutions', href: href('solutions'), mega: true },
    { key: 'industries', label: 'Industries', href: href('industries') },
    { key: 'capabilities', label: 'Capabilities', href: href('capabilities') },
    { key: 'rd', label: 'R&D', href: href('rd') },
    { key: 'about', label: 'About', href: href('about') },
    { key: 'careers', label: 'Careers', href: href('careers') }
  ];

  const services = [
    { id: 'rd-prototypes', title: 'R&D, proof-of-concepts and prototypes',
      short: 'R&D and prototypes',
      summary: 'Feasibility studies, technology evaluation, PoCs and engineering validation before you commit to a full build.' },
    { id: 'embedded-iot', title: 'Embedded and IoT product engineering',
      short: 'Embedded and IoT',
      summary: 'PCB design, firmware, controllers and remote monitoring, including redesigns when parts go obsolete or become hard to source.' },
    { id: 'mechanical-cad', title: 'Mechanical design and CAD',
      short: 'Mechanical design and CAD',
      summary: '3D models, 2D manufacturing drawings, reverse engineering from samples and vendor-approval drawing packs.' },
    { id: 'erp-crm-factory', title: 'ERP, CRM and factory systems',
      short: 'ERP, CRM and factory systems',
      summary: 'CRM to track leads, customers and follow-ups; ERP and SAP integration; machine monitoring and OEE dashboards; and production and inventory apps, all connected so data is entered once.' },
    { id: 'software-qa', title: 'Software, cloud and QA, end to end',
      short: 'Software, cloud and QA',
      summary: 'Every stage of your software in one team: planning, UI design, web and mobile apps, APIs and integrations, automated testing, cloud hosting and deployment, then monitoring, updates and support once it is live.' },
    { id: 'consulting', title: 'Technical consulting',
      short: 'Technical consulting',
      summary: 'An assessment of your existing system, the engineering gaps, and a solution with an implementation plan.' },
    { id: 'engineering-teams', title: 'Dedicated engineering teams',
      short: 'Dedicated engineering teams',
      summary: 'Trained engineers working with your team, under our technical leadership.' }
].map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0'), href: href('solutions', s.id) }));

  const rdSteps = [
    { index: '01', title: 'Problem', text: 'Define the problem, the constraints and what a working result must measure.' },
    { index: '02', title: 'Research', text: 'Study the physics, prior art, parts and standards. Shortlist candidate approaches.' },
    { index: '03', title: 'Prototype', text: 'Build the riskiest part first: a bench rig, a PCB spin, a firmware or software spike.' },
    { index: '04', title: 'Validate', text: 'Test against the success criteria, log the results, and decide: proceed, pivot or stop.' },
    { index: '05', title: 'Engineer', text: 'Turn the proven concept into a production design: drawings, PCBs, firmware, software.' },
    { index: '06', title: 'Deploy', text: 'Install, commission, document and support the system where it runs.' }
  ];

  const rdKinds = [
    { title: 'Feasibility study', text: 'Can it be built, and with which risks? A written answer before you commit to the full build.', output: 'Feasibility report with a recommendation' },
    { title: 'Technology evaluation', text: 'Candidate sensors, controllers, platforms or vendors, compared on the bench against your requirements.', output: 'Comparison matrix and test notes' },
    { title: 'Proof-of-concept', text: 'The smallest working build that proves the riskiest assumption in the project.', output: 'Working PoC and test log' },
    { title: 'Engineering validation', text: 'Structured testing of a prototype against its specification, with every result recorded.', output: 'Validation test report' }
  ];

  const demos = [
    { id: 'pump-monitor', kind: 'Internal demo', title: 'IoT pump monitor with phone dashboard',
      summary: 'Monitors a pump\u2019s running state and streams readings to a dashboard on a phone.',
      flow: ['Pump and sensors', 'Controller', 'Connectivity', 'Phone dashboard'],
      tags: ['PCB design', 'Firmware', 'IoT', 'Mobile app'],
      photo: 'IoT pump monitor on the bench', image: null, icon: 'activity',
      industry: 'Energy', href: href('contact', 'engineer') },
    { id: 'oee-rig', kind: 'Internal demo', title: 'Machine-monitoring rig with live OEE dashboard',
      summary: 'Captures machine signals and calculates OEE (availability \u00d7 performance \u00d7 quality) live on a dashboard.',
      flow: ['Machine signals', 'Edge device', 'Data service', 'OEE dashboard'],
      tags: ['Sensors', 'Edge device', 'Dashboards', 'Factory systems'],
      photo: 'Machine-monitoring rig and OEE screen', image: null, icon: 'chartLine',
      industry: 'Manufacturing', href: href('contact', 'engineer') }
  ];

  const capabilities = [
    { name: 'Embedded and electronics', icon: 'cpu',
      tags: [ { label: 'PCB schematic and layout' }, { label: 'Microcontroller firmware' }, { label: 'ESP32', pending: true }, { label: 'STM32', pending: true },
              { label: 'Sensors and device integration' }, { label: 'IoT connectivity' }, { label: 'MQTT', pending: true }, { label: 'Hardware bring-up and testing' } ] },
    { name: 'Mechanical', icon: 'compass',
      tags: [ { label: '3D CAD' }, { label: '2D drawings with GD&T' }, { label: 'Reverse engineering' }, { label: 'Renders' } ] },
    { name: 'Software', icon: 'code',
      tags: [ { label: 'Web applications' }, { label: 'Backend services and APIs' }, { label: 'Databases' }, { label: 'Mobile apps', pending: true }, { label: 'UI and UX design' }, { label: 'Automation' }] },
    { name: 'AI solutions', icon: 'spark',
      tags: [ { label: 'Machine-data analytics' }, { label: 'Gen AI' }, { label: 'LLM assistants and chatbots' },
              { label: 'Document and data extraction' }, { label: 'AI-powered dashboards' } ] },
    { name: 'Quality engineering', icon: 'check',
      tags: [ { label: 'Web test automation' }, { label: 'API test automation' }, { label: 'Mobile test automation' }, { label: 'Test strategy' }, { label: 'Regression testing' } ] },
    { name: 'Cloud and DevOps', icon: 'cloud',
      tags: [ { label: 'Cloud hosting' }, { label: 'Deployment' }, { label: 'CI/CD' }, { label: 'Backups and security' }, { label: 'Monitoring' } ] },
    { name: 'Enterprise systems', icon: 'building',
      tags: [ { label: 'CRM' }, { label: 'ERP integration' }, { label: 'SAP integration' } ] }
  ];

  const deliverySteps = [
    { index: '01', title: 'Requirement', text: 'Your brief, drawings or RFP' },
    { index: '02', title: 'Technical analysis', text: 'Risks, gaps and open questions' },
    { index: '03', title: 'Solution architecture', text: 'System design and approach' },
    { index: '04', title: 'Proposal', text: 'Written scope, phases and timeline' },
    { index: '05', title: 'R&D or PoC', text: 'Proof of the risky part' },
    { index: '06', title: 'Engineering', text: 'Design files, firmware, code' },
    { index: '07', title: 'Testing and validation', text: 'Test reports against spec' },
    { index: '08', title: 'Deployment', text: 'Installed and commissioned' },
    { index: '09', title: 'Support', text: 'Maintenance and revisions' }
  ];

  const deliveryBrackets = [
    { from: 1, to: 4, label: 'Discovery \u2192 written proposal' },
    { from: 5, to: 8, label: 'Build, prove and deploy' },
    { from: 9, to: 9, label: 'Support' }
  ];

  // Industries (home carousel + Industries page, one list). `summary` is the
  // one-line card text on Home; `who` says who it is for; each point is a
  // problem in the customer's own words, then what we do about it.
  const industries = [
    { id: 'healthcare', name: 'Healthcare', icon: 'activity',
      summary: 'Device electronics, data acquisition and software for medical and laboratory equipment.',
      who: 'For makers of medical, diagnostic and laboratory equipment, and the labs that use it.',
      points: [
        ['Your device needs new electronics, and every design decision has to be traceable.', 'We design the electronics and firmware against written requirements, with design reviews and test records for every change.'],
        ['Readings from lab instruments are copied into spreadsheets by hand.', 'We build data-acquisition systems that capture readings automatically and store them where your team can search and compare them.'],
        ['A key part in your equipment is discontinued.', 'We redesign the board around parts that are easy to buy, and test that the device behaves exactly as before.'],
        ['You need something working to show clinicians, partners or investors.', 'We build a working prototype, with the electronics, enclosure, firmware and app, that people can try.'],
      ],
      capabilities: ['Device electronics', 'Firmware', 'Data acquisition', 'Lab software', 'Prototypes'] },
    { id: 'manufacturing', name: 'Manufacturing', icon: 'chartLine',
      summary: 'Machine monitoring, OEE dashboards, production apps, CRM and ERP integration.',
      who: 'For manufacturing plants, machine builders and fabrication shops.',
      points: [
        ['You don’t know how many hours a day your machines actually run.', 'We fit simple sensors that record running, idle and stopped time, and show it with OEE live on a screen or phone.'],
        ['Production, stock and customer follow-ups live on paper or in spreadsheets.', 'We build shop-floor apps and a CRM that update as work happens, and connect them to your ERP.'],
        ['You have a part that works, but no drawing of it.', 'We measure the sample and create accurate 3D models and 2D manufacturing drawings, so any vendor can make it.'],
        ['Checking every unit before dispatch is slow and depends on one experienced person.', 'We build test rigs that check each unit automatically and record the result against its serial number.'],
      ],
      capabilities: ['Machine monitoring', 'OEE dashboards', 'Production apps', 'CRM and ERP integration', 'Reverse engineering'] },
    { id: 'industrial-automation', name: 'Industrial Automation', icon: 'cpu',
      summary: 'Controllers, sensors and test rigs that keep automated lines measurable.',
      who: 'For automation integrators, panel builders and plants running automated lines.',
      points: [
        ['A line stops and nobody knows why until someone walks over to look.', 'We connect controllers and sensors so stops, faults and counts show up live on a screen or phone.'],
        ['A controller board in your panel is discontinued, or suddenly hard to get.', 'We redesign it around parts that are easy to buy, so the line keeps running and the panel works the same.'],
        ['Every new product needs a test rig, and building one takes weeks.', 'We design and build test rigs and fixtures that check each unit automatically and log every result.'],
        ['Machine data stays locked inside each machine.', 'We add edge devices that collect it and pass it on to your dashboards, historian or ERP.'],
      ],
      capabilities: ['Controller design', 'Sensor integration', 'Test rigs', 'Edge devices', 'Dashboards'] },
    { id: 'energy', name: 'Energy', icon: 'radio',
      summary: 'Remote monitoring for pumps, motors, solar and power equipment.',
      who: 'For makers and operators of pumps, motors, solar and power equipment.',
      points: [
        ['Once equipment leaves your factory, you have no idea whether it is running, faulty or being misused.', 'We add a small connected device that sends running hours, faults and alerts to your phone or a web dashboard.'],
        ['Service engineers travel to a site just to find out what went wrong.', 'Remote readings show the fault before anyone travels, so the right person goes with the right spare part the first time.'],
        ['You only find out how much energy you used when the bill arrives.', 'We meter current, voltage and running hours and show consumption live, per machine or per site.'],
        ['Sites are remote, with unreliable power or network.', 'We design low-power devices that store readings and send them whenever a connection is available.'],
      ],
      capabilities: ['Remote monitoring', 'Energy metering', 'Low-power IoT', 'Controller design', 'Dashboards'] },
    { id: 'automotive', name: 'Automotive', icon: 'compass',
      summary: 'Component drawings, reverse engineering, test fixtures and embedded modules.',
      who: 'For auto-component makers, their suppliers and test labs.',
      points: [
        ['A customer needs drawings of a legacy component that only exists as a sample.', 'We measure it and create 3D models and 2D drawings with GD&T, in the format your customer asks for.'],
        ['Every new part needs a test fixture before it can be approved.', 'We design and build fixtures and test rigs that check each part the same way, every time.'],
        ['An electronic module needs a redesign or a new feature.', 'We design the PCB and firmware for embedded modules and prove them on the bench before production.'],
        ['End-of-line test results are written down by hand.', 'We automate the test and record every result against the part’s serial number.'],
      ],
      capabilities: ['Component drawings', 'Reverse engineering', 'Test fixtures', 'Embedded modules'] },
    { id: 'agriculture', name: 'Agriculture', icon: 'cloud',
      summary: 'Field sensors, pump controllers and low-power connected devices.',
      who: 'For agritech companies, farm-equipment makers and irrigation providers.',
      points: [
        ['Someone has to go to the field just to switch a pump on or off.', 'We build pump controllers that can be switched and scheduled from a phone, with alerts when something goes wrong.'],
        ['Soil, water and weather conditions are guessed rather than measured.', 'We build field sensors that send readings to a phone dashboard, so decisions are based on data.'],
        ['Devices in the field run on batteries or solar, far from power and network.', 'We design low-power devices that last a season and send data over long-range, low-power links.'],
        ['You have a product idea, but nothing working to try on a farm.', 'We build a rugged prototype for field trials, then refine it with what the trial shows.'],
      ],
      capabilities: ['Field sensors', 'Pump controllers', 'Low-power IoT', 'Phone dashboards', 'Prototypes'] },
    { id: 'smart-infrastructure', name: 'Smart Infrastructure', icon: 'building',
      summary: 'Connected sensing and dashboards for buildings, water and utilities.',
      who: 'For building owners, facility managers, and water and utility operators.',
      points: [
        ['Tank levels, pumps and meters are checked by someone walking around.', 'We fit connected sensors that report levels, flow and status on their own, all day.'],
        ['Leaks and equipment failures are found after the damage is done.', 'Sensors raise an alert the moment readings go out of range, so a person can act early.'],
        ['Each building or site keeps its data in a different system.', 'We bring every site into one dashboard, hosted where your team can reach it.'],
        ['You want to prove it on a few sites before rolling it out everywhere.', 'We run a pilot with devices and software built to scale, then roll out what works.'],
      ],
      capabilities: ['Connected sensors', 'Alerts', 'Dashboards', 'Cloud hosting', 'Pilot deployments'] },
  ].map(i => ({ ...i, href: href('industries', i.id) }));

  const whyUs = [
    { title: 'One integrated team', key: 'HW \u00b7 FW \u00b7 MECH \u00b7 SW',
      text: 'Hardware, firmware, mechanical and software engineers in one team, so integration problems are solved in-house.' },
    { title: 'Prototype first', key: 'PoC \u2192 build',
      text: 'We prove the risky part before you commit to the full build.' },
    { title: 'Confidentiality', key: 'NDA first',
      text: 'An NDA before the first technical conversation.' },
    { title: 'Direct access to engineers', key: '1 day \u00b7 72 h',
      text: 'A reply within one working day and a written proposal within 72 hours of discovery.' }
  ];

  const engagement = [
    { title: 'Project-based', icon: 'clipboard', text: 'A defined scope delivered end to end, in clear phases.' },
    { title: 'PoC or prototype sprint', icon: 'flask', text: 'A short, fixed-scope build that answers one technical question.' },
    { title: 'R&D partnership', icon: 'orbit', text: 'A continuing research and development track alongside your product team.' },
    { title: 'Technical consulting', icon: 'search', text: 'An assessment of an existing system, with findings and a plan.' },
    { title: 'Dedicated engineering team', icon: 'users', text: 'Trained engineers inside your team, under our technical leadership.' }
  ];

  // Each slot stays hidden on the live site until the registration is real.
  const registrations = [
    { key: 'udyam', label: 'Udyam', value: '[Udyam no.]', live: false },
    { key: 'gst', label: 'GST', value: '[GSTIN]', live: false },
    { key: 'startuptn', label: 'StartupTN', value: '[StartupTN ID]', live: false },
    { key: 'dpiit', label: 'DPIIT', value: '[DPIIT no.]', live: false },
    { key: 'iso9001', label: 'ISO 9001', value: '[Certificate no.]', live: false }
  ];

  // Company facts. Leave a value empty ('') until it is confirmed: every component
  // checks PP.known(value) and simply omits anything that is empty, so no
  // placeholder text ever reaches the live site.
  const company = {
    name: 'Planck Play LLP',
    oneLine: 'An R&D-led engineering company. Electronics, firmware, mechanical design and software, from first research to deployment.',
    email: 'sales@planckplay.com',
    careersEmail: 'sales@planckplay.com',
    website: 'https://planckplay.com',
    phone: '',
    whatsapp: '',
    address: '',                      // street address; shown in the footer and on Contact once filled in
    legal: 'Planck Play LLP, a limited liability partnership registered in India.',
    llpin: '', gstin: '', udyam: '',
    social: [ { label: 'LinkedIn', href: '' }, { label: 'YouTube', href: '' }, { label: 'GitHub', href: '' } ],
    // Team profiles appear on About only once entries exist:
    // { name: 'A. Kumar', role: 'Partner, Electronics', expertise: 'Power electronics, PCB', photo: 'assets/images/team/a-kumar.jpg' }
    team: [],
  };

  const footerColumns = [
    { title: 'Solutions', links: services.map(s => ({ label: s.short, href: s.href })) },
    { title: 'Explore', links: [
      { label: 'R&D approach', href: href('rd') }, { label: 'Capabilities', href: href('capabilities') },
      { label: 'Industries', href: href('industries') } ] },
    { title: 'Company', links: [
      { label: 'About', href: href('about') }, { label: 'Careers', href: href('careers') },
      { label: 'Contact', href: href('contact') }, { label: 'Submit an RFP', href: href('contact', 'rfp') } ] }
  ];

  const legalLinks = [
    { label: 'Privacy', href: href('privacy') }, { label: 'Terms', href: href('terms') }, { label: 'Cookies', href: href('cookies') }
  ];

  // Facts still needed from Planck Play before production copy is final.
  const openItems = [
    'Founding year',
    'Email, phone and WhatsApp number',
    'Office and registered-office address (for the map)',
    'LLPIN, GSTIN and Udyam numbers',
    'Which registrations are real today: Udyam, GST, StartupTN, DPIIT, ISO 9001',
    'Founder names, roles and photos, with each founder\u2019s approval',
    'Confirmation of the [confirm] technologies: ESP32, STM32, MQTT, mobile apps, Data and AI, Cloud and DevOps',
    'Real details and photos of the two in-house demos',
    'Social profile URLs (LinkedIn, YouTube, GitHub)',
    'Whether a Tamil version of Home and Contact is wanted at launch'
  ];

  Object.assign(PP.site, { pages, nav, services, rdSteps, rdKinds, demos, capabilities, deliverySteps, deliveryBrackets, industries, whyUs, engagement, registrations, company, footerColumns, legalLinks, openItems });
})();

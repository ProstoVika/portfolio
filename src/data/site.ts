/**
 * Single source of truth for site-wide data.
 * Change contacts, links, navigation or copy here — never hard-code them in components.
 */

export const site = {
  name: 'Victoria Sheveria',
  brand: 'Vanadium',
  role: 'Front-End & WordPress Developer',
  location: 'London, UK',
  tagline: 'Making the web stronger.',
  intro:
    'I build fast, accessible websites and the automation behind them, from custom WordPress themes to TypeScript front-ends.',
  description:
    'Portfolio of Victoria Sheveria, front-end and WordPress developer in London. Custom WordPress, TypeScript, React, Angular, performance and automation.',
  email: 'viktoriia.ianuta@gmail.com',
  /** Shown in the menu. Set to '' to hide the phone number. */
  phone: '+44 7385 696993',
  cv: '/cv.pdf',
  source: 'https://github.com/ProstoVika',
  oldPortfolio: 'https://prostovika.github.io/website/',
} as const;

export const socials = [
  { label: 'GitHub', href: 'https://github.com/ProstoVika' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/viktoriia-sheveria-a20446185' },
] as const;

/**
 * About section. Every line here must be true and checkable against the CV.
 * No em dashes in copy.
 */
export const about = {
  lead: 'Commercial WordPress developer with a front-end engineer’s toolkit.',
  facts: [
    { value: '2025', label: 'building client websites, since July' },
    { value: '2 yrs', label: 'mentored training with code review' },
    { value: '4', label: 'public client sites, more under NDA' },
  ],
  chapters: [
    {
      id: 'story',
      title: 'Commercial, every day',
      text: 'Since July 2025 I have been a web developer at The Fox Sales Factory. I design and build client websites in custom WordPress, look after live ones, and fix what breaks in production: mobile layouts, CSS and component conflicts inside themes, slow pages. Clients include leadership consultants and personal brands; some of the work is under NDA.',
    },
    {
      id: 'stack',
      title: 'WordPress, written in code',
      text: 'Mainly custom code, not page builders: Gutenberg blocks, theme and PHP customisation, REST API integrations. I build reusable components, version them in GitHub and bring them into WordPress, so a fix lands once and works everywhere.',
    },
    {
      id: 'mentor',
      title: 'Trained under review',
      text: 'Two years at Foxminded with an experienced developer as my mentor. My features went through his code review, came back with notes, and were reworked until they were right: TypeScript, SCSS, Angular with RxJS and reactive forms, REST APIs, Git. That habit of writing code for the reviewer stayed with me.',
    },
    {
      id: 'automation',
      title: 'Automation as a reflex',
      text: 'If something is done twice, I automate it: social media workflows in Make, Telegram bots, and Threat Detector, a Node.js service that watches Reddit and alerts me in real time.',
    },
    {
      id: 'engineering',
      title: 'An engineer before a developer',
      text: 'I worked as a chemical engineer in a quality lab, then drew technical documentation in AutoCAD, and once ran the accounts of a small business. So I measure before I change, I care about precision, and I understand that a website is there to make a business work.',
    },
    {
      id: 'offscreen',
      title: 'Off screen',
      text: 'Piano, snowboarding and checkers: practice, nerve and thinking a few moves ahead.',
    },
  ],
  approach: [
    { step: 'Measure', text: 'Audit speed, accessibility and SEO before touching code.' },
    { step: 'Fix', text: 'Small, reviewable changes with a clear reason behind each one.' },
    { step: 'Verify', text: 'Re-measure, test on real devices, and leave it easy to maintain.' },
  ],
  skills: [
    { group: 'WordPress', items: ['Custom code', 'Gutenberg', 'PHP', 'Themes and plugins', 'REST API'] },
    { group: 'Front-end', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Angular', 'RxJS', 'Astro'] },
    { group: 'Tooling', items: ['Git', 'GitHub', 'GitLab', 'Webpack', 'Firebase', 'SQL'] },
    { group: 'Quality', items: ['Performance', 'Accessibility', 'Technical SEO', 'Responsive layout'] },
    { group: 'Automation', items: ['Node.js', 'Telegram bots', 'Make', 'Cron jobs'] },
  ],
} as const;

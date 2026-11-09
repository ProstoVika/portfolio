/**
 * Single source of truth for site-wide data.
 * Change contacts, links, navigation or copy here — never hard-code them in components.
 */

export const site = {
  name: 'Viktoriia Sheveria',
  brand: 'Vanadium',
  role: 'Front-End & WordPress Developer',
  location: 'London, UK',
  tagline: 'Making the web stronger.',
  intro:
    'I build fast, accessible websites and the automation behind them — from custom WordPress themes to TypeScript front-ends.',
  description:
    'Portfolio of Viktoriia Sheveria — front-end and WordPress developer in London. Custom WordPress, TypeScript, React, Angular, performance and automation.',
  email: 'viktoriia.ianuta@gmail.com',
  /** Shown in the menu. Set to '' to hide the phone number. */
  phone: '+44 7385 696993',
  cv: '/cv.pdf',
  source: 'https://github.com/ProstoVika',
  oldPortfolio: 'https://prostovika.github.io/website/',
} as const;

export const socials = [
  { label: 'GitHub', href: 'https://github.com/ProstoVika' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/viktoriia-sheveria-a20446185/' },
] as const;

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Lab', href: '/lab' },
  { label: 'Contact', href: '/#contact' },
] as const;

/** The element itself — used by the logo tile. */
export const element = {
  number: 23,
  symbol: 'V',
  name: 'Vanadium',
  mass: '50.942',
} as const;

/**
 * Vanadium ions change colour with oxidation state.
 * These drive the accent-colour switcher (values are tuned in styles/tokens.css).
 */
export const oxidationStates = [
  { id: 'v2', label: 'V²⁺', colour: 'violet' },
  { id: 'v3', label: 'V³⁺', colour: 'green' },
  { id: 'v4', label: 'V⁴⁺', colour: 'blue' },
  { id: 'v5', label: 'V⁵⁺', colour: 'yellow' },
] as const;

export type OxidationState = (typeof oxidationStates)[number]['id'];

/** About section. Every line here must be true and checkable against the CV. */
export const about = {
  story: [
    'I started as a chemical engineer — analysing raw materials and production batches in a quality lab. That is where I learned to measure first and change second.',
    'Since 2025 I have been building and maintaining commercial websites at The Fox Sales Factory: custom WordPress with Gutenberg and PHP, performance and SEO work, and automated workflows in Make.',
    'Before that I trained in front-end development at Foxminded, writing TypeScript, SCSS and Angular under a mentor’s code review.',
  ],
  approach: [
    { step: 'Measure', text: 'Audit speed, accessibility and SEO before touching code.' },
    { step: 'Fix', text: 'Small, reviewable changes with a clear reason behind each one.' },
    { step: 'Verify', text: 'Re-measure, test on real devices, and leave it easy to maintain.' },
  ],
  skills: [
    { group: 'Front-end', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS / SCSS', 'Angular', 'React', 'Astro'] },
    { group: 'WordPress', items: ['Custom themes', 'Gutenberg', 'PHP', 'REST API'] },
    { group: 'Quality', items: ['Performance', 'Accessibility', 'Technical SEO', 'Responsive layout'] },
    { group: 'Automation', items: ['Node.js', 'Telegram bots', 'Make', 'Cron jobs'] },
  ],
} as const;

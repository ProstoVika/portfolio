# Vanadium

Portfolio of **Viktoriia Sheveria** — Front-End & WordPress Developer, London.

> V · 23 · Vanadium — the element that makes steel stronger.

## Stack

- [Astro](https://astro.build) — static site, zero JS by default
- [React](https://react.dev) + TypeScript — interactive islands only
- Content collections — every project is a Markdown file validated by a schema
- Modern CSS — cascade layers, custom properties, no CSS framework

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run validate  # validate generated HTML (run after build)
```

## Structure

```
src/
├── content.config.ts        # schema for project case studies
├── content/projects/        # one .md file = one project
├── data/
│   ├── site.ts              # name, contacts, nav, about copy, oxidation states
│   └── lab.ts               # training projects for the Lab page
├── layouts/BaseLayout.astro # <head>, header, footer
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── ElementTile.astro    # periodic-table tile (logo + project cards)
│   ├── ProjectCard.astro
│   ├── SectionHeading.astro # numbered section titles
│   └── react/               # interactive islands
│       ├── OxidationSwitcher.tsx
│       └── ThreatDetectorDemo.tsx
├── pages/
│   ├── index.astro          # hero, work, about, contact
│   ├── work/[slug].astro    # case study page per project
│   ├── lab.astro            # experiments + old portfolio
│   └── 404.astro
└── styles/
    ├── global.css           # layer order + imports
    ├── reset.css
    └── tokens.css           # design tokens
public/                      # static files (favicon, cv.pdf, images)
```

## Adding a project

Create `src/content/projects/my-project.md`:

```md
---
title: My Project
symbol: Mp
order: 6
summary: One sentence about it.
role: Development
stack: [TypeScript, React]
type: personal   # commercial | personal | nda | training
links:
  live: https://example.com
  code: https://github.com/ProstoVika/my-project
---

The task → what I did → the result.
```

Set `draft: true` to hide it until it is ready.

## Notes

- `<style>` is allowed as flow content in `.htmlvalidate.json`, because Astro inlines a tiny
  `astro-island` style next to the first React island.
- `role="list"` on lists is intentional: Safari/VoiceOver drops list semantics when
  `list-style: none` is applied, so the validator's `no-redundant-role` rule is disabled.

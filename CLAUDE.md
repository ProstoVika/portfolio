# Vanadium — project notes for Claude

Portfolio of Viktoriia Sheveria (Front-End & WordPress Developer, London).
It is used to apply for jobs, so the code itself is part of the portfolio: keep it short, clean and explainable.
The owner writes in Ukrainian — answer in Ukrainian, keep code and commit messages in English.

## Concept
- Brand: **Vanadium** (element V, number 23). Vanadium strengthens steel → tagline "Making the web stronger."
- Projects are shown as periodic-table tiles (`ElementTile.astro`): order = "atomic number", two-letter symbol.
- Accent colour = vanadium oxidation states (V²⁺ violet, V³⁺ green, V⁴⁺ blue, V⁵⁺ yellow),
  switched by `data-oxidation` on `<html>` (tokens in `src/styles/tokens.css`). Default: v4.
- Look (Makhno-inspired palette and type): rosy paper #ece4e1 with generated SVG grain, ink #353535,
  one family (Inter) — contrast by weight 600 vs 300, uppercase labels (`.label`), `.link-line` underline wipe,
  engraved dividers. JetBrains Mono only inside element tiles and tags.
- Inspiration (techniques only, never copy layouts/assets): makhnostudio.com (veil, menu), obys.agency (typography, scroll reveals).

## Stack and rules
- Astro 7 + TypeScript (strict). React only for interactive islands in `src/components/react/`.
- Prefer native platform features over libraries: Popover API, `<details name>`, View Transitions,
  CSS scroll-driven animations, `light-dark()`, cascade layers. No CSS framework, no GSAP unless needed.
- Global CSS: `src/styles/` (layers reset < tokens < base < utilities). Component CSS: scoped `<style>` in each `.astro`.
  Use `:global()` when styling a child component.
- All copy and links live in `src/data/site.ts` and `src/data/lab.ts`; case studies in `src/content/projects/*.md`
  (schema in `src/content.config.ts`, `draft: true` hides a project).
- Dividers use the "engraved" look: `box-shadow: var(--engrave-top|--engrave-bottom)`; in the menu `--menu-engrave`.
- Accessibility is required: semantic HTML, skip link, visible focus, `prefers-reduced-motion`, real `alt` text.
  `role="list"` on unstyled lists is intentional (VoiceOver).

## Gotcha
Keep the hero calm unless the owner asks otherwise. Write scroll-driven animations with longhands (`animation-name`, `animation-timeline`, …), never the `animation`
shorthand: the CSS minifier folds the timeline into the shorthand and browsers drop the rule.

GLSL `smoothstep(a, b, x)` is undefined when a >= b (holes on some GPUs): invert with `1.0 - smoothstep(lo, hi, x)`.

## Honesty
Never invent facts, numbers, dates or results. Every claim must match the CV.
Leave a `<!-- TODO -->` where the owner has to supply a fact.

## Done so far
1. Scaffold, 2. semantic HTML for all pages, 3. styles and tokens,
4. line-drawn V logo (hover/focus: a pen redraws the V — CSS stroke-dashoffset, used everywhere incl. favicon), popover burger menu, portrait hero with feathered edges,
5. Makhno-style menu: blurred backdrop, numbered accordion groups, contacts column, engraved lines; font Inter.
6. Homepage rebuilt: centred bold/light hero + scroll down, endless screenshot marquee (`src/data/gallery.ts`),
   sticky visual + numbered About (01–03), Work, How I work + Toolkit, Contact, back-to-top. Portrait removed for now.

7. Hero veil (current): `src/scripts/veil.ts`, plain TS (~110 lines). The hero starts covered by paper; nine
   ink blots bloom from the lower middle, merge (metaballs + noise-warped edges), and the paper disappears,
   uncovering a dark hero (#151413). 4.5 s, ease-in-out-sine; each blot eases in (smoothstep) so nothing pops;
   rendered at 0.5× resolution (soft edges). Then the canvas REMOVES ITSELF (zero GPU afterwards).
   Reduced motion / no WebGL → canvas removed at once. Hero text and header are white + `mix-blend-mode: difference`
   (dark on paper, white on the dark hero); no `isolation` on .hero. Earlier smoke/photo variants were rejected.

8. Gallery strip: `src/scripts/gallery.ts` — drifts slowly, drag with mouse/touch (inertia), horizontal trackpad
   swipe, arrow keys; resumes after 2 s idle; transform-based (sub-pixel smooth), paused off-screen; a drag never
   triggers a click. Screenshots are full-resolution originals shown at their own aspect ratio (no crop).
   Old portfolio (https://prostovika.github.io/website/) is linked from the Work note, the menu and the Lab page.
9. Homepage = real work only. Gallery (`src/data/gallery.ts`, ≥3 items or hidden): Akash Desai, Royal Cut,
   Brandon Graham, Danielle Hay (live-site links until case studies exist). Work list and menu exclude
   `type: training`. Lab page = grid of training projects with screenshots (`src/assets/lab/`) + 2024 portfolio.
   Case files for Akash Desai, Danielle Hay, Brandon Graham are `draft: true` with TODOs — wait for the owner's facts.

## Next
- Oxidation-state switcher (React).
- Threat Detector interactive demo with recorded sample data.
- `public/cv.pdf`, `public/og-default.png`, final domain in `astro.config.mjs`, GitHub Actions deploy.

## Check before finishing any change
```
npm run build      # astro check + build, must be 0 errors
npm run validate   # HTML validation, must be 0 errors
```

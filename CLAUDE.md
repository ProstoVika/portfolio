# Vanadium — project notes for Claude

Portfolio of Victoria Sheveria (Front-End & WordPress Developer, London).
It is used to apply for jobs, so the code itself is part of the portfolio: keep it short, clean and explainable.
The owner writes in Ukrainian — answer in Ukrainian, keep code and commit messages in English.

## Concept
- Brand: **Vanadium** (element V, number 23). Vanadium strengthens steel → tagline "Making the web stronger."
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

## Copy style
The owner's name is spelled **Victoria Sheveria** everywhere on the site. Do NOT change the email
(viktoriia.ianuta@…) or the LinkedIn URL (…/viktoriia-sheveria-…): those are real addresses.
No em dashes (—) anywhere in visible copy: the owner asked to remove them. Use commas, colons or full stops.

## Honesty
Never invent facts, numbers, dates or results. Every claim must match the CV.
Leave a `<!-- TODO -->` where the owner has to supply a fact.

## Done so far
1. Scaffold, 2. semantic HTML for all pages, 3. styles and tokens,
4. line-drawn V logo (hover/focus: a pen redraws the V — CSS stroke-dashoffset, used everywhere incl. favicon), popover burger menu, portrait hero with feathered edges,
5. Makhno-style menu: blurred backdrop, numbered accordion groups, contacts column, engraved lines; font Inter.
6. Homepage rebuilt: centred bold/light hero + scroll down, endless screenshot marquee (`src/data/gallery.ts`),
   sticky visual + numbered About (01–03), Work, How I work + Toolkit, Contact, back-to-top. Portrait removed for now.

7. Hero = code assembles into "about me": `src/scripts/assemble.ts` (plain TS, no WebGL, no libraries).
   A 2D canvas draws a field of code (this very file via `?raw`) on paper. ~180 characters of a function
   (`src/data/hero-code.ts`, tokens with quiet syntax colours) fly out of the field from spots where the same
   letter is written (Web Animations API: transform/opacity/blur only), and the leftover field blurs and melts
   away (CSS filter + opacity). Final: the function alone on paper; it IS the about-me (true to the CV).
   Visible text is aria-hidden; a visually-hidden <h1> carries the name and role. `html.js` flag (inline script)
   hides characters only when JS runs. Reduced motion → the finished function at once.
   The nature image experiments (veil, smoke, photo, code-to-nature) were removed at the owner's request.

8. Gallery strip: `src/scripts/gallery.ts` — drifts slowly, drag with mouse/touch (inertia), horizontal trackpad
   swipe, arrow keys; resumes after 2 s idle; transform-based (sub-pixel smooth), paused off-screen; a drag never
   triggers a click. Screenshots are full-resolution originals shown at their own aspect ratio (no crop).
   Old portfolio (https://prostovika.github.io/website/) is linked from the Work note, the menu and the Lab page.
9. Homepage = real work only. Gallery (`src/data/gallery.ts`, ≥3 items or hidden): Akash Desai, Royal Cut,
   Brandon Graham, Danielle Hay (live-site links until case studies exist). Work list and menu exclude
   `type: training`. Lab page = grid of training projects with screenshots (`src/assets/lab/`) + 2024 portfolio.
   Case files for Akash Desai, Danielle Hay, Brandon Graham are `draft: true` with TODOs — wait for the owner's facts.

10. About: sticky portrait (`src/assets/portrait.jpg`) on the left (≥64rem), story scrolls on the right:
   lead line, three facts, six chapters (commercial, stack, mentor, automation, engineering, off screen).
   All copy lives in `about` in `src/data/site.ts` and must stay true to the CV. React removed from Toolkit
   (not used); Astro, RxJS, Webpack, Firebase, SQL, Git added from the CV.

11. Selected work list and periodic-table tiles REMOVED (owner: not needed). The gallery strip is now `#work`
   with a short note under it. Menu groups are built from `src/data/gallery.ts` (title field) + Threat Detector,
   About anchors (#story, #stack, #mentor, #approach, #toolkit), CV, Lab. Case pages only for non-training work.
   CV lives at `public/cv.pdf`. Links: GitHub https://github.com/ProstoVika,
   LinkedIn https://www.linkedin.com/in/viktoriia-sheveria-a20446185 (both in `socials`).
   Before finishing, check internal links/anchors in dist (none may be broken).

## Next
- Oxidation-state switcher (React).
- Threat Detector interactive demo with recorded sample data.
- `public/og-default.png`, final domain in `astro.config.mjs`, GitHub Actions deploy.

## Check before finishing any change
```
npm run build      # astro check + build, must be 0 errors
npm run validate   # HTML validation, must be 0 errors
```

/**
 * Hero: a field of code on paper. The letters of my name lift out of it, grow and settle into
 * the title. The rest of the code blurs and melts away, then the paper itself dissolves in ink
 * blots and uncovers the night-forest video.
 *
 * - The field is drawn once on a 2D canvas: this very file, imported as text with ?raw.
 * - Each letter of the name is real text in the page (a <span>), so it stays sharp; it starts
 *   as a tiny glyph at a spot in the field where the same letter is written, and grows into place.
 * - Only transform, opacity and filter are animated — all GPU-composited, no layout work.
 */
import source from './assemble.ts?raw';
import { dissolvePaper } from './ink-veil';

const FONT_SIZE = 11;
const LINE_HEIGHT = 15;
const FONT_FAMILY = '"JetBrains Mono Variable", ui-monospace, monospace';
const FIELD_INK = 0.38; // opacity of the code field
const FLY_MS = 2000;
const STAGGER_MS = 55; // delay between neighbouring letters
const MELT_DELAY_MS = 700;

type Point = { x: number; y: number };

/** Draws the code field and returns where every character was written, grouped by character */
function drawField(canvas: HTMLCanvasElement, ink: string): Map<string, Point[]> {
  const scale = Math.min(devicePixelRatio, 2);
  const { clientWidth: width, clientHeight: height } = canvas;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.fillStyle = ink;
  ctx.globalAlpha = FIELD_INK;

  const charWidth = ctx.measureText('M').width;
  const perRow = Math.ceil(width / charWidth);
  const stream = source.replace(/\s+/g, ' ');
  const spots = new Map<string, Point[]>();

  for (let y = LINE_HEIGHT, at = 0; y < height + LINE_HEIGHT; y += LINE_HEIGHT) {
    for (let col = 0; col < perRow; col++, at++) {
      const char = stream[at % stream.length];
      const point = { x: col * charWidth, y: y - FONT_SIZE };
      ctx.fillText(char, point.x, y);
      if (!spots.has(char)) spots.set(char, []);
      spots.get(char)!.push(point);
    }
  }
  return spots;
}

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/** Plays the background video only while the hero is on screen (and never for reduced motion) */
function manageVideo(hero: HTMLElement, video: HTMLVideoElement, still: boolean) {
  if (still) return video.pause();
  new IntersectionObserver(([entry]) => void (entry.isIntersecting ? video.play() : video.pause())).observe(hero);
}

export async function assembleHero(hero: HTMLElement): Promise<void> {
  const field = hero.querySelector<HTMLCanvasElement>('.code-field')!;
  const paper = hero.querySelector<HTMLCanvasElement>('.paper-veil')!;
  const video = hero.querySelector<HTMLVideoElement>('.hero__video')!;
  const chars = [...hero.querySelectorAll<HTMLElement>('.hero__title [data-char]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  manageVideo(hero, video, still);

  if (still) {
    field.remove();
    paper.remove();
    return void hero.classList.add('is-named', 'is-assembled');
  }

  await document.fonts.load(`${FONT_SIZE}px ${FONT_FAMILY}`);
  const spots = drawField(field, getComputedStyle(hero).color);
  const origin = field.getBoundingClientRect();

  const flights = chars.map((span, i) => {
    const target = span.getBoundingClientRect();
    const from = pick(spots.get(span.textContent!.toLowerCase()) ?? spots.get(span.textContent!) ?? spots.get(' ')!);
    const dx = origin.left + from.x - target.left;
    const dy = origin.top + from.y - target.top;
    const shrink = FONT_SIZE / target.height; // start the size of a glyph in the field
    span.style.transformOrigin = '0 0';

    return span.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${shrink})`, opacity: 0, filter: 'blur(2px)' },
        { opacity: 1, offset: 0.25 },
        { transform: 'none', opacity: 1, filter: 'blur(0)' },
      ],
      {
        duration: FLY_MS + Math.random() * 400,
        delay: 300 + i * STAGGER_MS,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // fast lift-off, long soft landing
        fill: 'backwards',
      },
    ).finished;
  });

  hero.classList.add('is-assembling'); // characters become visible; their animations hold them in place
  setTimeout(() => field.classList.add('is-melting'), MELT_DELAY_MS);

  await Promise.all(flights);
  hero.classList.add('is-named'); // the intro line fades in
  field.remove();
  await dissolvePaper(paper, getComputedStyle(document.documentElement).backgroundColor);
  hero.classList.add('is-assembled');
}

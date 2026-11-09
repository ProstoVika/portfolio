/**
 * Hero: a field of code on paper. Single characters lift out of it, drift to the centre and
 * settle into one function (the "about me"). The rest of the code blurs and melts away.
 *
 * - The field is drawn once on a 2D canvas: this very file, imported as text with ?raw.
 * - Each character of the function is real text in the page (a <span>), so it stays readable,
 *   selectable and sharp; it flies in with a transform from a spot in the field where the same
 *   letter is written.
 * - Only transform, opacity and filter are animated — all GPU-composited, no layout work.
 */
import source from './assemble.ts?raw';

const FONT_SIZE = 11;
const LINE_HEIGHT = 15;
const FONT_FAMILY = '"JetBrains Mono Variable", ui-monospace, monospace';
const FIELD_INK = 0.38; // opacity of the code field
const FLY_MS = 1900;
const STAGGER_MS = 7; // delay between neighbouring characters
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

export async function assembleHero(hero: HTMLElement): Promise<void> {
  const field = hero.querySelector<HTMLCanvasElement>('.code-field')!;
  const chars = [...hero.querySelectorAll<HTMLElement>('.hero__code [data-char]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still) {
    field.remove();
    return void hero.classList.add('is-assembled');
  }

  await document.fonts.load(`${FONT_SIZE}px ${FONT_FAMILY}`);
  const spots = drawField(field, getComputedStyle(hero).color);
  const origin = field.getBoundingClientRect();

  const flights = chars.map((span, i) => {
    const target = span.getBoundingClientRect();
    const from = pick(spots.get(span.textContent!) ?? spots.get(' ')!);
    const dx = origin.left + from.x - target.left;
    const dy = origin.top + from.y - target.top;

    return span.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0, filter: 'blur(3px)' },
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
  hero.classList.add('is-assembled');
  field.remove();
}

/**
 * Paper veil: a sheet of paper over the hero video that dissolves in soft, uneven blots.
 *
 * Plain 2D canvas, no WebGL: each blot is a cluster of radial gradients erased from the paper
 * (destination-out), so its edge is irregular, like ink soaking in. Rendered at half resolution
 * (the edges are soft anyway) and removed as soon as the paper is gone.
 */

const DURATION_MS = 2600;
const FADE_MS = 400; // any paper left in a corner fades out at the end
const RESOLUTION = 0.5;
const BLOTS = 9;
const SATELLITES = 12; // small blots around each big one make the edge organic

interface Blot {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  size: number; // relative to the screen diagonal
  delay: number; // 0..1 of the timeline
}

const nextFrame = () => new Promise<number>(requestAnimationFrame);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const random = (min: number, max: number) => min + Math.random() * (max - min);

/** Big blots around the lower middle, each with a ring of smaller ones */
function planBlots(): Blot[] {
  const blots: Blot[] = [];
  for (let i = 0; i < BLOTS; i++) {
    const main = { x: random(0.1, 0.9), y: random(0.45, 0.95), size: random(0.45, 0.75), delay: i * 0.05 };
    blots.push(main);
    for (let j = 0; j < SATELLITES; j++) {
      const angle = random(0, Math.PI * 2);
      const distance = main.size * random(0.25, 0.5);
      blots.push({
        x: main.x + Math.cos(angle) * distance * 0.6,
        y: main.y + Math.sin(angle) * distance,
        size: main.size * random(0.25, 0.55),
        delay: main.delay + random(0.02, 0.15),
      });
    }
  }
  return blots;
}

export async function dissolvePaper(canvas: HTMLCanvasElement, paper: string): Promise<void> {
  const ctx = canvas.getContext('2d')!;
  const width = (canvas.width = Math.round(canvas.clientWidth * RESOLUTION));
  const height = (canvas.height = Math.round(canvas.clientHeight * RESOLUTION));
  const diagonal = Math.hypot(width, height);
  const blots = planBlots();

  const draw = (progress: number) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';

    for (const { x, y, size, delay } of blots) {
      const radius = easeInOutSine(clamp01((progress - delay) / (1 - delay))) * size * diagonal;
      if (radius < 1) continue;
      const cx = x * width;
      const cy = y * height;
      const blot = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      blot.addColorStop(0, 'rgb(0 0 0 / 1)');
      blot.addColorStop(0.35, 'rgb(0 0 0 / 0.9)');
      blot.addColorStop(1, 'rgb(0 0 0 / 0)'); // long, soft, bleeding edge
      ctx.fillStyle = blot;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
  };

  draw(0);
  canvas.classList.add('is-live'); // the canvas now paints the paper, drop the CSS one

  const start = performance.now();
  for (let t = 0; t < 1; ) {
    t = Math.min(((await nextFrame()) - start) / DURATION_MS, 1);
    draw(t);
  }
  canvas.classList.add('is-done');
  await new Promise((resolve) => setTimeout(resolve, FADE_MS));
  canvas.remove();
}

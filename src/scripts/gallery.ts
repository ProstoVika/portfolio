/**
 * Endless screenshot strip.
 * Drifts slowly on its own; the visitor can drag it with the mouse (with a bit of inertia),
 * swipe on a trackpad or touch screen, or use the arrow keys. After a short pause it drifts again.
 *
 * Moves with a GPU transform, not scrollLeft, so the motion is sub-pixel smooth.
 * The list is rendered twice in the markup, which makes the loop seamless.
 */

const DRIFT_PX_PER_MS = 0.04;
const IDLE_MS = 2000;
const FRICTION = 0.92; // how quickly a flick slows down
const KEY_STEP = 18; // initial speed of an arrow-key nudge, px per frame

export function initGallery(viewport: HTMLElement): void {
  const track = viewport.firstElementChild as HTMLElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let offset = 0;
  let velocity = 0;
  let lastInput = 0;
  let dragX: number | null = null;
  let dragged = 0;
  let hovered = false;
  let visible = true;

  const touch = (dx = 0) => {
    offset += dx;
    lastInput = performance.now();
  };

  // ── Drag (mouse, pen, touch) ──
  viewport.addEventListener('pointerdown', (e) => {
    dragX = e.clientX;
    dragged = 0;
    velocity = 0;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (dragX === null) return;
    const dx = dragX - e.clientX;
    dragX = e.clientX;
    dragged += Math.abs(dx);
    velocity = dx;
    touch(dx);
  });
  const release = () => {
    dragX = null;
    viewport.classList.remove('is-dragging');
  };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('click', (e) => dragged > 6 && e.preventDefault(), true); // a drag is not a click

  // ── Trackpad: horizontal swipes move the strip, vertical ones still scroll the page ──
  viewport.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      touch(e.deltaX);
    },
    { passive: false },
  );

  // ── Keyboard ──
  viewport.addEventListener('keydown', (e) => {
    const direction = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!direction) return;
    e.preventDefault();
    velocity = direction * KEY_STEP;
    touch();
  });
  // Tabbing to a link brings its screenshot into view
  viewport.addEventListener('focusin', (e) => {
    const item = (e.target as Element).closest('li');
    item && touch(item.offsetLeft - offset - 32);
  });

  viewport.addEventListener('pointerenter', (e) => (hovered = e.pointerType === 'mouse'));
  viewport.addEventListener('pointerleave', () => (hovered = false));
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(viewport);

  let last = performance.now();
  const frame = (now: number) => {
    const dt = now - last;
    last = now;

    if (visible) {
      if (dragX === null) {
        velocity *= FRICTION;
        offset += velocity;
        const idle = now - lastInput > IDLE_MS;
        offset += !still && idle && !hovered ? DRIFT_PX_PER_MS * dt : 0;
      }
      const loop = track.scrollWidth / 2; // width of one copy of the list
      offset = ((offset % loop) + loop) % loop;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

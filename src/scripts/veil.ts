/**
 * Hero veil: the page starts covered with paper; the paper dissolves in blots that bloom
 * from the centre, bleed into each other and disappear, uncovering the dark hero.
 *
 * Once the paper is gone the canvas removes itself, so after ~3 s the page costs nothing.
 * Reduced motion or no WebGL → the canvas is removed at once and the hero is simply dark.
 */

const VERTEX = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uPaper;
uniform float uProgress;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f *= f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;          // centred, height = 1, y up

  // Nine blots around the lower middle; each starts a little later and grows at its own pace.
  // The space is warped by noise so the blots are uneven, like ink soaking into paper.
  vec2 q = p + (vec2(fbm(p * 2.0), fbm(p * 2.0 + 4.3)) - 0.5) * 0.35;
  float spread = min(uRes.x / uRes.y / 1.6, 1.0);             // keep blots on narrow (phone) screens
  float field = 0.0;
  for (int i = 0; i < 9; i++) {
    float n = float(i);
    vec2 centre = (vec2(hash(vec2(n, 1.0)), hash(vec2(n, 2.0))) - vec2(0.5, 0.6)) * vec2(1.7 * spread, 0.95);
    float start = n * 0.07;                                    // blots appear one after another
    float grow = smoothstep(start, start + 0.5, uProgress)      // each eases in, no popping
               + max(uProgress - start - 0.5, 0.0);             // then keeps spreading steadily
    float radius = grow * (0.1 + 0.1 * hash(vec2(n, 3.0)));
    vec2 d = q - centre;
    field += radius * radius / (dot(d, d) + 1e-4);           // blots merge like metaballs
  }

  float bleed = (fbm(p * 3.0) - 0.5) * 0.7 + (fbm(p * 14.0) - 0.5) * 0.25; // soft, uneven ink edge
  float dissolved = max(smoothstep(0.6, 1.4, field * (1.0 + bleed)),  // wide, soft edge
                        smoothstep(1.1, 1.4, uProgress));       // last scraps melt away gently

  float paper = 1.0 - dissolved;
  vec3 colour = uPaper + (hash(gl_FragCoord.xy) - 0.5) * 0.03; // paper grain
  gl_FragColor = vec4(colour * paper, paper);                   // premultiplied alpha
}`;

const DURATION_MS = 4500;
const RESOLUTION = 0.5; // the edges are soft, so half resolution looks the same and costs 4× less

const nextFrame = () => new Promise<number>(requestAnimationFrame);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2; // no sudden speed changes

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const program = gl.createProgram()!;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** "rgb(236, 228, 225)" → [0.925, 0.894, 0.882] */
const toVec3 = (rgb: string) => rgb.match(/[\d.]+/g)!.slice(0, 3).map((c) => Number(c) / 255);

export async function dissolveVeil(canvas: HTMLCanvasElement): Promise<void> {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = still ? null : canvas.getContext('webgl', { premultipliedAlpha: true });
  const program = gl ? createProgram(gl) : null;
  if (!gl || !program) return canvas.remove(); // the dark hero underneath is the end state anyway

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const paper = toVec3(getComputedStyle(document.documentElement).backgroundColor);
  gl.uniform3f(uniform('uPaper'), paper[0], paper[1], paper[2]);

  canvas.width = Math.round(canvas.clientWidth * RESOLUTION);
  canvas.height = Math.round(canvas.clientHeight * RESOLUTION);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(uniform('uRes'), canvas.width, canvas.height);

  const uProgress = uniform('uProgress');
  const draw = (progress: number) => {
    gl.uniform1f(uProgress, progress);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  await document.fonts.ready; // start together with the title, not before it
  draw(0);
  canvas.classList.add('is-live'); // the shader now paints the paper, drop the CSS one

  const start = performance.now();
  for (let t = 0; t < 1; ) {
    t = Math.min(((await nextFrame()) - start) / DURATION_MS, 1);
    draw(easeInOutSine(t) * 1.4); // past 1.1 the remaining scraps melt away
  }

  canvas.remove(); // paper is gone — free the GPU
}

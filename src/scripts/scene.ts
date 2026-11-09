/**
 * "Code becomes nature".
 * The hero opens as paper covered in lines of code — dense where the scene is dark, so the
 * forest and the pavilion appear as a silhouette made of code. Then nature grows up from the
 * ground: just ahead of the growing front the code takes on the scene's real colours, behind it
 * the code turns into the photograph.
 *
 * The code on screen is this very file (imported as text with Vite's ?raw).
 * When the scene has grown, the canvas fades out and the plain optimised <img> remains — no GPU work after.
 */
import source from './scene.ts?raw';

const VERTEX = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';

const FRAGMENT = `
precision highp float;
uniform sampler2D uPhoto, uCode;
uniform vec2 uRes;
uniform vec3 uPaper, uInk;
uniform float uGrow, uPhotoAspect;

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
  vec2 uv = gl_FragCoord.xy / uRes;                                   // 0..1, y up

  // The photo, cover-fitted exactly like the <img> underneath (object-fit: cover)
  float canvasAspect = uRes.x / uRes.y;
  vec2 scale = canvasAspect > uPhotoAspect
    ? vec2(1.0, uPhotoAspect / canvasAspect)
    : vec2(canvasAspect / uPhotoAspect, 1.0);
  vec3 photo = texture2D(uPhoto, (uv - 0.5) * scale + 0.5).rgb;

  // Code layer: ink only where the scene is dark, so the scene appears as a silhouette made of code
  float shade = 1.0 - dot(photo, vec3(0.299, 0.587, 0.114));
  float glyph = texture2D(uCode, uv).r;                               // code drawn at screen size, 1:1
  float density = smoothstep(0.3, 0.7, shade);                        // strong contrast: light areas stay empty

  // Growth front rising from the ground, with thin vertical "blades" at its edge
  vec2 p = gl_FragCoord.xy / uRes.y;
  float height = uv.y + (fbm(p * 2.5) - 0.5) * 0.3                    // uneven growth
               + noise(vec2(p.x * 420.0, p.y * 2.0)) * 0.035          // grass blades
               + noise(vec2(p.x * 900.0, 0.0)) * 0.015;               // finer blades
  float front = mix(-0.3, 1.35, uGrow);
  float grown = 1.0 - smoothstep(front - 0.025, front, height);
  float ripening = 1.0 - smoothstep(0.0, 0.18, height - front);      // code just ahead takes on real colour

  vec3 ink = mix(uInk, photo * 0.85, ripening);
  vec3 code = mix(uPaper, ink, glyph * mix(density, 1.0, ripening * 0.6));
  gl_FragColor = vec4(mix(code, photo, grown), 1.0);
}`;

const HOLD_MS = 700; // let the code silhouette be read before it grows
const GROW_MS = 3800;
const FADE_MS = 500;
const CODE_FONT = '11px "JetBrains Mono Variable", ui-monospace, monospace';
const LINE_HEIGHT = 13;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise<number>(requestAnimationFrame);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const toVec3 = (css: string) => css.match(/[\d.]+/g)!.slice(0, 3).map((c) => Number(c) / 255);

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const program = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/**
 * White code on black, drawn at exactly the canvas size (no tiling, no seams).
 * The source is poured in as one continuous stream so every row is full —
 * a dense, even texture lets the scene's silhouette read clearly.
 */
function drawCodeSheet(width: number, height: number, scale: number): HTMLCanvasElement {
  const sheet = document.createElement('canvas');
  sheet.width = width;
  sheet.height = height;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = CODE_FONT.replace(/^\d+/, (size) => String(Number(size) * scale));

  const stream = source.replace(/\s+/g, ' ');
  const perRow = Math.ceil(width / ctx.measureText('M').width);
  const lineHeight = LINE_HEIGHT * scale;
  for (let y = lineHeight, at = 0; y < height + lineHeight; y += lineHeight, at += perRow) {
    const start = at % stream.length;
    ctx.fillText((stream + stream).slice(start, start + perRow), 0, y);
  }
  return sheet;
}

function uploadTexture(gl: WebGLRenderingContext, unit: number, image: TexImageSource) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export async function growScene(canvas: HTMLCanvasElement, photo: HTMLImageElement): Promise<void> {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = still ? null : canvas.getContext('webgl');
  const program = gl ? createProgram(gl) : null;
  if (!gl || !program) return canvas.remove(); // the photo underneath is the end state anyway

  // Photo and code font load in parallel
  await Promise.all([photo.decode(), document.fonts.load(CODE_FONT)]);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const scale = Math.min(devicePixelRatio, 1.5);
  canvas.width = Math.round(canvas.clientWidth * scale);
  canvas.height = Math.round(canvas.clientHeight * scale);
  gl.viewport(0, 0, canvas.width, canvas.height);

  uploadTexture(gl, 0, photo);
  uploadTexture(gl, 1, drawCodeSheet(canvas.width, canvas.height, scale));

  const uniform = (name: string) => gl.getUniformLocation(program, name);

  const root = getComputedStyle(document.documentElement);
  gl.uniform1i(uniform('uPhoto'), 0);
  gl.uniform1i(uniform('uCode'), 1);
  gl.uniform2f(uniform('uRes'), canvas.width, canvas.height);
  gl.uniform3fv(uniform('uPaper'), toVec3(root.backgroundColor));
  gl.uniform3fv(uniform('uInk'), toVec3(root.color));
  gl.uniform1f(uniform('uPhotoAspect'), photo.naturalWidth / photo.naturalHeight);

  const uGrow = uniform('uGrow');
  const draw = (grow: number) => {
    gl.uniform1f(uGrow, grow);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  draw(0);
  canvas.classList.add('is-live'); // the shader now paints the paper, drop the CSS one
  await wait(HOLD_MS);

  const start = performance.now();
  for (let t = 0; t < 1; ) {
    t = Math.min(((await nextFrame()) - start) / GROW_MS, 1);
    draw(easeInOutSine(t));
  }

  canvas.classList.add('is-done'); // CSS fades the canvas out over the identical photo
  await wait(FADE_MS);
  canvas.remove();
}

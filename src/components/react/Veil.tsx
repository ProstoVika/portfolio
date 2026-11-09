/**
 * Veil — a WebGL "ink" mask that dissolves open on load and parts around the cursor.
 *
 * mode="stone": muted earth — charcoal, moss, stone and a faint rust glow (Makhno-like mood).
 * mode="ink":   black smoke with silver wisps.
 * mode="fluid": a liquid in vanadium's four oxidation-state colours.
 * mode="plain": one flat colour.
 *
 * Plain WebGL, no three.js: one full-screen triangle and one fragment shader.
 * Outside the blob the canvas is transparent, so the page's paper texture shows through.
 * Reduced motion → a single still frame. No WebGL → a static CSS shape.
 */
import { useEffect, useRef, useState } from 'react';

type Mode = 'stone' | 'ink' | 'fluid' | 'plain';

interface Props {
  mode?: Mode;
}

/** Colour ramp per mode, dark → light. CSS variables or plain hex. */
const RAMPS: Record<Mode, string[]> = {
  stone: ['#2b2b28', '#4d5243', '#8b877f', '#b9774a'], // charcoal, moss, stone, rust
  ink: ['#0b0b0b', '#1d1d1d', '#4a4a4a', '#cfcac6'], // black smoke with silver wisps
  fluid: ['--v2', '--v3', '--v4', '--v5'], // vanadium oxidation states
  plain: ['--ink', '--ink', '--ink', '--ink'],
};
const MODE_INDEX: Record<Mode, number> = { fluid: 0, plain: 1, stone: 2, ink: 3 };

const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uReveal;
uniform vec2 uMouse;
uniform int uMode;
uniform vec3 uColors[4];

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
// Smoke / stone: noise warped by noise, slowly drifting
float warped(vec2 p, float speed) {
  vec2 q = vec2(fbm(p + uTime * speed), fbm(p + vec2(5.2, 1.3) - uTime * speed));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2)), fbm(p + 3.0 * q + vec2(8.3, 2.8) + uTime * speed));
  return fbm(p + 3.0 * r);
}
vec3 ramp(float t) {                          // 4 colours, dark → light
  t = clamp(t, 0.0, 1.0) * 3.0;
  if (t < 1.0) return mix(uColors[0], uColors[1], t);
  if (t < 2.0) return mix(uColors[1], uColors[2], t - 1.0);
  return mix(uColors[2], uColors[3], t - 2.0);
}
vec3 scene(vec2 p) {
  if (uMode == 0) {                           // vanadium liquid
    float f = warped(p * 1.6, 0.03);
    return ramp(fract(f * 1.4 + uTime * 0.02)) * (0.6 + 0.5 * f);
  }
  if (uMode == 1) return uColors[0];          // flat colour
  if (uMode == 2) {                           // stone, moss, rust — earthy and muted
    float f = warped(p * 1.3, 0.015);
    float strata = 0.5 + 0.5 * sin(p.y * 18.0 + f * 9.0);
    vec3 col = ramp(f * 0.9 + strata * 0.25);
    float ember = smoothstep(0.62, 0.9, fbm(p * 4.0 - vec2(0.0, uTime * 0.25))) * smoothstep(-0.1, -0.45, p.y);
    return col + ember * vec3(0.9, 0.38, 0.1);  // a faint warm glow near the ground
  }
  float f = warped(p * 1.4, 0.02);            // ink: black smoke with silver wisps
  float wisp = pow(f, 3.0) * 1.6;
  return ramp(wisp) + pow(fbm(p * 9.0 + uTime * 0.05), 6.0) * 0.35;
}
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;           // y up, height = 1
  vec2 centre = vec2(0.0, -0.56);                              // rises from below the title
  vec2 v = (p - centre) * vec2(0.48, 1.0);                     // wide, low mound
  float d = length(v);
  float angle = atan(v.y, v.x);

  // Ragged outline + fine radial fibres, like brush or fur
  float edge = fbm(p * 2.6 + uTime * 0.06) * 0.34;
  float fibres = noise(vec2(angle * 260.0, d * 40.0 - uTime * 0.3)) * 0.022
               + noise(vec2(angle * 600.0, d * 90.0)) * 0.012;

  float m = distance(p, uMouse);
  float push = 0.08 * exp(-m * m * 24.0);                      // the cursor parts the veil
  float r = mix(-0.3, 0.37, uReveal) + push;
  float mask = smoothstep(r + 0.003, r - 0.012, d + edge + fibres - 0.14);
  mask *= smoothstep(-0.5, -0.36, p.y + edge * 0.25);          // melts into the paper at the bottom

  vec3 col = scene(p * 1.2 + 3.0);
  gl_FragColor = vec4(col * mask, mask);                       // premultiplied alpha
}`;

/** Resolves "#2b2b28" or a CSS variable like "--v4" to [r, g, b] in 0..1 */
function cssColour(value: string): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = value.startsWith('--') ? `var(${value})` : value;
  document.body.append(probe);
  const [r, g, b] = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g)!.map(Number);
  probe.remove();
  return [r / 255, g / 255, b / 255];
}

export default function Veil({ mode = 'stone' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
    if (!gl) return setFailed(true);

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return setFailed(true);
    gl.useProgram(program);

    // One triangle that covers the whole screen
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform3fv(u('uColors'), RAMPS[mode].flatMap(cssColour));
    gl.uniform1i(u('uMode'), MODE_INDEX[mode]);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5); // sharp enough, cheap enough
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u('uRes'), canvas.width, canvas.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // Cursor position in shader space; eased so the veil moves like liquid
    const target = { x: 9, y: 9 };
    const mouse = { x: 9, y: 9 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left - rect.width / 2) / rect.height;
      target.y = (rect.height / 2 - (e.clientY - rect.top)) / rect.height;
    };
    window.addEventListener('pointermove', onMove);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let frame = 0;
    let visible = true;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const reveal = reducedMotion ? 1 : 1 - (1 - Math.min(t / 2.6, 1)) ** 3; // ease-out cubic
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      gl.uniform1f(u('uTime'), reducedMotion ? 12 : now / 1000);
      gl.uniform1f(u('uReveal'), reveal);
      gl.uniform2f(u('uMouse'), mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion && visible) frame = requestAnimationFrame(draw);
    };

    // Stop rendering when the hero is scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [mode]);

  return failed ? (
    <div className="veil veil--fallback" aria-hidden="true" />
  ) : (
    <canvas ref={canvasRef} className="veil" aria-hidden="true" />
  );
}

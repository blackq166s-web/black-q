import * as THREE from './vendor/three.module.js';

const stage = document.querySelector('#stage');
const canvas = document.querySelector('#portrait');
const codeCanvas = document.querySelector('#code');
const context = codeCanvas.getContext('2d');
const centeredPortrait = new URLSearchParams(location.search).get('view') === 'about';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
const pixelRatio = Math.min(devicePixelRatio, 1.25);
const timeUniform = {value: 0};
const target = {x: 0, y: 0};
const pointer = {x: 0, y: 0};

let renderer, particles, traces, portraitSource, sizeObserver;
let enabled = false, scrolling = false, visible = false, failed = false;
let frame = 0, lastFrame = 0, lastCodeFrame = -Infinity;
let width = 0, height = 0, columns = [];

function canDraw() {
  return (particles || portraitSource) && enabled && !scrolling && visible && !failed && !document.hidden && width > 0 && height > 0;
}

function schedule() {
  if (!frame && canDraw()) frame = requestAnimationFrame(draw);
}

function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastFrame = 0;
}

function fallback() {
  failed = true;
  stop();
  delete stage.dataset.rendering;
  stage.dataset.ready = 'fallback';
  stage.dataset.mode = 'static';
}

function resize() {
  const nextWidth = stage.clientWidth;
  const nextHeight = stage.clientHeight;
  if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
  width = nextWidth;
  height = nextHeight;
  delete stage.dataset.rendering;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = centeredPortrait
    ? Math.max(12.8, 6.9 / camera.aspect / (2 * Math.tan(43 * Math.PI / 360)) * 1.06)
    : width < 700 ? 13.6 : 11.8;
  camera.updateProjectionMatrix();
  if (particles) {
    particles.position.x = centeredPortrait || width < 700 ? 0 : -1.45;
    traces.position.x = particles.position.x;
  }

  codeCanvas.width = width;
  codeCanvas.height = height;
  lastCodeFrame = -Infinity;
  const count = width < 700 ? 14 : 32;
  columns = Array.from({length: count}, (_, i) => ({
    x: (i + .5) * width / count,
    offset: (i * 149) % height,
    speed: 12 + (i % 7) * 4,
    alpha: .1 + (i % 4) * .035,
  }));
  schedule();
}

function paintCode(time) {
  if (!context) return;
  context.clearRect(0, 0, width, height);
  context.font = '9px monospace';
  context.fillStyle = '#87b6dd';
  columns.forEach((column, i) => {
    const y = (time * column.speed + column.offset) % (height + 300) - 180;
    for (let j = 0; j < 24; j++) {
      const glyphY = y - j * 12;
      if (glyphY < 0 || glyphY > height + 9) continue;
      const char = String.fromCharCode(65 + ((i * 13 + j * 7 + Math.floor(time * .8)) % 26));
      context.globalAlpha = (1 - j / 24) * column.alpha;
      context.fillText(char, column.x, glyphY);
    }
  });
  context.globalAlpha = 1;
}

function draw(now) {
  frame = 0;
  if (!canDraw()) return;
  if (!particles) {
    try { buildScene(portraitSource); }
    catch { fallback(); return; }
  }
  if (lastFrame) timeUniform.value += Math.min(.05, (now - lastFrame) / 1000);
  lastFrame = now;
  pointer.x += (target.x - pointer.x) * .04;
  pointer.y += (target.y - pointer.y) * .04;
  particles.rotation.y = pointer.x * .055;
  particles.rotation.x = pointer.y * .025;
  traces.rotation.copy(particles.rotation);
  renderer.render(scene, camera);
  if (now - lastCodeFrame >= 90) {
    paintCode(timeUniform.value);
    lastCodeFrame = now;
  }
  if (stage.dataset.rendering !== 'true') {
    stage.dataset.ready = 'true';
    stage.dataset.rendering = 'true';
  }
  schedule();
}

function makeParticles(bytes, w, h) {
  const positions = [], lumas = [], randoms = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      const luma = (bytes[p] * .2126 + bytes[p + 1] * .7152 + bytes[p + 2] * .0722) / 255;
      if (luma < .028) continue;
      const px = (x / w - .5) * 6.9;
      const py = (.5 - y / h) * 8.625;
      const head = Math.exp(-((px - .3) ** 2 / 2.8 + (py - 1.6) ** 2 / 3.2));
      positions.push(px, py, head * .48 + luma * .16);
      lumas.push(luma);
      randoms.push(((x * 73 + y * 199) % 997) / 997);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('a_luma', new THREE.Float32BufferAttribute(lumas, 1));
  geometry.setAttribute('a_random', new THREE.Float32BufferAttribute(randoms, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {u_time: timeUniform, u_brightness: {value: 1.3}, u_size: {value: 1.5}, u_pixel: {value: pixelRatio}},
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float a_luma, a_random;
      uniform float u_time, u_size, u_pixel;
      varying float v_light, v_scan;
      void main() {
        vec3 p = position;
        v_scan = exp(-pow((p.y - (mod(u_time * .42, 11.) - 5.5)) / .16, 2.));
        p.z += sin(u_time * .65 + p.x * 3. + p.y * 2.) * .015;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = u_size * u_pixel * clamp(12. / (-mv.z), .7, 1.8) * (.7 + pow(a_luma, .4) * .55);
        v_light = pow(a_luma, .72) * (.78 + a_random * .22);
      }`,
    fragmentShader: `
      uniform float u_brightness;
      varying float v_light, v_scan;
      void main() {
        float alpha = 1. - smoothstep(.25, .5, length(gl_PointCoord - vec2(.5)));
        vec3 tint = mix(vec3(.24,.43,.65), vec3(.73,.85,1.), v_light);
        gl_FragColor = vec4(tint * (1. + v_scan * .65), alpha * v_light * u_brightness);
      }`,
  });
  return new THREE.Points(geometry, material);
}

function makeTraces(bytes, w, h) {
  const styles = [
    {color: 0x659bc4, opacity: .12, positions: [], rows: []},
    {color: 0xc4dcff, opacity: .36, positions: [], rows: []},
  ];
  for (let i = 0; i < 40; i++) {
    const style = styles[i % 5 === 0 ? 1 : 0];
    const y = Math.floor(h * (.48 + i * .011));
    const py = (.5 - y / h) * 8.625;
    for (let x = 2; x < w - 2; x += 2) {
      const first = bytes[(y * w + x) * 4] / 255;
      const second = bytes[(y * w + x + 2) * 4] / 255;
      if (first < .045 || second < .045) continue;
      style.positions.push((x / w - .5) * 6.9, py + first * .25, .28,
        ((x + 2) / w - .5) * 6.9, py + second * .25, .28);
      style.rows.push(i, i);
    }
  }

  const group = new THREE.Group();
  for (const style of styles) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(style.positions, 3));
    geometry.setAttribute('a_row', new THREE.Float32BufferAttribute(style.rows, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: {u_time: timeUniform, u_color: {value: new THREE.Color(style.color)}, u_opacity: {value: style.opacity}},
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float a_row;
        uniform float u_time;
        void main() {
          vec3 p = position;
          p.y += sin(u_time * .7 + a_row * .2) * .06;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
        }`,
      fragmentShader: `
        uniform vec3 u_color;
        uniform float u_opacity;
        void main() {
          gl_FragColor = vec4(u_color, u_opacity);
          #include <colorspace_fragment>
        }`,
    });
    group.add(new THREE.LineSegments(geometry, material));
  }
  return group;
}

function buildScene(image) {
  const w = 380;
  const h = Math.round(w * image.height / image.width);
  const sample = document.createElement('canvas');
  sample.width = w;
  sample.height = h;
  const pixels = sample.getContext('2d', {willReadFrequently: true});
  pixels.drawImage(image, 0, 0, w, h);
  const bytes = pixels.getImageData(0, 0, w, h).data;
  particles = makeParticles(bytes, w, h);
  traces = makeTraces(bytes, w, h);
  particles.position.x = centeredPortrait || width < 700 ? 0 : -1.45;
  traces.position.x = particles.position.x;
  scene.add(particles, traces);
  portraitSource = null;
}

async function initialize() {
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: false});
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0, 0);
    sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(stage);
    const image = new Image();
    image.src = 'assets/portrait.webp';
    await image.decode();
    if (failed) return;
    portraitSource = image;
    schedule();
  } catch {
    fallback();
  }
}

export function setPlayback(motion, isScrolling, inViewport) {
  if (failed) return;
  enabled = motion;
  scrolling = isScrolling;
  visible = inViewport;
  stage.dataset.mode = enabled ? 'animated' : 'static';
  stage.dataset.suspended = String(scrolling);
  if (!enabled) {
    delete stage.dataset.rendering;
    stage.dataset.ready = 'static';
  } else if (!stage.dataset.rendering) {
    stage.dataset.ready = 'loading';
  }
  if (enabled && !scrolling && visible) schedule();
  else stop();
}

stage.addEventListener('pointermove', event => {
  if (!enabled || scrolling || event.pointerType !== 'mouse') return;
  target.x = event.clientX / width * 2 - 1;
  target.y = event.clientY / height * 2 - 1;
});
stage.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; });
canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop();
  else schedule();
});
window.addEventListener('pagehide', event => {
  stop();
  if (event.persisted) return;
  sizeObserver?.disconnect();
  scene.traverse(object => {
    object.geometry?.dispose();
    object.material?.dispose();
  });
  renderer?.dispose();
});
window.addEventListener('pageshow', schedule);
initialize();


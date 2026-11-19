const stage = document.querySelector('#stage');
const query = new URLSearchParams(location.search);
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let enabled = query.get('motion') !== 'static' && !preference.matches;
let scrolling = false;
let visible = parent === window;
let engine;
let loading;

async function applyPlayback() {
  if (engine) {
    engine.setPlayback(enabled, scrolling, visible);
    return;
  }
  if (!enabled) {
    stage.dataset.ready = 'static';
    stage.dataset.mode = 'static';
    return;
  }
  if (scrolling || !visible) return;
  stage.dataset.ready = 'loading';
  try {
    loading ??= import('./scene.js?v=20261119-portrait');
    engine = await loading;
    engine.setPlayback(enabled, scrolling, visible);
  } catch {
    stage.dataset.ready = 'fallback';
    stage.dataset.mode = 'static';
  }
}

window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent) return;
  if (event.data?.type !== 'bweb:motion' || typeof event.data.enabled !== 'boolean') return;
  enabled = event.data.enabled;
  scrolling = event.data.scrolling === true;
  visible = event.data.visible !== false;
  applyPlayback();
});

// The owning page can suspend animation before the graphics module loads.
if (parent === window) {
  preference.addEventListener('change', () => {
    enabled = query.get('motion') !== 'static' && !preference.matches;
    applyPlayback();
  });
  applyPlayback();
} else {
  parent.postMessage({type: 'bweb:portrait-ready'}, location.origin);
}



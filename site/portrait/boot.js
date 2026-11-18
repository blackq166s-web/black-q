const stage = document.querySelector('#stage');
const image = document.querySelector('#fallback');
const query = new URLSearchParams(location.search);
let mode = query.get('motion') === 'static' ? 'static' : 'animated';
let engine;
let loading;
function fallback(state = 'fallback') {
  image.style.opacity = '1';
  document.querySelector('#portrait').style.opacity = '0';
  document.querySelector('#code').style.opacity = '0';
  stage.dataset.ready = state;
  stage.dataset.mode = 'static';
}
async function applyMode() {
  if (mode === 'static') {
    engine?.setMotion(false);
    fallback('static');
    return;
  }
  try {
    if(!loading)stage.dataset.ready='loading';
    loading ||= import('./scene.js');
    engine = await loading;
    engine.setMotion(mode === 'animated');
  } catch { fallback(); }
}
image.addEventListener('error', () => { document.querySelector('#status').textContent = '人像暂时不可用'; });
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent) return;
  if (event.data?.type !== 'bweb:motion' || typeof event.data.enabled !== 'boolean') return;
  mode = event.data.enabled ? 'animated' : 'static';
  applyMode();
});
// Wait for the owning page's latest setting: a pause during loading must win.
if(parent===window)applyMode();
else parent.postMessage({type:'bweb:portrait-ready'},location.origin);



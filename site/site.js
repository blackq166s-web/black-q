const page=document.querySelector('#page'), main=document.querySelector('#main'), menu=document.querySelector('#menu'), toggle=document.querySelector('.menu-toggle'), preview=document.querySelector('.hover-preview'), curtain=document.querySelector('.transition');
const preference=matchMedia('(prefers-reduced-motion: reduce)'), compactPreview=new URLSearchParams(location.search).get('layout')==='compact';
let data,projects=[],activeFilter='全部',routeTimer,observer,previousFocus,renderedRoute='',linkNavigation=false,isNavigating=false;
const viewMemory=new Map();
function initialMotion(){try{const saved=localStorage.getItem('bweb-motion');return saved?saved==='animated':!preference.matches}catch{return !preference.matches}}
let animations=initialMotion();
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safeUrl(value,fallback='#work'){
  if(typeof value!=='string')return fallback;
  if(/^#(?:home|work|about|project\/[a-z0-9-]+)$/.test(value))return value;
  if(/^(?:assets|projects)\/[a-zA-Z0-9_./-]+$/.test(value)&&!value.includes('..'))return value;
  try{const u=new URL(value);if(u.protocol==='https:'&&!u.username&&!u.password)return u.href}catch{}
  return fallback;
}
const target=p=>safeUrl(p.targetUrl,`#project/${p.id}`);
const linkAttributes=url=>url.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"';
const image=p=>esc(safeUrl(p.cover,''));
function cover(p){return `<img src="${image(p)}" alt="${esc(p.coverAlt||p.name)}" loading="lazy" decoding="async" width="1200" height="780">`}
function card(p,index=0,featured=false){
  const url=target(p);
  if(featured)return `<a class="featured-card reveal" href="${esc(url)}"${linkAttributes(url)} data-project-id="${p.id}" data-feature-card style="--entry-delay:${index%2*100}ms"><div class="featured-cover">${cover(p)}<span class="featured-open" aria-hidden="true">↗</span></div><div class="featured-meta"><span>${esc(p.category)}</span><span>${esc(p.stage)}</span></div><h3><span aria-hidden="true">↗</span>${esc(p.name)}</h3><p class="project-summary">${esc(p.summary)}</p></a>`;
  return `<a class="card reveal" href="${esc(url)}"${linkAttributes(url)} data-project-id="${p.id}" data-image="${image(p)}"><div class="image">${cover(p)}</div><h2>${esc(p.name)}</h2><p><span>${esc(p.category)}</span><span>${esc(p.stage)} ↗</span></p><div class="project-summary">${esc(p.summary)}</div></a>`;
}
function portrait(view='home'){return `<iframe class="${view==='home'?'hero-portrait':'about-portrait'}" src="portrait/index.html?view=${view}&motion=${animations?'animated':'static'}&v=20261117-audit" title="去手皮衣点阵人像" loading="${view==='home'?'eager':'lazy'}" tabindex="-1"></iframe>`}
function currentRoute(){const hash=location.hash.slice(1)||'home';if(hash==='notes'){history.replaceState(null,'',location.pathname+location.search+'#home');return 'home'}return hash}
function render({focus=false}={}){
  if(!data)return;
  observer?.disconnect();
  const route=currentRoute(), featured=projects.filter(p=>p.featured), categories=['全部',...new Set(projects.map(p=>p.category))];
  renderedRoute=route;
  if(!categories.includes(activeFilter))activeFilter='全部';
  preview.classList.remove('active');
  document.querySelector('header').classList.toggle('dark',route!=='home');
  const navRoute=route.startsWith('project/')?'work':route;
  document.querySelectorAll('header nav a,.menu-links a').forEach(a=>{if(a.hash==='#'+navRoute)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  const footerCta=document.querySelector('.footer-line a');footerCta.href=route==='about'?'#work':'#about';footerCta.textContent=route==='about'?'查看作品 ↗':'认识我 ↗';
  document.body.classList.toggle('compact-layout',compactPreview||data.site.compactFooter===true);
  if(route==='home'){
    page.innerHTML=`<section class="hero">${portrait()}<div class="location">Ideas into<br>something real<span class="globe">◎</span></div><div class="role"><span>↘</span>AI & Engineering<br>Projects & Play</div><h1 class="marquee" aria-label="Black Q，项目与探索"><span aria-hidden="true">Black Q — Projects & Play — </span><span aria-hidden="true">Black Q — Projects & Play — </span></h1></section><section class="intro"><h2 class="reveal">把想法变成作品，<br>也记录一路上的探索。<br>这里有我的项目与尝试。</h2><div class="reveal"><p>我做 AI 部署和软件开发。这里有我在不同硬件上实测大模型的记录，也有我自己做的软件和其他作品。</p><a class="round magnetic" href="#about">关于我 ↗</a></div></section><section class="section featured-section" id="featured"><div class="featured-heading reveal"><div><div class="eyebrow">SELECTED WORK / 精选探索</div><h2>Featured Work</h2></div><p>项目、创作与持续探索。</p></div><div class="featured-grid">${featured.map((p,i)=>card(p,i,true)).join('')||'<p>更多作品正在整理。</p>'}</div><div class="more"><a class="pill" href="#work">全部作品 <sup>${projects.length}</sup> ↗</a></div></section>${data.site.showGallery&&!compactPreview&&featured.length?`<section class="strip" aria-label="作品画廊">${featured.map(p=>`<a href="${esc(target(p))}"${linkAttributes(target(p))}>${cover(p)}</a>`).join('')}</section>`:''}`;
  }else if(route==='work'){
    const visible=projects.filter(p=>activeFilter==='全部'||p.category===activeFilter);
    page.innerHTML=`<section class="page-title"><small>WORK / 持续更新的作品集合</small><h1>做过的，<br>还在探索的。</h1></section><section class="section"><div class="filters" aria-label="作品分类">${categories.map(c=>`<button class="pill ${c===activeFilter?'active':''}" aria-pressed="${c===activeFilter}" data-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div><p class="result-count" role="status">${visible.length} 件作品</p><div class="grid">${visible.map((p,i)=>card(p,i)).join('')||'<p>这个分类还没有作品。</p>'}</div></section>`;
  }else if(route==='about'){
    page.innerHTML=`<section class="page-title"><small>ABOUT / 关于我</small><h1>喜欢动手，<br>也保持好奇。</h1></section><section class="section about-layout"><div class="reveal"><p>我在做 AI 部署和企业软件交付。平时会把大模型部署到服务器上，跑实际业务，看回答要等多久、多少人能同时用。我喜欢研究模型和硬件怎么搭配，也会把遇到的问题和实测数据整理下来，方便下次选型时参考。</p><p>工作之外，我在给自己做一款英语学习软件，也在尝试做游戏、设计键盘、玩3D打印。闲下来喜欢带着相机出门走走。</p><p>在这里，你可以看到这些项目最后做成了什么样，也能看到中间试过哪些办法、为什么改了主意。如果你也在折腾类似的东西，欢迎写信聊聊。</p><a class="pill" data-email-link href="mailto:${esc(data.site.email)}">${esc(data.site.email)} ↗</a></div><div class="reveal">${portrait('about')}</div></section>`;
  }else if(route.startsWith('project/')){
    const p=projects.find(item=>item.id===route.slice(8));if(!p){renderNotFound();return}
    page.innerHTML=`<section class="page-title"><a href="#work">← 全部作品</a><h1>${esc(p.name)}</h1><p>${esc(p.category)} / ${esc(p.stage)}</p><p class="case-summary">${esc(p.summary)}</p></section><article class="section detail"><figure>${cover(p)}${p.coverCaption?`<figcaption>${esc(p.coverCaption)}</figcaption>`:''}</figure><div class="case-intro"><p>${esc(p.intro)}</p></div><div class="case-layout"><div class="case-overview"><h2>项目中的工作</h2><ul>${p.contribution.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></div><div class="case-sections">${p.sections.map(s=>`<section><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}<section><h2>阶段成果</h2><ul>${p.outcomes.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></section><section><h2>继续推进的部分</h2><ul>${p.limits.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></section>${p.resources.length?`<section><h2>查看成果</h2><div class="case-resources">${p.resources.map(resource=>{const url=safeUrl(resource.url);return `<a class="pill" href="${esc(url)}"${linkAttributes(url)}>${esc(resource.label)} ↗<span class="sr-only">（在新标签页打开）</span></a>`}).join('')}</div></section>`:''}</div></div><a class="pill" href="#work">返回作品 ↗</a></article>`;
  }else{renderNotFound();return}
  const project=projects.find(p=>route===`project/${p.id}`);
  document.title=project?`${project.name} — Black Q`:route==='work'?'作品 — Black Q':route==='about'?'关于我 — Black Q':'Black Q — Projects & Play';
  document.querySelector('meta[name="description"]').content=project?.summary||data.site.description;
  bind();onScroll();if(focus)focusMain();
}
function renderNotFound(){page.innerHTML='<section class="page-title"><h1>暂时找不到这个页面。</h1><p>作品可能已更新，去看看当前的集合。</p><a class="pill" href="#work">浏览作品 ↗</a></section>';document.title='页面未找到 — Black Q';focusMain()}
function focusMain(){main.focus({preventScroll:true})}
function bind(){
  document.querySelectorAll('[data-email-link]').forEach(a=>{a.href='mailto:'+data.site.email;a.setAttribute('aria-label','邮件联系 '+data.site.email)});
  document.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('load',()=>sendPortraitMotion(frame)));
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{const y=scrollY;activeFilter=b.dataset.filter;render();scrollTo({top:y,behavior:'instant'});[...document.querySelectorAll('[data-filter]')].find(el=>el.dataset.filter===activeFilter)?.focus({preventScroll:true})});
  document.querySelectorAll('[data-image]').forEach(a=>{a.onpointerenter=e=>{if(!animations||e.pointerType!=='mouse'||innerWidth<701)return;preview.querySelector('img').src=a.dataset.image;preview.classList.add('active')};a.onpointerleave=()=>preview.classList.remove('active')});
  document.querySelectorAll('.magnetic').forEach(el=>{el.onpointermove=e=>{if(!animations||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.2}px)`};el.onpointerleave=()=>el.style.transform=''});
  document.querySelectorAll('[data-feature-card]').forEach(card=>{let raf=0;card.onpointermove=e=>{if(!animations||e.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches)return;const r=card.querySelector('.featured-cover').getBoundingClientRect(),x=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5)),y=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{card.style.setProperty('--card-rx',`${-y*5}deg`);card.style.setProperty('--card-ry',`${x*5}deg`);card.style.setProperty('--cover-x',`${x*14}px`);card.style.setProperty('--cover-y',`${y*12}px`);card.style.setProperty('--glow-x',`${(x+.5)*100}%`);card.style.setProperty('--glow-y',`${(y+.5)*100}%`)})};card.onpointerleave=()=>{cancelAnimationFrame(raf);['--card-rx','--card-ry','--cover-x','--cover-y','--glow-x','--glow-y'].forEach(p=>card.style.removeProperty(p))}});
}
function setMenu(open,restoreFocus=true){const wasOpen=toggle.getAttribute('aria-expanded')==='true';if(open)previousFocus=document.activeElement;menu.inert=!open;menu.classList.toggle('open',open);document.querySelector('.shade').classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');document.body.style.overflow=open?'hidden':'';if(open)menu.querySelector('a').focus();else if(wasOpen&&restoreFocus&&previousFocus?.isConnected)previousFocus.focus()}
toggle.onclick=()=>setMenu(toggle.getAttribute('aria-expanded')!=='true');document.querySelector('.shade').onclick=()=>setMenu(false);
document.addEventListener('keydown',e=>{if(toggle.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape')setMenu(false);if(e.key==='Tab'){const items=[toggle,...menu.querySelectorAll('a')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();toggle.focus()}}});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();focusMain();main.scrollIntoView({behavior:'instant',block:'start'})});
document.addEventListener('pointermove',e=>{preview.style.left=e.clientX+'px';preview.style.top=e.clientY+'px'});
function onScroll(){toggle.classList.toggle('visible',scrollY>250||innerWidth<701);if(!isNavigating&&renderedRoute===currentRoute())viewMemory.set(renderedRoute,{...viewMemory.get(renderedRoute),scroll:scrollY});if(animations)document.documentElement.style.setProperty('--strip-shift',`${-8+scrollY/Math.max(1,document.body.scrollHeight-innerHeight)*12}vw`)}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if(!anchor||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const next=anchor.hash.slice(1);if(!/^(home|work|about|project\/[a-z0-9-]+)$/.test(next))return;
  if(next===currentRoute()){
    event.preventDefault();setMenu(false,false);focusMain();scrollTo({top:0,behavior:animations?'smooth':'instant'});return;
  }
  viewMemory.set(renderedRoute,{scroll:scrollY,focusId:anchor.dataset.projectId});
  linkNavigation=true;setMenu(false,false);
});
window.addEventListener('hashchange',()=>{
  clearTimeout(routeTimer);setMenu(false,false);const route=currentRoute();
  if(route==='main'||route==='featured'){document.getElementById(route)?.scrollIntoView();return}
  const memory=linkNavigation?null:viewMemory.get(route);linkNavigation=false;isNavigating=true;
  const navigate=()=>{
    render();scrollTo({top:memory?.scroll??0,behavior:'instant'});
    const card=memory?.focusId?document.querySelector(`[data-project-id="${memory.focusId}"]`):null;
    if(card)card.focus({preventScroll:true});else focusMain();
    isNavigating=false;onScroll();
  };
  if(!animations){navigate();return}
  curtain.classList.remove('run');void curtain.offsetWidth;
  curtain.querySelector('span').textContent=route==='about'?'关于我':route==='work'?'作品':route.startsWith('project/')?'项目':'探索';curtain.classList.add('run');routeTimer=setTimeout(navigate,310);
});
curtain.addEventListener('animationend',e=>{if(e.animationName==='pagechange')curtain.classList.remove('run')});
function sendPortraitMotion(frame){frame.contentWindow?.postMessage({type:'bweb:motion',enabled:animations},location.origin)}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='bweb:portrait-ready')return;const frame=[...document.querySelectorAll('iframe')].find(frame=>frame.contentWindow===event.source);if(frame)sendPortraitMotion(frame)});
function syncMotion(){document.body.classList.toggle('motion-off',!animations);const button=document.querySelector('#motion-choice');button.textContent=animations?'暂停动效':'开启动效';button.setAttribute('aria-pressed',String(!animations));preview.classList.remove('active');document.querySelectorAll('iframe').forEach(sendPortraitMotion);if(!animations){curtain.classList.remove('run');document.querySelectorAll('.magnetic').forEach(el=>el.style.transform='')}}
document.querySelector('#motion-choice').onclick=()=>{animations=!animations;try{localStorage.setItem('bweb-motion',animations?'animated':'static')}catch{}syncMotion()};
preference.addEventListener('change',()=>{animations=!preference.matches;try{localStorage.removeItem('bweb-motion')}catch{}syncMotion()});
function clock(){document.querySelector('#clock').textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Shanghai'})+' CST'}clock();setInterval(clock,1000);syncMotion();
async function start(){main.setAttribute('aria-busy','true');try{const response=await fetch('content/projects.json',{cache:'no-store'});if(!response.ok)throw new Error('项目数据无法读取');data=await response.json();if(!Array.isArray(data.projects)||!data.site)throw new Error('项目数据格式不正确');projects=data.projects.filter(p=>p.published!==false).sort((a,b)=>(a.order??0)-(b.order??0));if(new Set(projects.map(p=>p.id)).size!==projects.length||projects.some(p=>!/^[a-z0-9-]+$/.test(p.id)))throw new Error('项目标识需要唯一且有效');render()}catch(error){document.querySelector('header').classList.add('dark');page.innerHTML='<section class="page-title" role="alert"><h1>作品暂时无法载入。</h1><p>请刷新页面，或稍后再试。</p><button class="pill" id="retry-content">重新载入</button></section>';document.querySelector('#retry-content').onclick=start;console.error('Content loading:',error.message);focusMain()}finally{main.setAttribute('aria-busy','false')}}
start();


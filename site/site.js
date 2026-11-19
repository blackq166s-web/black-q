const page=document.querySelector('#page');
const main=document.querySelector('#main');
const header=document.querySelector('header');
const navLinks=header.querySelectorAll('nav a');
const description=document.querySelector('meta[name="description"]');
const curtain=document.querySelector('.transition');
const curtainLabel=curtain.querySelector('.transition-label');
const clock=document.querySelector('#clock');
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const compactPreview=new URLSearchParams(location.search).get('layout')==='compact';

let site, projects, groups, routeTimer, photoStrip;
let renderedRoute='', linkNavigation=null, isNavigating=false;
let animations=!preference.matches;
const viewMemory=new Map();
const categoryDescriptions=new Map([
  ['AI 与工程','模型部署、性能测试与硬件选型'],
  ['软件与网站','个人应用、网页与小工具'],
  ['硬件与制作','键盘与实物设计'],
  ['游戏','玩法构想与游戏设计'],
]);
const htmlEntities={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>htmlEntities[char]);
function safeUrl(value,fallback='#work'){
  if(typeof value!=='string')return fallback;
  if(/^#(?:home|work|about|project\/[a-z0-9-]+)$/.test(value))return value;
  if(/^(?:assets|projects)\/[a-zA-Z0-9_./-]+$/.test(value)&&!value.includes('..'))return value;
  try{
    const url=new URL(value);
    if(url.protocol==='https:'&&!url.username&&!url.password)return url.href;
  }catch{}
  return fallback;
}
const target=p=>safeUrl(p.targetUrl,`#project/${p.id}`);
const linkAttributes=url=>url.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"';
function cover(p){
  return `<img src="${esc(safeUrl(p.cover,''))}" alt="${esc(p.coverAlt||p.name)}" loading="lazy" decoding="async" width="1200" height="780">`;
}
function groupProjects(items){
  const groups=new Map();
  for(const project of items){
    if(!groups.has(project.category))groups.set(project.category,[]);
    groups.get(project.category).push(project);
  }
  return groups;
}
const categoryUrl=name=>`#work/${encodeURIComponent(name)}`;
const isWorkRoute=route=>route==='work'||route.startsWith('work/');
function categoryName(route){
  if(!route.startsWith('work/'))return null;
  try{return decodeURIComponent(route.slice(5))}catch{return null}
}
function categoryNames(){
  const orderedNames=new Set([...categoryDescriptions.keys(),...groups.keys()]);
  return [...orderedNames].filter(name=>groups.has(name));
}
function categoryIndex(){
  const rows=categoryNames().map(name=>{
    const items=groups.get(name);
    const summary=categoryDescriptions.get(name);
    return `<li>
    <a class="category-row" href="${esc(categoryUrl(name))}">
      <span class="category-name">${esc(name)}</span>
      <span class="category-meta">
        ${summary?`<span>${esc(summary)}</span>`:''}
        <span class="category-count">${items.length} 件作品</span>
      </span>
    </a>
  </li>`;
  }).join('');
  return `<section class="category-index" aria-label="作品分类">
    <div class="category-index-header"><h2>作品分类</h2><a href="#work">全部作品</a></div>
    ${rows?`<ul class="category-list" role="list">${rows}</ul>`:'<p>作品正在整理。</p>'}
  </section>`;
}
function projectCard(p){
  const url=target(p);
  return `<li>
    <a class="work-card reveal" href="${esc(url)}"${linkAttributes(url)} data-project-id="${p.id}">
      <div class="work-card-cover">${cover(p)}</div>
      <h2>${esc(p.name)}</h2>
      <p class="work-card-meta"><span>${esc(p.category)}</span><span>${esc(p.stage)}</span></p>
      <p class="project-summary">${esc(p.summary)}</p>
    </a>
  </li>`;
}
function workIndex(selected, visible){
  const filter=(name, url, current)=>`<a class="pill" href="${esc(url)}" data-work-filter${current?' aria-current="true"':''}>${esc(name)}</a>`;
  const filters=categoryNames().map(name=>filter(name,categoryUrl(name),name===selected));
  return `<section class="page-title work-region"><small>WORK / 持续更新的作品集合</small><h1>完成的<br>与还在探索的</h1></section>
    <section class="section work-region" aria-label="作品列表">
      <nav class="work-filters" aria-label="作品分类">
        ${filter('全部','#work',selected===null)}${filters.join('')}
      </nav>
      <p class="work-count" role="status">${visible.length} 件作品</p>
      ${visible.length?`<ul class="work-grid" role="list">${visible.map(projectCard).join('')}</ul>`:'<p class="work-empty">作品正在整理。</p>'}
    </section>`;
}
function portrait(){
  const motion=animations?'animated':'static';
  return `<iframe class="hero-portrait"
    src="portrait/index.html?view=home&motion=${motion}&v=20261117-audit"
    title="去手皮衣点阵人像" loading="eager" tabindex="-1"></iframe>`;
}

function homePage(){
  return `<section class="hero">
    ${portrait()}
    <div class="location">Ideas into<br>something real<span class="globe">◎</span></div>
    <div class="role">AI & Engineering<br>Projects & Play</div>
    <h1 class="marquee" aria-label="Black Q，项目与探索"><span aria-hidden="true">Black Q — Projects & Play — </span><span aria-hidden="true">Black Q — Projects & Play — </span></h1>
  </section>
  <section class="intro">
    <h2 class="reveal">把想法变成作品，<br>也记录一路上的探索。<br>这里有我的项目与尝试。</h2>
    <div class="intro-copy reveal">
      <p>我做 AI 部署和软件开发。这里有我在不同硬件上实测大模型的记录，也有我自己做的软件和其他作品。</p>
      <a class="pill intro-link" href="#about">关于我</a>
    </div>
  </section>
  ${categoryIndex()}`;
}

function benchmarkMetric(label,index){
  const baseline=100;
  const scaleMax=120;
  const change=index-baseline;
  const delta=`${change>0?'+':'−'}${Math.abs(change)}%`;
  const bars=[
    {label:'单实例四卡',value:baseline,text:baseline},
    {label:'双实例各两卡',value:index,text:`约 ${index}`},
  ].map(bar=>`<div>
    <dt>${bar.label}</dt>
    <dd><span class="benchmark-track" aria-hidden="true"><span style="--value:${bar.value/scaleMax*100}%"></span></span>${bar.text}</dd>
  </div>`).join('');
  return `<div class="benchmark-metric">
    <div class="benchmark-value"><h4>${label}</h4><strong>约 ${delta}</strong></div>
    <dl class="benchmark-bars">${bars}</dl>
  </div>`;
}

function aboutPage(){
  const email=esc(site.email);
  return `<div class="section about-page">
    <div class="about-heading">
      <h1 lang="en">${esc(site.name)}</h1>
      <p class="about-role">AI 推理部署 · 企业软件交付</p>
      <div class="about-intro">
        <p>我做服务器选型、大模型部署和实测，也把 AI 服务接进企业现有系统。平时会把测试结果和踩过的坑记下来，留给下次选型参考。</p>
        <p>工作之外，我在做英语学习工具和游戏，也喜欢设计键盘、玩 3D 打印和摄影。</p>
        <a class="about-email" data-email-link href="mailto:${email}" aria-label="邮件联系 ${email}">${email}</a>
      </div>
    </div>
    <div class="about-layout">
      <section aria-labelledby="about-career-title">
        <h2 id="about-career-title">工作经历</h2>
        <ol class="about-career" role="list">
          <li>
            <div class="about-entry-heading">
              <h3>某国产 GPU 研发上市企业</h3>
              <span class="about-date"><time datetime="2025-11">2025.11</time> 至今</span>
            </div>
            <p><strong>运维工程师</strong> · AI 服务器与工作站选型、私有化部署、系统接入和现场排障。</p>
          </li>
          <li>
            <div class="about-entry-heading">
              <h3>某市局信息中心</h3>
              <span class="about-date"><time datetime="2023-04">2023.04</time>–<time datetime="2025-03">2025.03</time></span>
            </div>
            <p><strong>实施工程师</strong> · 政企平台实施与运维，负责国产化适配、消息中间件集群调优和灾备恢复。</p>
          </li>
        </ol>
      </section>
      <section aria-labelledby="about-results-title">
        <h2 id="about-results-title">代表成果</h2>
        <div class="about-entry">
          <h3>多平台大模型推理部署</h3>
          <dl class="about-platforms" aria-label="多平台部署场景">
            <div>
              <dt>NVIDIA</dt>
              <dd><strong>多卡并发调优</strong><span>独立完成 RTX 工作站选型和部署，比较多卡方案的吞吐与首字延迟。</span></dd>
            </div>
            <div>
              <dt>AMD</dt>
              <dd><strong>长上下文与内存预算</strong><span>面向长文档任务部署模型，调整预填充以降低启动内存开销。</span></dd>
            </div>
            <div>
              <dt>华为昇腾</dt>
              <dd><strong>国产化部署与通信验证</strong><span>适配 CANN 环境，验证模型部署并复现多卡通信异常。</span></dd>
            </div>
          </dl>
          <figure class="about-benchmark" aria-labelledby="about-benchmark-title">
            <figcaption id="about-benchmark-title">性能调优实测</figcaption>
            <p class="benchmark-note">相对值以单实例四卡为基准 100。</p>
            ${benchmarkMetric('输出吞吐',118)}
            ${benchmarkMetric('平均首字延迟',66)}
            <dl class="benchmark-conditions" aria-label="测试条件">
              <div><dt>硬件</dt><dd>4 × RTX PRO 6000（每卡 96 GB）</dd></div>
              <div><dt>模型与框架</dt><dd><span>Qwen3.6-35B-A3B</span><span>vLLM</span></dd></div>
              <div><dt>长文档负载</dt><dd><span>25K Token 输入</span><span>1K Token 输出</span><span>8 并发</span></dd></div>
            </dl>
          </figure>
        </div>
        <div class="about-entry">
          <h3>统一 AI 模型评测平台</h3>
          <ol class="about-eval-flow" aria-label="评测流程" role="list">
            <li><strong>定评分规则</strong><span>覆盖通用能力、Agent 能力与特定业务能力</span></li>
            <li><strong>运行测试</strong><span>基于 EvalScope 分档压测，统一延迟、吞吐与成功率口径</span></li>
            <li><strong>整理报告</strong><span>将跨平台评测结果汇成统一的交互式可视化报告</span></li>
          </ol>
          <a class="about-case-link" href="#project/ai" data-project-id="ai">查看 AI 部署与测试</a>
        </div>
      </section>
      <section class="about-projects" aria-labelledby="about-projects-title">
        <h2 id="about-projects-title">个人项目</h2>
        <ul role="list">
          <li>
            <a href="https://github.com/blackq166s-web/ai-deploy-advisor" target="_blank" rel="noopener noreferrer" aria-labelledby="about-advisor-name" aria-describedby="about-advisor-summary">
              <span class="about-project-name" id="about-advisor-name" lang="en">AI Deploy Advisor</span>
              <span class="about-project-summary" id="about-advisor-summary">对比硬件规格，估算不同模型和量化精度的部署容量。</span>
            </a>
          </li>
          <li>
            <a href="#project/cibo" data-project-id="cibo" aria-labelledby="about-cibo-name" aria-describedby="about-cibo-summary">
              <span class="about-project-name" id="about-cibo-name">词泊 Cibo</span>
              <span class="about-project-summary" id="about-cibo-summary">把查词、发音和本地词库放进一个桌面应用。</span>
            </a>
          </li>
        </ul>
      </section>
      <section class="about-education" aria-labelledby="about-education-title">
        <h2 id="about-education-title">教育背景</h2>
        <p>计算机科学与技术本科 · 2019–2023</p>
      </section>
    </div>
  </div>
  ${site.aboutPhotos?.length?aboutPhotos(site.aboutPhotos):''}`;
}

function aboutPhotos(photos){
  const items=photos.map(photo=>`<li><img src="assets/about/${encodeURIComponent(photo.id)}.webp?v=strip"
    width="${Number(photo.width)}" height="${Number(photo.height)}" alt="${esc(photo.alt)}" loading="lazy" decoding="async"></li>`).join('');
  return `<section class="about-gallery" aria-label="工作之外">
    <ul class="photo-strip" role="list" aria-label="照片" tabindex="0">${items}</ul>
  </section>`;
}

function scrollPhotoStrip(){
  if(!photoStrip||!animations)return;
  const {top,bottom}=photoStrip.getBoundingClientRect();
  if(top>=innerHeight||bottom<=0)return;
  const start=innerHeight*.88;
  const pageBottom=document.documentElement.scrollHeight-scrollY;
  const end=Math.max(innerHeight*.22,top+innerHeight-pageBottom);
  if(end>=start)return;
  const progress=Math.max(0,Math.min(1,(start-top)/(start-end)));
  photoStrip.scrollLeft=progress*(photoStrip.scrollWidth-photoStrip.clientWidth);
}

function resourceLinks(resources){
  if(!resources.length)return '';
  const links=resources.map(resource=>{
    const url=safeUrl(resource.url);
    return `<a class="pill" href="${esc(url)}"${linkAttributes(url)}>${esc(resource.label)} ↗<span class="sr-only">（在新标签页打开）</span></a>`;
  }).join('');
  return `<section><h2>查看成果</h2><div class="case-resources">${links}</div></section>`;
}

function projectPage(project){
  const category=esc(categoryUrl(project.category));
  const list=items=>`<ul>${items.map(text=>`<li>${esc(text)}</li>`).join('')}</ul>`;
  const sections=project.sections.map(section=>`<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p></section>`).join('');
  return `<section class="page-title">
    <a class="category-back" href="${category}">${esc(project.category)}</a>
    <h1>${esc(project.name)}</h1>
    <p>${esc(project.stage)}</p>
    <p class="case-summary">${esc(project.summary)}</p>
  </section>
  <article class="section detail">
    <figure>${cover(project)}${project.coverCaption?`<figcaption>${esc(project.coverCaption)}</figcaption>`:''}</figure>
    <div class="case-intro"><p>${esc(project.intro)}</p></div>
    <div class="case-layout">
      <div class="case-overview"><h2>项目中的工作</h2>${list(project.contribution)}</div>
      <div class="case-sections">
        ${sections}
        <section><h2>阶段成果</h2>${list(project.outcomes)}</section>
        <section><h2>继续推进的部分</h2>${list(project.limits)}</section>
        ${resourceLinks(project.resources)}
      </div>
    </div>
    <a class="pill" href="${category}">返回分类</a>
  </article>`;
}

const revealObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  }
},{threshold:.08});

function currentRoute(){
  const route=location.hash.slice(1)||'home';
  if(route!=='notes')return route;
  history.replaceState(null,'',location.pathname+location.search+'#home');
  return 'home';
}

function render(route=currentRoute()){
  if(!site)return;
  photoStrip=null;
  revealObserver.disconnect();
  renderedRoute=route;

  const work=isWorkRoute(route);
  const projectRoute=route.startsWith('project/');
  const navRoute=work||projectRoute?'work':route;
  header.classList.toggle('dark',route!=='home');
  for(const link of navLinks){
    if(link.hash==='#'+navRoute)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }

  let title;
  let summary=site.description;
  if(route==='home'){
    page.innerHTML=homePage();
    title='Black Q — Projects & Play';
  }else if(work){
    const selected=categoryName(route);
    const visible=route==='work'?projects:groups.get(selected);
    if(!visible){renderNotFound();return}
    page.innerHTML=workIndex(selected,visible);
    title=`${selected||'作品'} — Black Q`;
  }else if(route==='about'){
    page.innerHTML=aboutPage();
    photoStrip=page.querySelector('.photo-strip');
    title='关于我 — Black Q';
  }else{
    const project=projectRoute?projects.find(item=>item.id===route.slice(8)):null;
    if(!project){renderNotFound();return}
    page.innerHTML=projectPage(project);
    title=`${project.name} — Black Q`;
    summary=project.summary||summary;
  }

  document.title=title;
  description.content=summary;
  page.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('load',()=>sendPortraitMotion(frame)));
  page.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));
  onScroll();
}

function renderNotFound(){
  page.innerHTML=`<section class="page-title">
    <h1>暂时找不到这个页面。</h1>
    <p>作品可能已更新，去看看当前的集合。</p>
    <a class="pill" href="#work">浏览作品 ↗</a>
  </section>`;
  document.title='页面未找到 — Black Q';
  focusMain();
}

function focusMain(){
  main.focus({preventScroll:true});
}

document.querySelector('.skip').addEventListener('click',event=>{
  event.preventDefault();
  focusMain();
  main.scrollIntoView({behavior:'instant',block:'start'});
});

function onScroll(){
  if(isNavigating||renderedRoute!==currentRoute())return;
  viewMemory.set(renderedRoute,{...viewMemory.get(renderedRoute),scroll:scrollY});
  scrollPhotoStrip();
}

window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);

document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const anchor=event.target.closest('a[href^="#"]');
  if(!anchor)return;

  const next=anchor.hash.slice(1);
  if(!isWorkRoute(next)&&!/^(home|about|project\/[a-z0-9-]+)$/.test(next))return;
  const isFilter=anchor.hasAttribute('data-work-filter');

  if(next===currentRoute()){
    event.preventDefault();
    if(!isFilter){
      focusMain();
      scrollTo({top:0,behavior:animations?'smooth':'instant'});
    }
    return;
  }

  viewMemory.set(renderedRoute,{
    scroll:scrollY,
    focusId:anchor.dataset.projectId,
    focusCategory:anchor.matches('.category-row')?anchor.hash:null,
    focusFilter:isFilter,
  });
  linkNavigation=isFilter?'filter':'page';
});

function restoreFocus(memory){
  let origin;
  if(memory?.focusId){
    origin=page.querySelector(`[data-project-id="${memory.focusId}"]`);
  }else if(memory?.focusCategory){
    origin=[...page.querySelectorAll('.category-row')].find(anchor=>anchor.hash===memory.focusCategory);
  }else if(memory?.focusFilter){
    origin=page.querySelector('[data-work-filter][aria-current="true"]');
  }
  if(origin)origin.focus({preventScroll:true});
  else focusMain();
}

window.addEventListener('hashchange',()=>{
  clearTimeout(routeTimer);
  const route=currentRoute();
  if(route==='main'){
    main.scrollIntoView();
    return;
  }

  const isFilter=linkNavigation==='filter';
  const memory=isFilter?{scroll:scrollY,focusFilter:true}:linkNavigation?null:viewMemory.get(route);
  linkNavigation=null;
  isNavigating=true;

  const navigate=()=>{
    render(route);
    scrollTo({top:memory?.scroll??0,behavior:'instant'});
    restoreFocus(memory);
    isNavigating=false;
    onScroll();
  };

  if(!animations||isFilter){
    navigate();
    return;
  }
  curtain.classList.remove('run');
  const welcome=route==='home';
  curtain.classList.toggle('welcome',welcome);
  if(!welcome)curtainLabel.textContent=route==='about'?'关于我':isWorkRoute(route)?'作品':route.startsWith('project/')?'项目':'探索';
  void curtain.offsetWidth;
  curtain.classList.add('run');
  routeTimer=setTimeout(navigate,310);
});

curtain.addEventListener('animationend',event=>{
  if(event.target===curtain)curtain.classList.remove('run');
});

function sendPortraitMotion(frame){
  frame.contentWindow?.postMessage({type:'bweb:motion',enabled:animations},location.origin);
}

window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='bweb:portrait-ready')return;
  const frame=[...page.querySelectorAll('iframe')].find(item=>item.contentWindow===event.source);
  if(frame)sendPortraitMotion(frame);
});

function syncMotion(){
  animations=!preference.matches;
  document.body.classList.toggle('motion-off',!animations);
  page.querySelectorAll('iframe').forEach(sendPortraitMotion);
  if(!animations)curtain.classList.remove('run');
}

const clockFormat=new Intl.DateTimeFormat('en-GB',{
  timeZone:'Asia/Shanghai',
  hour:'2-digit',
  minute:'2-digit',
  second:'2-digit',
});

function updateClock(){
  clock.textContent=clockFormat.format(new Date())+' CST';
}

async function start(){
  if(main.getAttribute('aria-busy')==='true')return;
  main.setAttribute('aria-busy','true');
  try{
    const response=await fetch('content/projects.json',{cache:'no-store'});
    if(!response.ok)throw new Error('项目数据无法读取');

    const payload=await response.json();
    if(!Array.isArray(payload.projects)||!payload.site)throw new Error('项目数据格式不正确');

    const visible=payload.projects.filter(project=>project.published!==false)
      .sort((a,b)=>(a.order??0)-(b.order??0));
    const ids=new Set(visible.map(project=>project.id));
    if(ids.size!==visible.length||visible.some(project=>!/^[a-z0-9-]+$/.test(project.id))){
      throw new Error('项目标识需要唯一且有效');
    }

    site=payload.site;
    projects=visible;
    groups=groupProjects(visible);
    document.body.classList.toggle('compact-layout',compactPreview||site.compactFooter===true);
    const emailLink=document.querySelector('footer [data-email-link]');
    emailLink.href='mailto:'+site.email;
    emailLink.textContent=site.email;
    emailLink.setAttribute('aria-label','邮件联系 '+site.email);
    render();
  }catch(error){
    header.classList.add('dark');
    page.innerHTML=`<section class="page-title" role="alert">
      <h1>作品暂时无法载入。</h1>
      <p>请刷新页面，或稍后再试。</p>
      <button class="pill" id="retry-content">重新载入</button>
    </section>`;
    page.querySelector('#retry-content').onclick=start;
    console.error('Content loading:',error.message);
    focusMain();
  }finally{
    main.setAttribute('aria-busy','false');
  }
}

preference.addEventListener('change',syncMotion);
syncMotion();
updateClock();
setInterval(updateClock,1000);
start();

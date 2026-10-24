(() => {
  'use strict';
  // Stage 1 is content/layout only. The joint scroll design will get its own release stage.
  const engine=document.querySelector('#engine');
  const container=document.querySelector('.rooms');
  const rooms=[...container.querySelectorAll('.room')];
  const known=rooms.map(room=>room.id),byKey=new Map(rooms.map(room=>[room.id,room]));
  const names={opensight:'OpenSight',vt:'Virginia Tech NLP Lab',nomic:'Nomic AI',production:'Production ML',wildfire:'Wildfire prediction',algae:'Algal-bloom research'};
  let routeSignature='',engineSize='';
  function readRoute(){
    const route=[...new Set(String(engine.dataset.route||'').split(',').filter(key=>known.includes(key)))];
    const order=route.concat(known.filter(key=>!route.includes(key)));
    const signature=order.join(',');
    if(signature===routeSignature)return;
    routeSignature=signature;
    const focused=document.activeElement,restore=focused?.closest?.('.room');
    order.forEach((key,index)=>{
      const room=byKey.get(key),at=container.children[index];
      if(at!==room)container.insertBefore(room,at||null);
    });
    if(restore&&focused.isConnected&&document.activeElement!==focused)focused.focus({preventScroll:true});
  }
  function readSelection(){
    const link=document.querySelector('#result-link');
    link.textContent=(names[link.getAttribute('href').slice(1)]||'Selected work')+' ↓';
  }
  function registerControls(){
    const world=engine.getBoundingClientRect();
    if(!world.width||!world.height)return;
    const paths=[...document.querySelectorAll('button.switch')].map((button,index)=>{
      const r=button.getBoundingClientRect(),x=r.left+r.width/2-world.left;
      return`M${x} 0V${18+index*20}H${world.width/2}V${world.height*.44-100}`;
    });
    const leaders=document.querySelector('.control-leads');
    leaders.setAttribute('d',paths.join(' '));
    leaders.setAttribute('transform',`scale(${1200/world.width} ${660/world.height})`);
    const next=`${world.width},${world.height}`;
    if(engineSize&&next!==engineSize)window.dispatchEvent(new Event('resize'));
    engineSize=next;
  }
  new MutationObserver(readRoute).observe(engine,{attributes:true,attributeFilter:['data-route']});
  new MutationObserver(readSelection).observe(document.querySelector('#result-link'),{attributes:true,attributeFilter:['href']});
  new ResizeObserver(registerControls).observe(engine);
  // One complete static handoff: one retained topic, beside the new constraint.
  document.querySelector('#topic-token').setAttribute('transform','translate(35 221)');
  document.querySelector('#budget-token').setAttribute('opacity','1');
  // Illustrative geometry only, not customer embeddings or observed clusters.
  const field=document.querySelector('#embedding-points'),ns='http://www.w3.org/2000/svg';
  let seed=17;
  for(let i=0;i<105;i++){
    seed=seed*16807%2147483647;const x=95+(seed-1)/2147483646*510;
    seed=seed*16807%2147483647;const y=55+(seed-1)/2147483646*245;
    const dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',i%9===0?3.2:1.8);
    dot.setAttribute('fill','currentColor');dot.setAttribute('opacity','.55');field.append(dot);
  }
  readRoute();readSelection();registerControls();
})();

/* THE PLAN TABLE: spatial layer over the frozen v3 column. The engine owns
   route state; this shell only re-plots. No scroll listeners or clocks. */
(() => {
'use strict';
const plan=document.querySelector('#plan');
if(!plan)return;
const wide=matchMedia('(min-width:900px)');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const main=document.querySelector('main');
const engine=document.querySelector('#engine');
const container=document.querySelector('.rooms');
const rooms=[...container.querySelectorAll('.room')];
const known=rooms.map(r=>r.id),byKey=new Map(rooms.map(r=>[r.id,r]));
const names={opensight:'OpenSight',vt:'Virginia Tech NLP Lab',nomic:'Nomic AI',production:'Production ML',wildfire:'Wildfire prediction',algae:'Algal-bloom research'};
// <plan-math>
// Plan geometry is authored, not measured: viewBox coordinates are the
// single source of truth, mirrored by the title-block mini-map.
const PLANT=[600,150],CONTACT=[600,712];
const DOORS={opensight:[430,315],vt:[650,400],nomic:[1000,420],production:[630,480],wildfire:[400,585],algae:[820,585]};
function waypoints(route){return [PLANT,...route.filter(k=>DOORS[k]).map(k=>DOORS[k]),CONTACT];}
function pathFrom(pts){return 'M'+pts.map(p=>p[0]+' '+p[1]).join(' L');}
function changedSpan(oldPts,newPts){
  let a=0;while(a<Math.min(oldPts.length,newPts.length)&&String(oldPts[a])===String(newPts[a]))a++;
  let b=0;while(b<Math.min(oldPts.length,newPts.length)-a&&String(oldPts[oldPts.length-1-b])===String(newPts[newPts.length-1-b]))b++;
  if(a>=oldPts.length&&a>=newPts.length)return null; // identical routes: nothing re-plotted
  const start=Math.max(0,a-1),end=Math.min(newPts.length,newPts.length-b+1);
  return end-start>=2?newPts.slice(start,end):null;
}
// </plan-math>
// <morph-math>
// The owner-approved matched-pair registry, ported unchanged from option-a
// (a test enforces parity of the registry). Here the pairs play time-based
// at the door being entered instead of scroll-scrubbed.
const NUB='M96 0 L96 2 L96 4 L96 6 L96 8 L96 10 L96 12';
const DESCENT='M96 0 L96 105 L96 205 L96 310 L96 415 L96 515 L96 620';
const MORPHS={
  vt:[[0,NUB],[0.22,DESCENT],[0.46,'M120 310 L280 310 L440 310 L600 310 L760 310 L920 310 L1080 310'],[0.82,'M115 439 L662 562 L1092 349 L546 226 L115 439 L662 562 L1092 349'],[1,'M115 439 L662 562 L1092 349 L546 226 L115 439 L662 562 L1092 349']],
  nomic:[[0,NUB],[0.2,DESCENT],[0.38,'M67 407 L67 407 L67 407 L67 407 L67 407 L67 407 L67 407'],[0.62,'M67 407 L402 491 L728 299 L393 215 L67 407 L402 491 L728 299'],[0.84,'M67 407 L608 542 L1133 233 L592 97 L67 407 L608 542 L1133 233'],[1,'M67 407 L608 542 L1133 233 L592 97 L67 407 L608 542 L1133 233']],
  production:[[0,NUB],[0.2,DESCENT],[0.42,'M140 310 L293 310 L447 310 L600 310 L753 310 L907 310 L1060 310'],[0.62,'M140 310 L293 310 L447 310 L600 310 L753 310 L907 310 L1060 310'],[0.85,'M140 310 L225 310 L311 310 L396 310 L481 310 L566 310 L651 310'],[1,'M140 310 L225 310 L311 310 L396 310 L481 310 L566 310 L651 310']],
  wildfire:[[0,NUB],[0.18,DESCENT],[0.34,'M8 80 L8 170 L8 260 L8 350 L8 440 L8 530 L8 620'],[0.52,'M620 80 L620 170 L620 260 L620 350 L620 440 L620 530 L620 620'],[0.82,'M0 410 L200 357 L400 282 L600 229 L800 258 L1000 210 L1200 171'],[1,'M0 410 L200 357 L400 282 L600 229 L800 258 L1000 210 L1200 171']],
  algae:[[0,NUB],[0.2,DESCENT],[0.45,'M180 480 L180 410 L180 340 L600 340 L1020 340 L1020 410 L1020 480'],[0.6,'M180 480 L180 410 L180 340 L600 340 L1020 340 L1020 410 L1020 480'],[0.85,'M667 480 L667 410 L667 340 L713 340 L760 340 L760 410 L760 480'],[1,'M667 480 L667 410 L667 340 L713 340 L760 340 L760 410 L760 480']]
};
const numbers=d=>d.match(/-?[\d.]+/g).map(Number);
function morphAt(key,p){
  const stops=MORPHS[key];
  if(!stops)return null;
  if(p<=stops[0][0])return stops[0][1];
  for(let i=1;i<stops.length;i++){
    if(p<=stops[i][0]){
      const p0=stops[i-1][0],p1=stops[i][0],t=(p-p0)/(p1-p0);
      const na=numbers(stops[i-1][1]),nb=numbers(stops[i][1]);
      if(na.length!==nb.length)return stops[i][1];
      const pts=[];for(let k=0;k<na.length;k+=2)pts.push(+(na[k]+(nb[k]-na[k])*t).toFixed(1)+' '+(+(na[k+1]+(nb[k+1]-na[k+1])*t).toFixed(1)));
      return 'M'+pts.join(' L');
    }
  }
  return stops[stops.length-1][1];
}
// </morph-math>
const circ=plan.querySelector('#circulation'),flash=plan.querySelector('#circulation-flash');
const mini=document.querySelector('#mini-route'),doorMorph=plan.querySelector('#door-morph');
// Key-plan instrument: IO drives states (unread/visited/current), CSS
// scroll-timeline drives the bead, IO is its stepped fallback. No timers.
const miniRooms=new Map([...document.querySelectorAll('.mini-room')].map(a=>[a.getAttribute('href').slice(1),a]));
const miniFlash=document.querySelector('#mini-flash');
const readout=document.querySelector('.mini-readout'),stamp=document.querySelector('.visit-stamp'),stampRoute=document.querySelector('#visit-route');
const CODES={opensight:'OS',vt:'VT',nomic:'NM',production:'ML',wildfire:'WF',algae:'AB'};
const visited=new Set();let ioCurrent=null;
function paintMini(cur){
  miniRooms.forEach((a,k)=>{
    a.classList.toggle('unread',!visited.has(k));
    const isCur=k===cur;
    a.classList.toggle('current',isCur);
    if(isCur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
  });
}
function checkStamp(){
  if(stamp&&stamp.hidden&&visited.size===known.length){
    stampRoute.textContent=[...visited].map(k=>CODES[k]).join('·');
    stamp.hidden=false;
  }
}
const roomParent=plan.querySelector('#plan-rooms');
const figures=new Map([...roomParent.querySelectorAll('.plan-room')].map(g=>[g.id.slice(5),g]));
const figureLink=key=>figures.get(key)?.querySelector('a');
let active=null,lastD='',lastOrder=[];
// Each sheet carries one spatial control, re-keyed on every re-plot (a patch
// landing mid-read must not strand the target).
const buttons=new Map();
rooms.forEach(r=>{
  const b=document.createElement('button');
  b.type='button';b.className='next-route';
  b.addEventListener('click',()=>{
    const t=b.dataset.target;
    if(t==='about'){deactivate();location.hash='about';}
    else activate(t);
  });
  r.append(b);buttons.set(r.id,b);
});
function replot(){
  const route=[...new Set(String(engine.dataset.route||'').split(',').filter(k=>known.includes(k)))];
  const order=route.concat(known.filter(k=>!route.includes(k)));
  order.forEach(k=>{
    const g=figures.get(k);
    if(g){g.classList.toggle('unfiled',!route.includes(k));roomParent.append(g);} // figure DOM order = route order = SR order
  });
  const pts=waypoints(route),d=pathFrom(pts);
  if(lastD&&d!==lastD){
    const span=changedSpan(waypoints(lastOrder.filter(k=>route.includes(k))),pts);
    if(span&&!reduced.matches){
      flash.setAttribute('d',pathFrom(span));
      flash.classList.remove('run');void flash.getBoundingClientRect();flash.classList.add('run');
      if(miniFlash){miniFlash.setAttribute('d',pathFrom(span));miniFlash.classList.remove('run');void miniFlash.getBoundingClientRect();miniFlash.classList.add('run');}
    }
  }
  circ.setAttribute('d',d);if(mini)mini.setAttribute('d',d);
  lastD=d;lastOrder=order;
  order.forEach((k,i)=>{
    const nxt=order[i+1],b=buttons.get(k);
    b.dataset.target=nxt||'about';
    b.textContent=nxt?('Next on route: '+names[nxt]+' →'):'Finish at the foundation ↓';
    const a=miniRooms.get(k);
    if(a){const n=a.querySelector('.mnum');if(n)n.textContent=String(i+1).padStart(2,'0');a.classList.toggle('ghost',!route.includes(k));}
  });
}
function activate(key,user=true){
  active=key;
  rooms.forEach(r=>r.classList.toggle('active',r.id===key));
  plan.classList.add('reading');
  figures.forEach((g,k)=>g.classList.toggle('current',k===key));
  visited.add(key);paintMini(key);checkStamp();
  if(!user)return;
  const room=byKey.get(key);
  room.focus({preventScroll:true});
  if(wide.matches)room.scrollIntoView({block:'start'});
  if(MORPHS[key]&&!reduced.matches)playDoorMorph(key);
}
function deactivate(){
  active=null;
  rooms.forEach(r=>r.classList.remove('active'));
  plan.classList.remove('reading');
  figures.forEach(g=>g.classList.remove('current'));
  paintMini(wide.matches?null:ioCurrent);
}
function playDoorMorph(key){
  const d=DOORS[key],s=0.16;
  doorMorph.setAttribute('transform','translate('+(d[0]-96*s)+' '+(d[1]-310*s)+') scale('+s+')');
  doorMorph.setAttribute('opacity','1');
  const t0=performance.now(),D=600;
  const frame=now=>{
    if(reduced.matches){doorMorph.setAttribute('opacity','0');return;}
    const p=Math.min(1,(now-t0)/D),e=p<.5?2*p*p:1-((-2*p+2)**2)/2;
    doorMorph.setAttribute('d',morphAt(key,e));
    if(p<1)requestAnimationFrame(frame);
    else setTimeout(()=>doorMorph.setAttribute('opacity','0'),260);
  };
  requestAnimationFrame(frame);
}
// Plan + key-plan activation (wide plan mode); narrow keeps native anchors.
document.querySelectorAll('.plan a.plan-link,.mini-map a').forEach(a=>{
  a.addEventListener('click',e=>{
    const key=a.getAttribute('href').slice(1);
    if(!byKey.has(key)||!wide.matches)return; // contact link and mobile stay native
    e.preventDefault();
    if(active===key)deactivate();else activate(key);
  });
});
addEventListener('keydown',e=>{
  if(e.key==='Escape'&&active){const k=active;deactivate();figureLink(k)?.focus({preventScroll:true});}
});
const toggle=plan.querySelector('#view-toggle');
toggle.addEventListener('click',()=>{
  const on=main.classList.toggle('list-view');
  toggle.setAttribute('aria-pressed',String(on));
  toggle.textContent=on?'Plan view':'List view';
});
new MutationObserver(replot).observe(engine,{attributes:true,attributeFilter:['data-route']});
// Column/list states: highest-ratio room is current; ≥0.5 latches visited.
if('IntersectionObserver' in window&&miniRooms.size){
  const ratios=new Map();
  const io=new IntersectionObserver(entries=>{
    for(const e of entries){ratios.set(e.target.id,e.intersectionRatio);if(e.intersectionRatio>=.5)visited.add(e.target.id);}
    let best=null,bv=0;for(const[k,v]of ratios)if(v>bv){bv=v;best=k;}
    ioCurrent=bv>0?best:null;
    if(!active)paintMini(ioCurrent);
    checkStamp();
  },{threshold:[0,.5]});
  rooms.forEach(r=>io.observe(r));
}
// Hover/focus: the real plan figure answers; the readout registers the room.
miniRooms.forEach((a,k)=>{
  const on=()=>{figures.get(k)?.classList.add('peek');if(readout)readout.textContent=a.querySelector('.mnum').textContent+' · '+names[k];};
  const off=()=>{figures.get(k)?.classList.remove('peek');if(readout)readout.textContent='';};
  a.onmouseenter=a.onfocus=on;a.onmouseleave=a.onblur=off;
});
wide.addEventListener('change',()=>{if(wide.matches){if(!active&&lastOrder.length)activate(lastOrder[0],false);}else deactivate();});
replot();
// Flagship evidence with zero prior interaction: the lead room's sheet
// starts lifted on the wide plan. No focus or scroll is taken.
if(wide.matches&&lastOrder.length)activate(lastOrder[0],false);
})();

(() => {
  'use strict';
  const model = window.SectionModel;
  const engine = document.querySelector('#engine');
  const main = document.querySelector('#main');
  const roomContainer = document.querySelector('.rooms');
  const rooms = [...roomContainer.querySelectorAll('.room')];
  const known = rooms.map(room => room.id);
  const byKey = new Map(rooms.map(room => [room.id, room]));
  const keyPlan = document.querySelector('.key-plan');
  const mapLinks = new Map([...keyPlan.querySelectorAll('[data-map]')].map(link => [link.dataset.map, link]));
  const thread = document.querySelector('.route-thread');
  const base = thread.querySelector('.thread-base');
  const drawn = thread.querySelector('.thread-drawn');
  const head = thread.querySelector('.thread-head');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const svgNode = (tag, attributes) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const clip = svgNode('clipPath', {id:'thread-cut'});
  const clipRect = svgNode('rect', {x:0,y:0,width:1,height:1});
  clip.append(clipRect);
  const defs = svgNode('defs', {});
  defs.append(clip); thread.prepend(defs);
  drawn.setAttribute('clip-path','url(#thread-cut)');
  let order = known.slice(), routeSignature = '', frame = 0, needsLayout = true;
  let geometry = null, regions = [], passageRegions = [], mainTop = 0, lastWidth = 0, lastEngineSize = '';
  const passages = new Map();
  rooms.forEach(room => {
    const spec = model.transitions[room.id];
    const passage = document.createElement('div');
    passage.className = 'passage passage-' + spec.kind;
    passage.setAttribute('aria-hidden','true');
    const drawing = svgNode('svg',{viewBox:'0 0 1100 160',preserveAspectRatio:'none'});
    drawing.append(
      svgNode('path',{class:'passage-structure',d:spec.layer}),
      svgNode('path',{class:'passage-line',d:spec.path,pathLength:1})
    );
    const label = document.createElement('span');
    label.className='passage-label';
    label.textContent=spec.label;
    const anchor = document.createElement('i');
    anchor.className='passage-node';
    passage.append(drawing,label,anchor);
    room.prepend(passage);
    passages.set(room.id,passage);
  });
  function schedule(layout = false) {
    needsLayout = needsLayout || layout;
    if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function readRoute() {
    const next = model.orderedKeys(engine.dataset.route,known);
    const signature = next.join(',');
    if (signature === routeSignature) return;
    routeSignature = signature;
    order = next;
    const focused=document.activeElement;
    const restoreFocus=focused?.closest?.('.room');
    // Mirror the engine's order. No engine state, insertion, or input is modified.
    next.forEach((key,index) => {
      const room=byKey.get(key), link=mapLinks.get(key);
      const at=roomContainer.children[index];
      if (at !== room) roomContainer.insertBefore(room,at || null);
      room.querySelector('.room-order').textContent=String(index+1).padStart(2,'0');
      passages.get(key).hidden=index===0;
      link.querySelector('span').textContent=String(index+1).padStart(2,'0');
      link.setAttribute('aria-label',`${index+1}. ${room.dataset.short}`);
      keyPlan.insertBefore(link,keyPlan.querySelector('div'));
    });
    if (restoreFocus && focused.isConnected && document.activeElement!==focused) focused.focus({preventScroll:true});
    schedule(true);
  }
  function readSelection() {
    const key=document.querySelector('#result-link').getAttribute('href').slice(1);
    document.querySelector('#selected-name').textContent=byKey.get(key)?.dataset.short || 'Selected work';
  }
  function point(element,root) {
    const r=element.getBoundingClientRect();
    return {x:r.left+r.width/2-root.left,y:r.top+r.height/2-root.top};
  }
  function evidencePoint(node,figure,root) {
    if (node.dataset.svgPoint) {
      const svg=figure.querySelector('svg'), matrix=svg?.getScreenCTM();
      if (matrix) {
        const p=svg.createSVGPoint();
        [p.x,p.y]=node.dataset.svgPoint.split(',').map(Number);
        const position=p.matrixTransform(matrix);
        return {x:position.x-root.left,y:position.y-root.top};
      }
    }
    if (node.dataset.anchor) {
      const anchor=figure.querySelector(node.dataset.anchor);
      if (anchor) {
        const r=anchor.getBoundingClientRect();
        return {x:(node.dataset.edge==='right'?r.right:r.left)-root.left,
          y:(node.dataset.vEdge==='top'?r.top:node.dataset.vEdge==='bottom'?r.bottom:r.top+r.height/2)-root.top};
      }
    }
    return point(node,root);
  }
  function measure() {
    const root=main.getBoundingClientRect();
    mainTop=root.top+scrollY;
    const axis=point(document.querySelector('.axis-point'),root).x;
    const engineBox=engine.getBoundingClientRect();
    if (!root.width || !engineBox.width) return;
    const outlet=point(document.querySelector('#outlet'),root);
    const begin={x:outlet.x,y:outlet.y+19};
    const mapped=order.map(key => {
      const room=byKey.get(key), r=room.getBoundingClientRect(), passage=passages.get(key);
      const figure=room.querySelector('figure');
      const fr=figure.getBoundingClientRect();
      let nodes=[...room.querySelectorAll('.thread-node:not([data-thread-ignore])')].map(node=>evidencePoint(node,figure,root));
      // Constrain the route to the visible drawing aperture on narrow screens.
      nodes=nodes.map(p=>({x:model.clamp(p.x,Math.max(axis,fr.left-root.left),Math.min(root.width-20,fr.right-root.left)),y:p.y}));
      const passageBox=passage.hidden?null:passage.getBoundingClientRect();
      const passagePoint=passageBox?point(passage.querySelector('.passage-node'),root):null;
      return {key,top:r.top-root.top,height:r.height,bottom:r.bottom-root.top-18,nodes,
        drawingTop:fr.top-root.top,drawingHeight:fr.height,
        passage:passagePoint?{...passagePoint,bottom:passageBox.bottom-root.top-6}:null,
        passageTop:passageBox?passageBox.top-root.top:0,passageHeight:passageBox?.height || 0};
    });
    const end=point(document.querySelector('#ground-node'),root);
    geometry=model.makeThread(begin,axis,mapped,end);
    base.setAttribute('d',geometry.d);
    drawn.setAttribute('d',geometry.d);
    thread.setAttribute('viewBox',`0 0 ${root.width} ${root.height}`);
    clipRect.setAttribute('width',root.width);
    regions=mapped;
    passageRegions=mapped.filter(region=>region.passage);
    lastWidth=root.width;
    // Leaders are registered to actual controls; the engine remains unmodified.
    const controlLines=[...document.querySelectorAll('button.switch')].map((button,index)=>{
      const r=button.getBoundingClientRect(), x=r.left+r.width/2-engineBox.left;
      return `M${x} 0V${18+index*20}H${engineBox.width/2}V${engineBox.height*.44-100}`;
    });
    const leaders=document.querySelector('.control-leads');
    leaders.setAttribute('d',controlLines.join(' '));
    leaders.setAttribute('transform',`scale(${1200/engineBox.width} ${660/engineBox.height})`);
    const size=`${engineBox.width},${engineBox.height}`;
    if (lastEngineSize && size!==lastEngineSize) window.dispatchEvent(new Event('resize'));
    lastEngineSize=size;
  }
  function paint() {
    frame=0;
    if (needsLayout) {measure();needsLayout=false;}
    if (!geometry || !lastWidth) return;
    const still=reduced.matches || engine.classList.contains('paused');
    document.body.classList.toggle('shell-still',still);
    const viewportCut=innerHeight*(innerWidth<=650?.38:.42);
    const cutY=scrollY+viewportCut-mainTop;
    const first=regions[0], last=regions[regions.length-1];
    const inside=cutY>=first.top-25 && cutY<=last.bottom+45;
    document.body.classList.toggle('section-active',inside&&!still);
    clipRect.setAttribute('height',still?main.scrollHeight:model.clamp(cutY,0,main.scrollHeight));
    const position=model.intersectionAtY(geometry.points,cutY);
    head.setAttribute('cx',position.x);head.setAttribute('cy',position.y);
    head.style.visibility=inside&&!still?'visible':'hidden';
    let current=first;
    regions.forEach(region => {
      const room=byKey.get(region.key);
      if (cutY>=region.top) current=region;
      const t=still?1:model.progressAt(cutY,region.drawingTop-60,region.drawingHeight+60);
      room.style.setProperty('--lift',`${(1-t)*-42}px`);
      room.style.setProperty('--ink-depth',String(.4+.6*t));
      room.style.setProperty('--flow',String(1-t));
    });
    passageRegions.forEach(region => {
      const passage=passages.get(region.key);
      const t=still?1:model.progressAt(cutY,region.passageTop,region.passageHeight);
      passage.style.setProperty('--passage-draw',String(1-t));
      passage.style.setProperty('--passage-lift',`${(1-t)*-38}px`);
      passage.style.setProperty('--passage-depth',String(.25+.75*t));
    });
    mapLinks.forEach((link,key)=>{
      if (key===current.key && inside) link.setAttribute('aria-current','true');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#cut-label').textContent=current.key?byKey.get(current.key).dataset.short:'SECTION ENTRY';
    document.querySelector('#plane-level').textContent=byKey.get(current.key).dataset.short;
    const progress=model.progressAt(cutY,first.top,last.bottom-first.top);
    document.querySelector('#cut-progress').style.setProperty('--progress',`${progress*100}%`);
  }
  const engineObserver=new MutationObserver(mutations=>{
    if (mutations.some(m=>m.attributeName==='data-route')) readRoute();
    schedule(false);
  });
  engineObserver.observe(engine,{attributes:true,attributeFilter:['data-route','class']});
  new MutationObserver(readSelection).observe(document.querySelector('#result-link'),{attributes:true,attributeFilter:['href']});
  // Layout reads are cached; scrolling only paints a single scheduled frame.
  const resizeObserver=new ResizeObserver(()=>schedule(true));
  resizeObserver.observe(main);resizeObserver.observe(engine);
  rooms.forEach(room=>resizeObserver.observe(room));
  window.addEventListener('scroll',()=>schedule(false),{passive:true});
  window.addEventListener('resize',()=>schedule(true),{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(true);});
  reduced.addEventListener('change',()=>schedule(false));
  document.querySelectorAll('details').forEach(details=>details.addEventListener('toggle',()=>schedule(true)));
  document.querySelectorAll('.drawing-crop').forEach(crop=>crop.addEventListener('scroll',()=>schedule(true),{passive:true}));
  // This is illustrative geometry, not customer embeddings or sampled model output.
  let seed=17;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const points=document.querySelector('#embedding-points');
  for(let i=0;i<105;i++){
    const x=95+random()*510, y=55+random()*245;
    points.append(svgNode('circle',{cx:x,cy:y,r:i%9===0?3.2:1.8,fill:'currentColor',opacity:.35+random()*.5}));
  }
  readRoute();readSelection();schedule(true);
})();

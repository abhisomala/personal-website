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

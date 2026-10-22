(() => {
  'use strict';
  const world=document.querySelector('#engine'), canvas=document.querySelector('#wiring');
  const ctx=canvas.getContext('2d',{alpha:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const switches=[...document.querySelectorAll('[data-priority]')];
  const motion=document.querySelector('#motion');
  const projects={
    opensight:{id:'AS—101',text:'OpenSight: I owned multi-agent orchestration and planning for a voice-first assistant for blind and low-vision users. The public demo carries research context into shopping with a budget.',href:'#opensight'},
    nomic:{id:'AS—102',text:'At Nomic AI, I built embedding-visualization infrastructure and ETL used by 250K+ monthly users.',href:'#nomic'},
    production:{id:'AS—103',text:'At a stealth EdTech startup, I work on production ML for time-sensitive course announcements. Workflow latency went from 900 ms to 500 ms. Company and implementation details remain private.',href:'#production'},
    vt:{id:'AS—104',text:'At Virginia Tech’s NLP Research Lab, I led a ten-person team. Later iterations improved MAP by 40%+ relative to our own first working version, not an external benchmark.',href:'#vt'},
    wildfire:{id:'AS—105',text:'Wildfire spread prediction: deep-learning work with 100K+ NASA VIIRS/MODIS data points, plus Kubernetes and Helm infrastructure. Input scope, not a claim of model quality.',href:'#wildfire'},
    algae:{id:'AS—106',text:'Ongoing algal-bloom research uses EPA-measured microcystin ground truth and cross-validation designed to prevent leakage. Current ROC-AUC is 0.58–0.69: modest results, not operational readiness.',href:'#algae'}
  };
  const priorities={
    people:{code:'01',name:'PEOPLE',title:'Put a person<br>at the center.',caption:'OpenSight leads this work index: voice-driven web tasks for blind and low-vision users. Choose a station to inspect the actual contribution.',hub:'HUMAN IN THE LOOP',project:'opensight',active:['opensight','vt'],positions:[[.28,.22],[.80,.22],[.83,.57],[.20,.56],[.65,.72],[.35,.73]]},
    agents:{code:'02',name:'AGENTS',title:'Different specialists.<br>One intent.',caption:'The circuit reconfigures around orchestration. OpenSight connects research to shopping; the earlier entities and intent stay in the conversation.',hub:'CONTEXT CARRIES ON',project:'opensight',active:['opensight','wildfire'],positions:[[.50,.16],[.84,.29],[.84,.62],[.16,.29],[.50,.74],[.16,.62]]},
    planet:{code:'03',name:'PLANET',title:'Noisy signals.<br>Honest answers.',caption:'Environmental work rises to the front. Satellite data for wildfire modeling; measured microcystin for ongoing algal-bloom research.',hub:'MEASURED / NOT MAGIC',project:'algae',active:['algae','wildfire'],positions:[[.20,.23],[.51,.16],[.83,.23],[.84,.62],[.23,.67],[.52,.74]]},
    scale:{code:'04',name:'SCALE',title:'Build for use.<br>Then keep improving.',caption:'The machine aligns around infrastructure and production: Nomic’s embedding visualization and ETL, and lower-latency course announcements.',hub:'FROM MODEL TO USE',project:'nomic',active:['nomic','production'],positions:[[.17,.23],[.51,.16],[.83,.28],[.17,.62],[.49,.74],[.84,.62]]}
  };
  const nodes=[...document.querySelectorAll('.station')].map((el,i)=>({el,key:el.dataset.project,x:0,y:0,vx:0,vy:0,tx:0,ty:0,index:i,drag:false}));
  let priority='people',selected='opensight',width=1,height=1,dpr=1,raf=0,last=0,time=0;
  let paused=reduced.matches,inView=true,dragged=null,pointerId=null,pointerStart=null,dragDistance=0;
  const origin={x:0,y:0};
  const papers={people:'#f0efe9',agents:'#e8edf0',planet:'#e8eee9',scale:'#eceae4'};
  let lowerLimit=height;
  const seedRoute=['opensight','vt','nomic','production','wildfire','algae'];
  let route=seedRoute.slice(),edits=0,cascadeAt=0,patchActive=[];
  let dropPointer=null,dropCandidate=null;
  const portLayer=document.querySelector('#patch-ports'),dropFeedback=document.querySelector('#patch-feedback');
  const names={opensight:'OpenSight',vt:'VT NLP Lab',nomic:'Nomic AI',production:'Production ML',wildfire:'Wildfire',algae:'Algae research'};
  function renderRoute(){
    const list=document.querySelector('#route-trail');list.replaceChildren();
    route.forEach((key,index)=>{
      const li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p');
      a.href=projects[key].href;a.textContent=String(index+1).padStart(2,'0')+' / '+names[key]+' ↗';
      p.textContent=projects[key].text;li.append(a,p);list.append(li);
    });
    const active=patchActive.length?patchActive:route.slice(0,2);
    nodes.forEach(n=>{n.el.dataset.routePosition=route.indexOf(n.key)+1;n.el.classList.toggle('active',active.includes(n.key));});
    world.dataset.route=route.join(',');world.dataset.rewires=edits;
    document.querySelector('#route-state').textContent=edits+' rewires · '+route.map(k=>names[k]).join(' → ');
  }
  function showProject(key,announce=true){
    selected=key;
    const p=projects[key];
    document.querySelector('#result-id').textContent=p.id;
    document.querySelector('#result-text').textContent=p.text;
    document.querySelector('#result-link').href=p.href;
    const gapSelect=document.querySelector('#insert-after'),base=route.filter(k=>k!==key),position=route.indexOf(key);
    gapSelect.replaceChildren();
    base.forEach((after,index)=>{
      if(index===0){const first=document.createElement('option');first.value='start';first.textContent='Before '+names[after];gapSelect.append(first);}
      const option=document.createElement('option');option.value=after;
      option.textContent='After '+names[after]+(base[index+1]?' · before '+names[base[index+1]]:' · at the end');
      gapSelect.append(option);
    });
    gapSelect.value=position?route[position-1]:'start';
    gapSelect.setAttribute('aria-label','Insert '+names[key]+' into this route gap');
    nodes.forEach(n=>n.el.setAttribute('aria-pressed',String(n.key===key)));
    if(announce)document.querySelector('#status').textContent=p.text;
  }
  function setTargets(cascade=false){
    const narrow=width<500;
    origin.x=width*.50;origin.y=height*.44;
    lowerLimit=document.querySelector('.world-bottom').offsetTop-14;
    const p=priorities[priority];
    nodes.forEach((n)=>{
      const i=route.indexOf(n.key),q=p.positions[i];
      const half=n.el.offsetWidth/2+13;
      n.tx=Math.max(half,Math.min(width-half,q[0]*width));
      n.ty=q[1]*height;
      if(narrow){
        // Mobile stations occupy three deliberate rows, keeping every target tappable.
        const layouts={
          people:[[0,0],[1,0],[1,1],[0,1],[0,2],[1,2]],
          agents:[[0,0],[1,0],[1,1],[0,1],[1,2],[0,2]],
          planet:[[0,0],[1,0],[0,2],[1,2],[0,1],[1,1]],
          scale:[[0,1],[0,0],[1,0],[1,1],[0,2],[1,2]]
        };
        const cell=layouts[priority][i],top=132,bottom=lowerLimit-n.el.offsetHeight/2;
        n.tx=Math.max(half,Math.min(width-half,(cell[0]===0?.19:.81)*width));
        n.ty=top+(bottom-top)*cell[1]/2;
      }
      n.ty=Math.min(n.ty,lowerLimit-n.el.offsetHeight/2);
      if(cascade&&!paused&&!reduced.matches){
        n.pending={x:n.tx,y:n.ty};n.tx=n.oldX??n.x;n.ty=n.oldY??n.y;
        n.releaseAt=cascadeAt+i*115;
      }
    });
  }
  function choose(key,initial=false){
    priority=key;const p=priorities[key];
    world.dataset.priority=key;
    document.documentElement.style.setProperty('--paper',papers[key]);
    switches.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.priority===key)));
    document.querySelector('#world-mode').textContent=p.name+' / ROUTE '+p.code;
    document.querySelector('#hub-code').textContent=p.code;
    document.querySelector('#hub-bottom').textContent=p.hub;
    document.querySelector('#route-title').innerHTML=p.title;
    document.querySelector('#route-caption').textContent=p.caption;
    route=[p.project,...route.filter(k=>k!==p.project)];
    patchActive=[];
    if(!initial)edits++;
    showProject(p.project,false);
    document.querySelector('#status').textContent=p.name+'. '+p.caption+' '+projects[p.project].text;
    cascadeAt=performance.now();nodes.forEach(n=>{n.oldX=n.tx;n.oldY=n.ty;});
    setTargets(!initial);renderRoute();
    if(paused||reduced.matches)nodes.forEach(n=>{n.x=n.tx;n.y=n.ty;n.vx=n.vy=0;});
    start();
  }
  function patchRoute(key,index){
    const previous=route.join(',');
    const base=route.filter(k=>k!==key),next=base.slice();
    index=Math.max(0,Math.min(base.length,index));
    next.splice(index,0,key);
    if(next.join(',')===previous){document.querySelector('#status').textContent=names[key]+' is already patched into that gap.';return;}
    const before=base[index-1]||null,after=base[index]||null;
    patchActive=[before,key,after].filter(Boolean);
    route=next;edits++;cascadeAt=performance.now();
    nodes.forEach(n=>{n.oldX=n.tx;n.oldY=n.ty;});
    renderRoute();showProject(key,false);
    document.querySelector('#world-mode').textContent='YOUR ROUTE / EDIT '+String(edits).padStart(2,'0');
    document.querySelector('#hub-code').textContent=String(edits).padStart(2,'0');
    document.querySelector('#hub-bottom').textContent='PATCHED / YOUR ROUTE';
    document.querySelector('#route-title').textContent=names[key]+' is patched in.';
    const connection=(before?names[before]:'Input')+' → '+names[key]+' → '+(after?names[after]:'End');
    document.querySelector('#route-caption').textContent=connection+'. You chose this exact gap. This is your reading route, not a dependency between the projects.';
    world.dataset.lastPatch=JSON.stringify({inserted:key,before,after,index});
    setTargets(true);
    document.querySelector('#status').textContent='Patched into the chosen gap. '+connection+'. The new connection stays after release. '+projects[key].text;
    if(paused||reduced.matches)nodes.forEach(n=>{n.x=n.tx;n.y=n.ty;n.vx=n.vy=0;});
    start();
  }
  function positionNodes(){
    nodes.forEach(n=>n.el.style.transform=`translate(${n.x}px,${n.y}px) translate(-50%,-50%)`);
  }
  function wireFor(order,index){
    const before=index?nodes.find(n=>n.key===order[index-1]):null,after=nodes.find(n=>n.key===order[index]);
    const fx=before?before.x:origin.x,fy=before?before.y:origin.y;
    const tx=after?after.x:Math.max(32,Math.min(width-32,fx+(fx<width/2?100:-100)));
    const ty=after?after.y:Math.min(lowerLimit-10,fy+24);
    const dx=tx-fx,dy=ty-fy,dist=Math.max(1,Math.hypot(dx,dy)),radius=width<500?65:width<750?82:100;
    const sx=before?fx:fx+dx/dist*radius,sy=before?fy:fy+dy/dist*radius;
    const bend=Math.sin(index*2.1+time*.55)*(priority==='agents'?30:13);
    return{sx,sy,tx,ty,cx:(sx+tx)/2-dy/dist*bend,cy:(sy+ty)/2+dx/dist*bend,index,before:before?.key||null,after:after?.key||null};
  }
  function wirePoint(w,t){
    const mid=(w.sx+w.tx)/2,mt=1-t;
    if(priority==='scale'){
      if(t<.25)return{x:w.sx+(mid-w.sx)*t*4,y:w.sy};
      if(t<.75)return{x:mid,y:w.sy+(w.ty-w.sy)*(t-.25)*2};
      return{x:mid+(w.tx-mid)*(t-.75)*4,y:w.ty};
    }
    return{x:mt*mt*w.sx+2*mt*t*w.cx+t*t*w.tx,y:mt*mt*w.sy+2*mt*t*w.cy+t*t*w.ty};
  }
  function findGap(key,point){
    const base=route.filter(k=>k!==key);
    let best=null;
    for(let index=0;index<=base.length;index++){
      const wire=wireFor(base,index),port=wirePoint(wire,.5);
      let distance=Math.hypot(point.x-port.x,point.y-port.y),nearest=port;
      const portHit=distance<25;
      if(!portHit)for(let step=3;step<=37;step++){
        const p=wirePoint(wire,step/40),d=Math.hypot(point.x-p.x,point.y-p.y);
        if(d<distance){distance=d;nearest=p;}
      }
      const score=distance-(portHit?60:0);
      if(distance<(width<500?47:56)&&(!best||score<best.score))best={index,wire,point:nearest,distance,score};
    }
    return best;
  }
  function previewDrop(){
    if(!dragged||dragDistance<=5||!dropPointer){portLayer.hidden=true;dropFeedback.hidden=true;return;}
    const base=route.filter(k=>k!==dragged.key);
    dropCandidate=findGap(dragged.key,dropPointer);
    portLayer.hidden=false;dropFeedback.hidden=false;
    while(portLayer.children.length<base.length+1)portLayer.append(document.createElement('span'));
    [...portLayer.children].forEach((el,index)=>{
      const wire=wireFor(base,index),point=wirePoint(wire,.5);
      el.className='patch-port'+(dropCandidate?.index===index?' candidate':'');
      el.style.transform=`translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;
      el.textContent=String(index+1);el.dataset.index=index;el.dataset.before=wire.before||'start';el.dataset.after=wire.after||'end';
    });
    world.dataset.dropGap=dropCandidate?String(dropCandidate.index):'';
    dropFeedback.textContent=dropCandidate?'PATCH '+(dropCandidate.wire.before?names[dropCandidate.wire.before]:'Input')+' → '+names[dragged.key]+' → '+(dropCandidate.wire.after?names[dropCandidate.wire.after]:'End'):'Choose a wire or numbered gap.';
    dropFeedback.style.left=Math.max(10,Math.min(width-225,dropPointer.x+16))+'px';
    dropFeedback.style.top=Math.max(83,Math.min(lowerLimit-35,dropPointer.y+32))+'px';
  }
  function draw(){
    if(!ctx)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const active=patchActive.length?patchActive:route.slice(0,2);
    // Registered drafting edges and four bolt points keep the mechanism grounded.
    ctx.lineWidth=1;ctx.strokeStyle='#73817a40';
    [[15,75],[width-15,75],[15,height-140],[width-15,height-140]].forEach(([x,y])=>{
      ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();
    });
    const drawingOrder=dragged&&dragDistance>5?route.filter(k=>k!==dragged.key):route;
    previewDrop();
    for(let i=0;i<=drawingOrder.length;i++){
      const w=wireFor(drawingOrder,i),candidate=dragged&&dropCandidate?.index===i;
      ctx.lineWidth=candidate?6:active.includes(w.before)||active.includes(w.after)?3:1.5;ctx.strokeStyle=candidate?'#a34432':'#1f302e';
      ctx.beginPath();ctx.moveTo(w.sx,w.sy);
      const mid=(w.sx+w.tx)/2;
      if(priority==='scale'){ctx.lineTo(mid,w.sy);ctx.lineTo(mid,w.ty);ctx.lineTo(w.tx,w.ty);}
      else ctx.quadraticCurveTo(w.cx,w.cy,w.tx,w.ty);
      ctx.stroke();
      const count=priority==='agents'?4:3;
      for(let j=0;j<count;j++){
        const speed=priority==='scale'?.20:priority==='agents'?.27:.13;
        const p=wirePoint(w,(time*speed+i*.21+j/count)%1);
        ctx.fillStyle='#1f302e';ctx.fillRect(p.x-3,p.y-3,6,6);
      }
      ctx.beginPath();ctx.arc(w.sx,w.sy,4,0,Math.PI*2);ctx.fillStyle=active.includes(w.after)?'#b9cec6':papers[priority];ctx.fill();ctx.strokeStyle='#1f302e';ctx.lineWidth=1;ctx.stroke();
      if(!w.after){ctx.beginPath();ctx.arc(w.tx,w.ty,6,0,Math.PI*2);ctx.stroke();}
    }
    if(dragged&&dropCandidate){
      ctx.setLineDash([4,5]);ctx.strokeStyle='#a34432';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(dragged.x,dragged.y);ctx.lineTo(dropCandidate.point.x,dropCandidate.point.y);ctx.stroke();ctx.setLineDash([]);
    }
    if(priority==='planet'){
      // Contours are illustrative, not environmental observations.
      ctx.strokeStyle='#73817a40';ctx.lineWidth=1;
      for(let j=0;j<4;j++){
        ctx.beginPath();
        for(let x=25;x<width-25;x+=8){
          const y=height*.45+(j-1.5)*20+Math.sin(x*.015-time*1.5+j*.5)*13;
          if(x===25)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
    }
  }
  function frame(stamp){
    raf=0;if(!inView||document.hidden)return;
    const dt=Math.min((stamp-last)/1000||.016,.035);last=stamp;
    const moving=!paused&&!reduced.matches;
    nodes.forEach(n=>{
      if(n.pending&&(!moving||stamp>=n.releaseAt)){
        n.tx=n.pending.x;n.ty=n.pending.y;n.pending=null;
        if(moving){n.vx+=(n.tx-n.x)*.035;n.vy+=(n.ty-n.y)*.035;}
      }
      n.el.classList.toggle('relaying',moving&&edits>0&&stamp>=n.releaseAt&&stamp<n.releaseAt+480);
    });
    if(moving){
      time+=dt;
      nodes.forEach((a,i)=>nodes.slice(i+1).forEach(b=>{
        if(stamp<cascadeAt+1900&&!dragged)return;
        const dx=a.x-b.x,dy=a.y-b.y;
        const rx=(a.el.offsetWidth+b.el.offsetWidth)/2+12,ry=(a.el.offsetHeight+b.el.offsetHeight)/2+12;
        const dist=Math.hypot(dx/rx,dy/ry);
        if(dist<1.06&&dist>.001){
          const push=(1.06-dist)*(a.drag||b.drag?3:1.5);
          if(!a.drag){a.vx+=dx/rx/dist*push;a.vy+=dy/ry/dist*push;}
          if(!b.drag){b.vx-=dx/rx/dist*push;b.vy-=dy/ry/dist*push;}
        }
      }));
      nodes.forEach((n,i)=>{
        if(n.drag)return;
        let ax=0,ay=0;
        if(priority==='people'){ax=Math.sin(time*1.7+i*.7)*3;ay=Math.cos(time*1.5+i)*4;}
        if(priority==='agents'){ax=Math.cos(time*1.4+i*1.047)*7;ay=Math.sin(time*1.4+i*1.047)*7;}
        if(priority==='planet'){ay=Math.sin(time*2+i*.8)*9;ax=Math.cos(time*1.3+i)*3;}
        if(priority==='scale'){ax=Math.sin(time*1.3)*3;ay=Math.cos(time*1.3)*2;}
        const force=priority==='scale'?.025:.018;
        const factor=dt*60;
        n.vx+=(n.tx+ax-n.x)*force*factor;n.vy+=(n.ty+ay-n.y)*force*factor;
        n.vx*=Math.pow(.80,factor);n.vy*=Math.pow(.80,factor);
        n.x+=n.vx*factor;n.y+=n.vy*factor;
      });
      // Rectangle collisions protect real DOM tap targets, including during rerouting.
      for(let iteration=0;iteration<(stamp>=cascadeAt+1900||dragged?8:0);iteration++){
        nodes.forEach((a,i)=>nodes.slice(i+1).forEach(b=>{
          const dx=a.x-b.x,dy=a.y-b.y;
          const px=(a.el.offsetWidth+b.el.offsetWidth)/2+12-Math.abs(dx);
          const py=(a.el.offsetHeight+b.el.offsetHeight)/2+12-Math.abs(dy);
          if(px<=0||py<=0)return;
          const share=a.drag||b.drag?1:.5;
          if(px<py){const push=(dx>=0?1:-1)*px*share;if(!a.drag)a.x+=push;if(!b.drag)b.x-=push;}
          else{const push=(dy>=0?1:-1)*py*share;if(!a.drag)a.y+=push;if(!b.drag)b.y-=push;}
        }));
        nodes.forEach(n=>{
          const hw=n.el.offsetWidth/2+10,hh=n.el.offsetHeight/2;
          n.x=Math.max(hw,Math.min(width-hw,n.x));n.y=Math.max(90+hh,Math.min(lowerLimit-hh,n.y));
        });
      }
    }else nodes.forEach(n=>{if(!n.drag){n.x=n.tx;n.y=n.ty;n.vx=n.vy=0;}});
    positionNodes();draw();
    if(moving)raf=requestAnimationFrame(frame);
  }
  function start(){if(inView&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame);}}
  function resize(){
    const r=world.getBoundingClientRect();const ow=width,oh=height;width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    nodes.forEach(n=>n.pending=null);setTargets();
    nodes.forEach(n=>{if(ow===1||paused||reduced.matches){n.x=n.tx;n.y=n.ty;}else{n.x*=width/ow;n.y*=height/oh;}});
    start();
  }
  nodes.forEach(n=>{
    n.el.hidden=false;
    n.el.setAttribute('aria-description','Drag onto a wire and release to patch that exact gap. Enter inspects. Shift Enter opens gap controls.');
    n.el.setAttribute('aria-keyshortcuts','Shift+Enter ArrowUp ArrowDown ArrowLeft ArrowRight');
    n.el.addEventListener('click',e=>{if(dragDistance>5&&e.detail){e.preventDefault();dragDistance=0;return;}showProject(n.key);});
    n.el.addEventListener('keydown',e=>{
      const vectors={ArrowUp:[0,-24],ArrowDown:[0,24],ArrowLeft:[-24,0],ArrowRight:[24,0]};
      if(!vectors[e.key]||paused||reduced.matches)return;
      e.preventDefault();n.x+=vectors[e.key][0];n.y+=vectors[e.key][1];n.vx=vectors[e.key][0]*.15;n.vy=vectors[e.key][1]*.15;start();
    });
    n.el.addEventListener('pointerdown',e=>{
      dragDistance=0;
      if(e.button!==0||paused||reduced.matches)return;
      dragged=n;pointerId=e.pointerId;pointerStart={x:e.clientX,y:e.clientY};dragDistance=0;
      n.drag=true;n.vx=n.vy=0;n.el.classList.add('dragging');n.el.setPointerCapture(e.pointerId);
      dropCandidate=null;dropPointer=null;
    });
    n.el.addEventListener('pointermove',e=>{
      if(dragged!==n||pointerId!==e.pointerId)return;
      const r=world.getBoundingClientRect();dragDistance=Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y);
      dropPointer={x:e.clientX-r.left,y:e.clientY-r.top};previewDrop();
      n.x=Math.max(n.el.offsetWidth/2+8,Math.min(width-n.el.offsetWidth/2-8,e.clientX-r.left));
      n.y=Math.max(100+n.el.offsetHeight/2,Math.min(lowerLimit-n.el.offsetHeight/2,e.clientY-r.top));start();
    });
    const release=(event)=>{
      if(dragged!==n)return;
      const moved=event.type==='pointerup'&&dragDistance>12,candidate=dropPointer?findGap(n.key,dropPointer):null;
      n.drag=false;n.el.classList.remove('dragging');dragged=null;pointerId=null;
      dropCandidate=null;dropPointer=null;portLayer.hidden=true;dropFeedback.hidden=true;world.dataset.dropGap='';
      if(moved&&candidate)patchRoute(n.key,candidate.index);
      else if(moved)document.querySelector('#status').textContent='No wire chosen. The route is unchanged. Drop onto a highlighted wire or use the insert-after controls.';
      start();
    };
    n.el.addEventListener('pointerup',release);n.el.addEventListener('pointercancel',release);n.el.addEventListener('lostpointercapture',release);
  });
  switches.forEach(b=>{b.hidden=false;b.addEventListener('click',()=>{if(priority!==b.dataset.priority)choose(b.dataset.priority);});});
  document.querySelectorAll('.fallback').forEach(a=>a.hidden=true);
  document.querySelector('#rewire-selected').hidden=false;
  document.querySelector('#patch-controls').hidden=false;
  document.querySelector('#rewire-selected').addEventListener('click',()=>{
    const after=document.querySelector('#insert-after').value,base=route.filter(k=>k!==selected);
    patchRoute(selected,after==='start'?0:base.indexOf(after)+1);
  });
  document.querySelector('#reset-engine').hidden=false;
  document.querySelector('#reset-engine').addEventListener('click',()=>{route=seedRoute.slice();edits=0;nodes.forEach(n=>n.pending=null);choose('people',true);document.querySelector('#status').textContent='Original reading route restored.';});
  nodes.forEach(n=>n.el.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.shiftKey){e.preventDefault();showProject(n.key,false);document.querySelector('#insert-after').focus();}}));
  document.documentElement.classList.add('js');
  function updateMotion(){
    motion.textContent=paused?'Enable motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));
    document.querySelector('.hub').style.setProperty('animation-play-state',paused?'paused':'running');
    world.classList.toggle('paused',paused);start();
  }
  motion.hidden=false;motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;updateMotion();});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(inView)start();else{cancelAnimationFrame(raf);raf=0;}
    world.classList.toggle('offscreen',!inView);
  },{threshold:.02}).observe(world);
  document.addEventListener('visibilitychange',()=>{
    world.classList.toggle('offscreen',document.hidden||!inView);
    if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();
  });
  window.addEventListener('resize',resize,{passive:true});
  resize();choose('people',true);updateMotion();
})();

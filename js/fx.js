'use strict';
/* sound + canvas particles + background floaters */
let audioCtx=null,musicTimer=null;
function beep(f,d,t,v){if(S.muted)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();
const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);
o.frequency.value=f;o.type=t||'sine';g.gain.setValueAtTime(v||0.07,audioCtx.currentTime);
g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);o.start();o.stop(audioCtx.currentTime+d);}catch(e){}}
const pop=()=>beep(400+Math.random()*300,0.09);
const buyS=()=>{beep(520,0.1,'square',0.05);setTimeout(()=>beep(780,0.12,'square',0.05),80);};
const achS=()=>{[660,880,1320].forEach((f,i)=>setTimeout(()=>beep(f,0.15,'triangle',0.07),i*110));};
const goldS=()=>{[880,1100,1400,1760].forEach((f,i)=>setTimeout(()=>beep(f,0.18,'sine',0.08),i*90));};
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;$('toasts').appendChild(d);setTimeout(()=>d.remove(),3400);}
const fx=$('fx'),fctx=fx.getContext('2d');let parts=[];
function sizeFx(){fx.width=innerWidth;fx.height=innerHeight;}
addEventListener('resize',sizeFx);sizeFx();
function burst(x,y,crit){if(!S.set.particles)return;
const em=crit?['💥','🔥','🍣','⭐']:['🍣','🍙','✨','🍶'];
for(let i=0;i<(crit?26:10);i++)parts.push({x,y,vx:(Math.random()-0.5)*7,vy:-2-Math.random()*5,l:1,e:em[Math.floor(Math.random()*em.length)],s:12+Math.random()*14});}
setInterval(()=>{fctx.clearRect(0,0,fx.width,fx.height);parts=parts.filter(p=>p.l>0);
for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=0.25;p.l-=0.018;fctx.globalAlpha=Math.max(p.l,0);
fctx.font=p.s+'px serif';fctx.fillText(p.e,p.x,p.y);}fctx.globalAlpha=1;},33);
function bgFloaters(){const bf=$('bgFloat'),em=['🍣','🍱','🍙','🦐','🍶'];
for(let i=0;i<16;i++){const s=document.createElement('span');s.textContent=em[i%em.length];
s.style.left=Math.random()*100+'vw';s.style.fontSize=(16+Math.random()*26)+'px';
s.style.animationDuration=(14+Math.random()*20)+'s';s.style.animationDelay=(-Math.random()*20)+'s';bf.appendChild(s);}}

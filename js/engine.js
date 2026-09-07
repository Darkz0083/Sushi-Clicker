'use strict';
/* core loop: clicks, buys, goldens, events, quests, market, rival, prestige */
function doClick(ev){const now=Date.now();combo=combo.filter(t=>now-t<2000);combo.push(now);
S.maxCombo=Math.max(S.maxCombo,combo.length);
const crit=Math.random()<critChance();let g=clickGain();if(crit){g*=13;S.crits=(S.crits||0)+1;}
if(g>0){gain(g);S.handmade+=g;}S.totalClicks++;
if(crit&&S.set.shake){$('app').classList.remove('shake');void $('app').offsetWidth;$('app').classList.add('shake');}
pop();let cx=innerWidth/2,cy=300;if(ev&&ev.clientX){cx=ev.clientX;cy=ev.clientY;}burst(cx,cy,crit);
const f=document.createElement('div');f.className='float'+(crit?' crit':'');
f.textContent=(crit?'CRIT +':' +')+fmt(g);f.style.left='150px';f.style.top='70px';
$('bigWrap').appendChild(f);setTimeout(()=>f.remove(),1000);
checkAch();updateHUD();}
function buyB(id){const b=B.find(x=>x.id===id),o=S.buildings[id]||0;let q,c;
if(buyAmt==='max'){const r=bMax(b,o,S.sushi);q=r.q;c=r.cost;}else{q=buyAmt;c=bCost(b,o,q);}
if(q<1||S.sushi<c)return;S.sushi-=c;S.buildings[id]=o+q;buyS();renderAll();save();}
function buyU(id){const u=UPGRADES.find(x=>x.id===id);if(!u||S.upgrades[id]||S.sushi<u.cost)return;
S.sushi-=u.cost;S.upgrades[id]=1;toast(u.icon+' '+u.name);buyS();renderAll();save();}
const availU=()=>UPGRADES.filter(u=>!S.upgrades[u.id]&&u.req(S));
/* quests */
function newQuest(){const kinds=['click','bake','own','gold'];const k=kinds[Math.floor(Math.random()*kinds.length)];
if(k==='click')return{kind:k,goal:150,base:S.totalClicks};
if(k==='bake')return{kind:k,goal:Math.floor(Math.max(10000,rawCps()*300)),base:S.runEarned};
if(k==='own')return{kind:k,goal:12,base:totalB(S)};
return{kind:k,goal:1,base:S.golden||0};}
function questProg(q){if(!q)return 0;if(q.kind==='click')return S.totalClicks-q.base;
if(q.kind==='bake')return S.runEarned-q.base;if(q.kind==='own')return totalB(S)-q.base;return (S.golden||0)-q.base;}
function questReward(){return Math.max(5000,rawCps()*180+1000);}
function ensureQuests(){if(!S.quests||S.quests.length!==3)S.quests=[newQuest(),newQuest(),newQuest()];}
/* special spawns */
function spawn(el,cb,dur){el.style.display='block';el.style.left=(8+Math.random()*80)+'vw';
el.style.top=(14+Math.random()*60)+'vh';
const t=setTimeout(()=>{el.style.display='none';el.onclick=null;},dur||13000);
el.onclick=()=>{clearTimeout(t);el.style.display='none';el.onclick=null;cb();};}
function goldRewardMult(){const now=Date.now();if(now-S.lastGold<120000)S.lucky++;else S.lucky=1;
S.lastGold=now;return 1+S.lucky*0.1;}
function showGold(which){
if(which==='golden')spawn($('golden'),()=>{goldS();S.golden++;const m=goldRewardMult()*greedMult();
const roll=Math.random(),base=Math.max(rawCps(),1);
if(roll<0.4){frenzyUntil=Date.now()+30000;toast('✨ FRENZY x7 30s! (streak x'+S.lucky+')');}
else if(roll<0.75){const b2=(Math.min(S.sushi*0.15,base*900)+13)*m;gain(b2);toast('✨ LUCKY +'+fmt(b2)+'!');}
else if(roll<0.9){clickFrenzyUntil=Date.now()+15000;toast('✨ CLICK x777 15s!');}
else{gain(base*60*m);toast('✨ RUSH +'+fmt(base*60*m)+'!');}checkAch();updateHUD();save();});
else if(which==='ruby')spawn($('ruby'),()=>{goldS();S.golden++;goldRewardMult();
clickFrenzyUntil=Date.now()+20000;frenzyUntil=Date.now()+20000;
toast('❤️ RUBY RAGE! x7 + x777 20s!');checkAch();updateHUD();save();});
else if(which==='diamond')spawn($('diamond'),()=>{goldS();S.golden++;const m=goldRewardMult()*greedMult();
const b2=Math.max(rawCps()*300,S.sushi*0.25)*m;gain(b2);toast('💎 DIAMOND +'+fmt(b2)+'!');checkAch();updateHUD();save();});
else if(which==='emerald')spawn($('emerald'),()=>{goldS();S.golden++;goldRewardMult();
emerUntil=Date.now()+300000;toast('💚 EMERALD! CPS x3 for 5 MIN!');checkAch();updateHUD();save();});
else spawn($('rainbow'),()=>{goldS();S.golden++;goldRewardMult();rbowUntil=Date.now()+120000;
frenzyUntil=Date.now()+60000;toast('🌈 RAINBOW! CPS x5 + frenzy 60s!');checkAch();updateHUD();save();});}
function goldenLoop(){let mag=(S.pUp.p_mag?0.5:1)*(S.research.radar&&S.research.radar.done?0.8:1);
if(season().n.includes('Autumn'))mag*=0.5;
setTimeout(()=>{if(!$('offlineModal').classList.contains('open')){const r=Math.random();
if(r<0.45)showGold('golden');else if(r<0.65)showGold('ruby');else if(r<0.8)showGold('diamond');
else if(r<0.93)showGold('emerald');else showGold('rainbow');}goldenLoop();},(75+Math.random()*105)*1000*mag);}
function eventLoop(){setTimeout(()=>{const evs=EV();const e=evs[Math.floor(Math.random()*evs.length)];
try{e.f();}catch(_){}toast(e.n+' '+e.t);
const f=$('eventFeed');f.innerHTML='• '+e.n+' '+e.t+'<br>'+f.innerHTML;updateHUD();eventLoop();},65000+Math.random()*65000);}
function checkAch(){for(const a of ACH){if(!S.ach[a.id]){try{if(a.c(S)){S.ach[a.id]=1;
toast('🏆 '+a.n+' — '+a.d);achS();}}catch(e){}}}}
function wipeRun(){S.sushi=S.pUp.p_head?10000:0;S.runEarned=0;S.buildings={};S.upgrades={};S.exps=[];
frenzyUntil=clickFrenzyUntil=sacUntil=0;}
function doAscend(earn){S.stars+=earn;S.ascensions++;S.activeCh='';wipeRun();
toast('🌟 +'+earn+' stars!');renderAll();save();}

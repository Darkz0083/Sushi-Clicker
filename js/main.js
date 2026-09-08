'use strict';
/* wiring + boot + all tick loops */
function tab(w){[['tB','pB'],['tU','pU'],['tQ','pQ'],['tM','pM'],['tL','pL'],['tG','pG'],['tD','pD'],['tC','pC'],['tP','pP'],['tS','pS']]
.forEach(([t,p])=>{$(t).classList.toggle('active',p==='p'+w);$(p).style.display=p==='p'+w?'':'none';});
if(w==='G')renderGames();if(w==='S')renderStats();}
function applySet(){$('sParticles').checked=S.set.particles;$('sShake').checked=S.set.shake;$('sFull').checked=S.set.full;
document.body.classList.toggle('light',S.theme==='light');
$('themeBtn').textContent=S.theme==='light'?'☀️':'🌙';$('muteBtn').textContent=S.muted?'🔇':'🔊';
if(S.music)$('musicBtn').style.opacity='1';}
function wire(){
$('bigSushi').addEventListener('pointerdown',doClick);
addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON|SELECT/.test(document.activeElement.tagName)){e.preventDefault();doClick(null);}});
document.querySelectorAll('.buybar button').forEach(b=>b.onclick=()=>{
document.querySelectorAll('.buybar button').forEach(x=>x.classList.remove('active'));
b.classList.add('active');buyAmt=b.dataset.amt==='max'?'max':parseInt(b.dataset.amt,10);renderShop();});
$('tB').onclick=()=>tab('B');$('tU').onclick=()=>tab('U');$('tQ').onclick=()=>tab('Q');
$('tM').onclick=()=>{tab('M');renderMarket();};$('tL').onclick=()=>tab('L');$('tG').onclick=()=>tab('G');
$('tD').onclick=()=>tab('D');$('tC').onclick=()=>{tab('C');renderCollection();};$('tP').onclick=()=>tab('P');$('tS').onclick=()=>tab('S');
$('cat').onclick=e=>{let catM=season().n.includes('Winter')?1.5:1;
const p=clickGain()*3*S.catLvl*(S.pUp.p_paws?2:1)/2*catM;if(p<=0)return;
gain(p);burst(e.clientX,e.clientY,false);pop();updateHUD();};
$('catUp').onclick=()=>{const c=5000*Math.pow(10,S.catLvl-1);if(S.sushi<c)return;
S.sushi-=c;S.catLvl++;buyS();updateHUD();save();};
$('specSel').onchange=e=>{S.spec=e.target.value;renderShop();updateHUD();save();toast('🎯 Focus updated');};
$('managerBtn').onclick=()=>{S.manager=!S.manager;updateHUD();save();toast('🤖 '+(S.manager?'ON':'OFF'));};
$('sacBtn').onclick=()=>{if(totalB(S)<20){toast('Need 20+ buildings!');return;}
for(const k in S.buildings)S.buildings[k]=Math.floor(S.buildings[k]*0.9);
sacUntil=Date.now()+60000;toast('🔥 CPS x2 60s!');buyS();renderAll();save();};
$('dailyBtn').onclick=()=>{if(!S.dailyReady)return;
const dr=[5000,25000,150000,1e6,8e6,50e6,300e6];const rw=Math.max(rawCps()*120,dr[S.streak%7]);
gain(rw);S.dailyReady=false;S.lastDay=new Date().toDateString();S.streak=Math.min(S.streak+1,7);
toast('🎁 +'+fmt(rw)+'!');goldS();updateHUD();save();};
$('goExp').onclick=()=>{if(S.exps.length>=3){toast('Max 3!');return;}
const w=S.sushi*0.1;if(w<10000){toast('Need 10k+!');return;}
S.sushi-=w;S.exps.push({at:Date.now()+60000,wager:w});toast('⛵ Back in 60s!');updateHUD();save();};
$('rivalBtn').onclick=()=>{if(S.rival&&Date.now()<S.rival.ends)return;
S.rival={p0:S.runEarned,score:0,rps:Math.max(rawCps(),10)*(0.8+Math.random()*0.5),ends:Date.now()+300000};
toast('🔪 RACE! 5 min!');updateHUD();save();};
$('rerollQ').onclick=()=>{const c=S.sushi*0.05;if(S.sushi<c)return;S.sushi-=c;
S.quests=[newQuest(),newQuest(),newQuest()];renderAll();save();};
function gardenUpdate(){
const gi=$('gardenInfo');if(!gi)return;
if(S.gardenPlant&&Date.now()>=S.gardenReady&&S.gardenCrop){gi.innerHTML='Ready to harvest '+S.gardenCrop+'!';return;}
if(S.gardenPlant){gi.innerHTML='Growing… '+Math.max(0,Math.ceil((S.gardenReady-Date.now())/1000))+'s left';return;}
gi.innerHTML='Empty plot. Plant a crop!';}
$('plantRice').onclick=()=>plantCrop(0);$('plantWas').onclick=()=>plantCrop(1);$('plantGold').onclick=()=>plantCrop(2);
function plantCrop(i){if(S.gardenPlant){toast('Already growing!');return;}
const c=CROPS[i];S.gardenPlant=c.time;S.gardenReady=Date.now()+c.time*1000;S.gardenCrop=c.e+' '+c.n;buyS();gardenUpdate();save();}
$('harvestBtn').onclick=()=>{if(!S.gardenPlant||Date.now()<S.gardenReady||!S.gardenCrop){toast('Nothing ready!');return;}
const c=CROPS.find(x=>(c_e=>true)(0)&&(x.e+' '+x.n)===S.gardenCrop)||CROPS[0];
const w=Math.max(rawCps()*60*c.mult,5000);gain(w);S.gardenPlant=0;S.gardenReady=0;S.gardenCrop='';
toast('🌱 Harvest +'+fmt(w)+'!');goldS();gardenUpdate();updateHUD();save();};
$('factoryBtn').onclick=()=>{S.factoryAuto=!S.factoryAuto;factoryUpdate();save();};
function factoryUpdate(){const fi=$('factoryInfo');if(!fi)return;
fi.innerHTML=S.factoryAuto?'ON — crafts cheapest upgrade every 30s':'OFF';}
$('themeBtn').onclick=()=>{S.theme=S.theme==='dark'?'light':'dark';applySet();save();};
$('muteBtn').onclick=()=>{S.muted=!S.muted;applySet();save();};
$('musicBtn').onclick=()=>{S.music=!S.music;$('musicBtn').style.opacity=S.music?'1':'.4';
if(S.music){const n=[262,294,330,392,440,523];musicTimer=setInterval(()=>{if(!S.muted)beep(n[Math.floor(Math.random()*n.length)],0.4,'triangle',0.03);},500);}
else clearInterval(musicTimer);save();};
$('saveBtn').onclick=()=>{save();toast('💾 Saved!');};
$('resetBtn').onclick=()=>{if(confirm('Delete EVERYTHING?')){localStorage.removeItem(KEY);location.reload();}};
$('expBtn').onclick=()=>{save();prompt('Copy save:',btoa(unescape(encodeURIComponent(JSON.stringify(S)))));};
$('impBtn').onclick=()=>{const s=prompt('Paste save:');if(!s)return;
try{const p=JSON.parse(decodeURIComponent(escape(atob(s))));const f=fresh();S=Object.assign(f,p);S.set=Object.assign(f.set,p.set||{});S.stocks=Object.assign(f.stocks,p.stocks||{});S.prices=Object.assign(f.prices,p.prices||{});applySet();renderAll();save();toast('📥 Loaded!');}catch(e){alert('Bad save.');}};
$('sParticles').onchange=e=>{S.set.particles=e.target.checked;save();};
$('sShake').onchange=e=>{S.set.shake=e.target.checked;save();};
$('sFull').onchange=e=>{S.set.full=e.target.checked;renderAll();save();};
$('offlineOk').onclick=()=>$('offlineModal').classList.remove('open');
addEventListener('beforeunload',save);}
/* boot */
const had=load();applySet();ensureQuests();wire();bgFloaters();
(function(){const today=new Date().toDateString(),yd=new Date(Date.now()-864e5).toDateString();
if(had&&S.lastDay!==today){S.streak=(S.lastDay===yd)?S.streak+1:1;S.dailyReady=true;S.lastDay='';}})();
if(had){const away=Math.min((Date.now()-(S.lastSeen||Date.now()))/1000,8*3600);
if(away>60){const g=cps()*away*0.5*offlineMult();gain(g);
$('offlineText').textContent='Gone '+Math.floor(away/60)+'m. Chefs baked +'+fmt(g)+'!';$('offlineModal').classList.add('open');}}
if(S.pUp.p_head&&S.sushi===0&&S.ascensions>0)S.sushi=10000;
if(S.aura)document.body.dataset.aura=S.aura;
S.stocks=Object.assign({nori:0,tuna:0,sake:0,miso:0,uni:0},S.stocks||{});
S.prices=Object.assign({nori:100,tuna:500,sake:2500,miso:12000,uni:60000},S.prices||{});
renderAll();checkAch();drawSpark();
let ni=0;setInterval(()=>{ni=(ni+1)%NEWS.length;$('newsText').textContent=NEWS[ni].replace('X',totalB(S));},9000);
setInterval(()=>{const g=cps()/20;S.sushi+=g;S.totalEarned+=g;S.runEarned+=g;
if(S.runEarned>S.bestRun)S.bestRun=S.runEarned;combo=combo.filter(t=>Date.now()-t<2000);updateHUD();},50);
setInterval(()=>{S.playSec++;cpsHist.push(cps());cpsHist.shift();drawSpark();
for(const r of RESEARCH){const st=S.research[r.id];
if(st&&!st.done&&Date.now()-st.at>r.time*1000){st.done=true;toast('🧪 Done: '+r.n+'!');goldS();}}
S.exps=S.exps.filter(e=>{if(Date.now()>=e.at){const loot=e.wager*(2+Math.random()*3);
gain(loot);S.expsDone=(S.expsDone||0)+1;toast('⛵ +'+fmt(loot)+'!');goldS();
if(Math.random()<0.15)dropRelic(['bell']);return false;}return true;});
if(S.rival&&Date.now()>=S.rival.ends){const p=S.runEarned-S.rival.p0;
if(p>S.rival.score){const prize=S.rival.score*0.25+rawCps()*60;gain(prize);frenzyUntil=Date.now()+30000;
dropRelic(['coin']);toast('🏆 BEAT RIVAL! +'+fmt(prize)+'!');}else toast('😞 Rival won.');S.rival=null;}
if(S.rival)S.rival.score+=S.rival.rps;
if(S.activeCh&&S.runEarned>=1e8){S.doneCh[S.activeCh]=true;toast('🎯 BEATEN: '+S.activeCh+'!');achS();S.activeCh='';}
if(S.manager){let best=null,bc=1e300;for(const b of B){const c=bCost(b,S.buildings[b.id]||0,1);
if(c<S.sushi&&c<bc){bc=c;best=b;}}if(best){S.sushi-=bc;S.buildings[best.id]=(S.buildings[best.id]||0)+1;}}
if(S.factoryAuto&&!window._factT||S.factoryAuto&&Date.now()-window._factT>30000){window._factT=Date.now();
const av=availU().filter(u=>S.sushi>=u.cost).sort((a,b)=>a.cost-b.cost)[0];
if(av){S.sushi-=av.cost;S.upgrades[av.id]=1;toast('🏭 Factory crafted: '+av.icon+' '+av.name);}}
gardenUpdate();factoryUpdate();checkAch();renderShop();updateHUD();},1000);
setInterval(()=>{for(const st of DSTOCKS){S.prices[st.id]=Math.max(5,S.prices[st.id]*(0.9+Math.random()*0.2));}},5000);
setInterval(()=>{if(rawCps()>0){let m=season().n.includes('Winter')?1.5:1;
gain(clickGain()*3*S.catLvl*(S.pUp.p_paws?2:1)*(Date.now()<catBoostUntil?3:1)*m);}},8000);
setInterval(save,15000);goldenLoop();eventLoop();

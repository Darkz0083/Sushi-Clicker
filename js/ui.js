'use strict';
/* all rendering: HUD, shop, upgrades, quests, market, lab, dex, prestige, stats */
function row(k,v){return '<div class="statrow"><span>'+k+'</span><b>'+v+'</b></div>';}
function updateHUD(){$('sushiCount').textContent=fmt(S.sushi)+' sushi';
$('perSecond').textContent='per second: '+fmt(cps());$('perClick').textContent='per click: '+fmt(clickGain());
$('stars').textContent=S.stars;$('rings').textContent=S.rings;
const sn=season();$('seasonTag').textContent=sn.n;$('seasonName').textContent=sn.n+' Season';$('seasonDesc').textContent=sn.d+' • rotates every 5 min';
const lvl=Math.floor(Object.keys(S.ach).length/3);
$('multLine').textContent='🍶 Soy Lv '+lvl+' • ⭐ x'+(1+S.stars*0.05).toFixed(2)+' • 💍 x'+ringBonus().toFixed(2)+' • 🎖️ x'+mileBonus().toFixed(2);
const cm=comboMult();$('comboX').textContent='x'+cm.toFixed(1);
$('comboN').textContent=combo.length>1?'('+combo.length+')':'';$('comboFill').style.width=Math.min(combo.length/50*100,100)+'%';
$('statsMini').innerHTML='baked <b>'+fmt(S.totalEarned)+'</b> • run '+fmt(S.runEarned)+'<br>bldgs '+totalB(S)+' • specials '+(S.golden||0)+' • streak x'+S.lucky+'<br>best run '+fmt(S.bestRun)+' • '+Math.floor(S.playSec/60)+'m';
const bb=$('buffBar');let h='';const t=Date.now();
if(t<frenzyUntil)h+='<div class="buff">✨ x7 '+Math.ceil((frenzyUntil-t)/1e3)+'s</div>';
if(t<clickFrenzyUntil)h+='<div class="buff">👆 x777 '+Math.ceil((clickFrenzyUntil-t)/1e3)+'s</div>';
if(t<stormUntil)h+='<div class="buff red">⛈️ STORM x10 '+Math.ceil((stormUntil-t)/1e3)+'s</div>';
if(t<emerUntil)h+='<div class="buff green">💚 x3 '+Math.ceil((emerUntil-t)/1e3)+'s</div>';
if(t<rbowUntil)h+='<div class="buff">🌈 x5 '+Math.ceil((rbowUntil-t)/1e3)+'s</div>';
if(t<sacUntil)h+='<div class="buff red">🔥 SAC x2 '+Math.ceil((sacUntil-t)/1e3)+'s</div>';
if(t<michUntil)h+='<div class="buff">⭐ MICHELIN '+Math.ceil((michUntil-t)/1e3)+'s</div>';
if(S.activeCh)h+='<div class="buff blue">🎯 '+S.activeCh+'</div>';
bb.innerHTML=h;
let catM=season().n.includes('Winter')?1.5:1;
const catPow=clickGain()*3*S.catLvl*(S.pUp.p_paws?2:1)*(Date.now()<catBoostUntil?3:1)*catM;
$('catInfo').innerHTML='Lv <b>'+S.catLvl+'</b> • auto <b>'+fmt(catPow)+'</b>/8s<br>click 🐱 for '+fmt(catPow/2);
$('catUp').textContent='Level cat — 🍣 '+fmt(5000*Math.pow(10,S.catLvl-1));
$('chTag').textContent=S.activeCh?('🎯 '+S.activeCh+' → 100M! '+fmt(S.runEarned)+'/100M'):'';
$('managerBtn').textContent='🤖 Manager: '+(S.manager?'ON':'OFF');
let belt='';for(const b of B){const o=S.buildings[b.id]||0;for(let i=0;i<Math.min(o,3);i++)belt+=b.emoji+'  ';}
if(!belt)belt='🍣  🍱  🍙  ';$('beltInner').innerHTML=belt+belt;
const dr=[5000,25000,150000,1e6,8e6,50e6,300e6];const drw=Math.max(rawCps()*120,dr[S.streak%7]);
$('dailyInfo').innerHTML='Streak: <b>'+S.streak+' 🔥</b><br>Today: +'+fmt(drw)+(S.dailyReady?'':' (claimed ✓)');
$('dailyBtn').disabled=!S.dailyReady;
let eh='Expeditions return 2-5x wager after 60s.<br>';if(!S.exps.length)eh+='None out.';
for(const e of S.exps)eh+='⛵ '+Math.max(0,Math.ceil((e.at-Date.now())/1000))+'s ('+fmt(e.wager)+')<br>';
$('expInfo').innerHTML=eh;
if(S.rival){const p=S.runEarned-S.rival.p0;const left=Math.ceil((S.rival.ends-Date.now())/1000);
$('rivalInfo').innerHTML=left>0?('You '+fmt(p)+' vs 🍳 '+fmt(S.rival.score)+'<br>'+left+'s left'):'…';}
else $('rivalInfo').innerHTML='No race. Prize: 25% of rival + frenzy.';}
function renderShop(){const bl=$('buildingList');bl.innerHTML='';
for(const b of B){const o=S.buildings[b.id]||0,seen=S.totalEarned>=b.baseCost*0.25||o>0;
let q=buyAmt==='max'?bMax(b,o,S.sushi).q:buyAmt;if(q<1)q=1;
const cost=buyAmt==='max'?bMax(b,o,S.sushi).cost:bCost(b,o,q);const cant=S.sushi<cost;
const d=document.createElement('div');d.className='bld'+(cant?' cant':'')+(seen?'':' locked');
d.innerHTML='<div class="em">'+(seen?b.emoji:'❓')+'</div><div class="info"><b>'+(seen?b.name:'???')+'</b>'+(S.spec===b.id?' 🎯':'')+'<div>'+(seen?b.desc+'<br>'+fmt(b.baseCps*bMult(b.id))+'/s • '+fmt(o*b.baseCps*bMult(b.id))+'/s':'???')+'</div><div class="cost">'+(seen?(buyAmt==='max'?'max ('+bMax(b,o,S.sushi).q+')':'x'+q)+' — 🍣 '+fmt(cost):'')+'</div></div><div class="own">'+(o||'')+'</div>';
if(seen&&!cant)d.onclick=()=>buyB(b.id);bl.appendChild(d);}
const ul=$('upgradeList');ul.innerHTML='';const av=availU();
$('upBadge').textContent=av.length?'('+av.length+')':'';
if(!av.length)ul.innerHTML='<p class="dim">No upgrades. Bake more!</p>';
for(const u of av){const cant=S.sushi<u.cost;const d=document.createElement('div');
d.className='up';d.style.opacity=cant?'.6':'1';
d.innerHTML='<div class="em">'+u.icon+'</div><b>'+u.name+'</b><small>'+u.desc+'</small><span class="cost">🍣 '+fmt(u.cost)+'</span>';
if(!cant)d.onclick=()=>buyU(u.id);ul.appendChild(d);}
renderQuests();renderMarket();renderLab();renderDex();renderPrestige();renderStats();renderSpec();}
function renderQuests(){ensureQuests();const ql=$('questList');ql.innerHTML='';let ready=0;
const qn={click:'👆 Click',bake:'🍣 Bake (run)',own:'🏠 Own buildings',gold:'✨ Specials'};
S.quests.forEach((q,i)=>{const p=Math.max(0,questProg(q)),done=p>=q.goal;if(done)ready++;
const rw=questReward();
const d=document.createElement('div');d.className='q';
d.innerHTML='<b>'+qn[q.kind]+'</b> — '+fmt(Math.min(p,q.goal))+'/'+fmt(q.goal)+'<div class="bar"><div class="fill" style="width:'+Math.min(p/q.goal*100,100)+'%"></div></div><span class="dim">reward '+fmt(rw)+'</span>'+(done?' <button class="pbtn" data-q="'+i+'">Claim +'+fmt(rw)+'</button>':'');
ql.appendChild(d);});
$('questBadge').textContent=ready?'('+ready+')':'';
ql.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const q=S.quests[+b.dataset.q];
if(questProg(q)<q.goal)return;const rw=questReward();gain(rw);S.questsDone++;S.quests[+b.dataset.q]=newQuest();
toast('🎯 Quest! +'+fmt(rw));buyS();renderAll();save();});}
function renderMarket(){let h='';for(const st of DSTOCKS){const p=S.prices[st.id],hold=S.stocks[st.id]||0;
h+='<div class="q"><b>'+st.n+' — '+fmt(p)+'</b> • hold '+hold+' ('+fmt(hold*p)+')<div class="mrow"><button class="pbtn" data-mbuy="'+st.id+'">Buy 1</button><button class="pbtn blue" data-msell="'+st.id+'">Sell all</button></div></div>';}
h+='<p class="dim">Prices drift every 5s. Buy low, sell high. Winter boosts offline gains.</p>';
$('marketBox').innerHTML=h;
$('marketBox').querySelectorAll('[data-mbuy]').forEach(b=>b.onclick=()=>{const id=b.dataset.mbuy;
if(S.sushi<S.prices[id])return;S.sushi-=S.prices[id];S.stocks[id]++;buyS();renderAll();save();});
$('marketBox').querySelectorAll('[data-msell]').forEach(b=>b.onclick=()=>{const id=b.dataset.msell;
if(!S.stocks[id])return;gain(S.stocks[id]*S.prices[id]);S.stocks[id]=0;buyS();renderAll();save();});}
function renderLab(){let h='';for(const r of RESEARCH){const st=S.research[r.id];const done=st&&st.done;const busy=st&&!st.done;
const info=done?'✅ DONE':busy?('⏳ '+Math.max(0,Math.ceil((st.at+r.time*1000-Date.now())/1000))+'s…'):'';
h+='<div class="q"><b>🧪 '+r.n+'</b> — '+r.d+'<br><span class="dim">cost '+fmt(r.cost)+'</span> '+info+((!done&&!busy)?' <button class="pbtn blue" data-r="'+r.id+'">Start</button>':'')+'</div>';}
$('labBox').innerHTML=h;
$('labBox').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=RESEARCH.find(x=>x.id===b.dataset.r);
if(S.sushi<r.cost||S.research[r.id])return;S.sushi-=r.cost;S.research[r.id]={at:Date.now()};buyS();renderAll();save();});}
function renderDex(){const dl=$('dexList');dl.innerHTML='';
for(const d of DEX){const un=S.totalEarned>=d.at;const e=document.createElement('div');
e.className='dexd'+(un?'':' lock');
e.innerHTML='<div class="e">'+(un?d.e:'❓')+'</div><b>'+(un?d.n:'???')+'</b><br><small>'+(un?'+1%':fmt(d.at))+'</small>';
dl.appendChild(e);}}
function renderPrestige(){const earn=Math.floor(Math.sqrt(S.runEarned/1e9));
$('prestigeBox').innerHTML=row('Run earned',fmt(S.runEarned))+row('Stars on ascend','+'+earn+' ⭐')
+row('Stars',S.stars+' (x'+(1+S.stars*0.05).toFixed(2)+')')+row('Rings',S.rings+' (x'+ringBonus().toFixed(2)+')')
+row('Best run',fmt(S.bestRun))
+'<div style="display:grid;gap:6px;margin:10px 0">'+P_UP.map(p=>'<button class="pbtn gold" '+(S.pUp[p.id]||S.stars<p.c?'disabled':'')+' data-p="'+p.id+'">'+(S.pUp[p.id]?'✅ ':'⭐'+p.c+' ')+p.n+' — '+p.d+'</button>').join('')+'</div>'
+'<div style="display:grid;gap:6px;margin:10px 0">'+R_UP.map(p=>'<button class="pbtn blue" '+(S.rUp[p.id]||S.rings<p.c?'disabled':'')+' data-rp="'+p.id+'">'+(S.rUp[p.id]?'✅ ':'💍'+p.c+' ')+p.n+' — '+p.d+'</button>').join('')+'</div>'
+'<button class="pbtn red" id="ascBtn" '+(earn<1?'disabled':'')+'>🌟 ASCEND +'+earn+' ⭐</button>'
+'<button class="pbtn gold" id="ringBtn" '+(S.stars<50?'disabled':'')+'>💍 FORGE RING (50⭐→1💍)</button>'
+'<h3 class="sec" style="margin-top:12px">🎯 Challenges (100M, keep stars/rings)</h3>'
+CHALS.map(c=>'<div class="q"><b>'+c.n+'</b><br><span class="dim">'+c.d+'</span><br>'+(S.doneCh[c.id]?'✅ beaten':S.activeCh===c.id?'▶️ ACTIVE':'<button class="pbtn blue" data-ch="'+c.id+'">Start</button>')+'</div>').join('')
+(S.activeCh?'<button class="pbtn" id="giveUp">Give up</button>':'');
document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=P_UP.find(x=>x.id===b.dataset.p);
if(S.pUp[p.id]||S.stars<p.c)return;S.stars-=p.c;S.pUp[p.id]=1;buyS();renderAll();save();});
document.querySelectorAll('[data-rp]').forEach(b=>b.onclick=()=>{const p=R_UP.find(x=>x.id===b.dataset.rp);
if(S.rUp[p.id]||S.rings<p.c)return;S.rings-=p.c;S.rUp[p.id]=1;buyS();renderAll();save();});
const ab=$('ascBtn');if(ab)ab.onclick=()=>{if(earn<1||!confirm('Ascend +'+earn+' stars?'))return;doAscend(earn);};
const rb=$('ringBtn');if(rb)rb.onclick=()=>{if(S.stars<50||!confirm('Forge ring? Resets run + stars!'))return;
const g=Math.floor(S.stars/50);S.rings+=g;S.stars=S.stars%50;wipeRun();toast('💍 +'+g+' rings!');renderAll();save();};
document.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{if(S.activeCh||!confirm('Start '+b.dataset.ch+'? Run resets.'))return;
wipeRun();S.activeCh=b.dataset.ch;toast('🎯 '+b.dataset.ch+' started! 100M!');renderAll();save();});
const gu=$('giveUp');if(gu)gu.onclick=()=>{S.activeCh='';renderAll();save();};}
function renderStats(){if(cps()>S.bestCps)S.bestCps=cps();
$('statsPanel').innerHTML=row('Bank',fmt(S.sushi))+row('Total',fmt(S.totalEarned))+row('Run',fmt(S.runEarned))
+row('Best run',fmt(S.bestRun))+row('Best CPS',fmt(S.bestCps))+row('CPS',fmt(cps()))+row('Click',fmt(clickGain()))
+row('Buildings',totalB(S))+row('Milestones','x'+mileBonus().toFixed(2))+row('Stocks',fmt((S.stocks.nori||0)*S.prices.nori+(S.stocks.tuna||0)*S.prices.tuna+(S.stocks.sake||0)*S.prices.sake))
+row('Quests',S.questsDone||0)+row('Expeditions',S.expsDone||0)+row('Fish wins',S.fishWins||0)+row('Boss wins',S.bossWins||0);
const al=$('achList');al.innerHTML='';$('achCount').textContent=Object.keys(S.ach).length+'/'+ACH.length;
for(const a of ACH){const w=!!S.ach[a.id];const d=document.createElement('div');
d.className='ach'+(w?' won':'');d.innerHTML=(w?'🏆 ':'🔒 ')+a.n+' — '+a.d;al.appendChild(d);}}
function renderSpec(){const ss=$('specSel');
if(!ss.options.length)ss.innerHTML='<option value="">no focus</option>'+B.map(b=>'<option value="'+b.id+'">'+b.emoji+' '+b.name+' x3</option>').join('');
ss.value=S.spec||'';}
function drawSpark(){const c=$('spark'),x=c.getContext('2d');c.width=c.offsetWidth||300;c.height=56;
const m=Math.max(...cpsHist,1);x.clearRect(0,0,c.width,c.height);x.beginPath();
cpsHist.forEach((v,i)=>{const px=i/(cpsHist.length-1)*c.width,py=c.height-6-(v/m)*(c.height-12);
i?x.lineTo(px,py):x.moveTo(px,py);});x.strokeStyle='#ffcf5c';x.lineWidth=2;x.stroke();}
function renderAll(){renderShop();updateHUD();}

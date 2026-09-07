'use strict';
/* games tab: roulette, slots, fishing, memory, kraken boss */
let fishState=null,memState=null;
function renderGames(){
const gb=$('gamesBox');
gb.innerHTML=
'<div class="gcard"><b>🎰 Wasabi Roulette</b><div style="font-size:44px" id="slot">🎰</div><div class="dim" id="slotMsg">40% x2 • 15% x5</div><div><button class="gbtn" data-bet="0.01">1%</button><button class="gbtn" data-bet="0.1">10%</button><button class="gbtn" data-bet="0.5">50%</button></div></div>'
+'<div class="gcard"><b>🎰 Salmon Slots (cost 1% bank)</b><div style="font-size:40px" id="reels">🍣 🍣 🍣</div><div class="dim" id="reelMsg">3 same = x10 • 2 same = x2</div><button class="gbtn" id="spinBtn">SPIN</button></div>'
+'<div class="gcard"><b>🎣 Fishing Pond (free, 5s cooldown)</b><div style="font-size:40px" id="pond">🌊</div><div class="dim" id="pondMsg">Catch fish for sushi! Rare = huge.</div><button class="gbtn" id="fishBtn">CAST</button></div>'
+'<div class="gcard"><b>🧠 Memory Match (reward scales)</b><div class="dim" id="memMsg">Find all 3 pairs!</div><div class="fgrid" id="memGrid"></div><button class="gbtn" id="memBtn">NEW GAME</button></div>'
+'<div class="gcard"><b>🦑 KRAKEN BOSS (click to attack!)</b><div style="font-size:44px" id="kraken">🦑</div><div class="dim" id="krakenHp">Spawn it!</div><button class="gbtn" id="krakenBtn">SPAWN (costs 60s production)</button><div class="dim">Wins: '+(S.bossWins||0)+' • each win = 300s production + frenzy</div></div>';
gb.querySelectorAll('[data-bet]').forEach(b=>b.onclick=()=>{
const bet=S.sushi*parseFloat(b.dataset.bet);if(bet<10){toast('Need more!');return;}S.sushi-=bet;
const r=Math.random();$('slot').textContent='🎲';
setTimeout(()=>{if(r<0.15){const w=bet*5;gain(w);S.roulette++;$('slot').textContent='💰';$('slotMsg').textContent='JACKPOT +'+fmt(w);goldS();}
else if(r<0.55){const w2=bet*2;gain(w2);S.roulette++;$('slot').textContent='🎉';$('slotMsg').textContent='Win +'+fmt(w2);buyS();}
else{$('slot').textContent='💸';$('slotMsg').textContent='Lost '+fmt(bet);beep(150,0.3,'sawtooth',0.06);}
checkAch();updateHUD();save();},400);});
$('spinBtn').onclick=()=>{
const cost=Math.max(S.sushi*0.01,100);if(S.sushi<cost){toast('Need sushi!');return;}S.sushi-=cost;
const em=['🍣','🍙','🦐','🍶','🐟','💎'];const a=em[Math.floor(Math.random()*em.length)],b2=em[Math.floor(Math.random()*em.length)],c=em[Math.floor(Math.random()*em.length)];
$('reels').textContent=a+' '+b2+' '+c;
if(a===b2&&b2===c){const w=cost*10;gain(w);S.roulette++;$('reelMsg').textContent='JACKPOT +'+fmt(w)+'!';goldS();}
else if(a===b2||b2===c||a===c){const w=cost*2;gain(w);S.roulette++;$('reelMsg').textContent='Pair +'+fmt(w);buyS();}
else $('reelMsg').textContent='No luck…';
checkAch();updateHUD();save();};
$('fishBtn').onclick=()=>{
const now=Date.now();if(fishState&&now-fishState<5000){toast('Wait for a bite…');return;}fishState=now;
$('pond').textContent='🎣';$('pondMsg').textContent='Waiting…';
setTimeout(()=>{const r=Math.random(),base=Math.max(rawCps()*30,1000);let w,emo;
if(r<0.5){w=base*0.5;emo='🐟';}else if(r<0.8){w=base*2;emo='🦐';}
else if(r<0.95){w=base*10;emo='🐙';S.fishWins=(S.fishWins||0)+1;}
else{w=base*50;emo='🐉';S.fishWins=(S.fishWins||0)+1;}
gain(w);$('pond').textContent=emo;$('pondMsg').textContent='Caught '+emo+' +'+fmt(w)+'!';goldS();checkAch();updateHUD();save();},1200);};
$('memBtn').onclick=()=>{
const em=['🍣','🍙','🦐'];let deck=[...em,...em].sort(()=>Math.random()-0.5);
memState={deck,found:[],open:[],moves:0};
const g=$('memGrid');g.innerHTML='';
deck.forEach((e,i)=>{const b=document.createElement('button');b.textContent='❓';b.dataset.i=i;
b.onclick=()=>memFlip(i);g.appendChild(b);});
$('memMsg').textContent='Go!';};
if(S.krakenHp>0)bossPaint();
$('kraken').onclick=()=>bossHit();
$('krakenBtn').onclick=()=>{
const cost=Math.max(rawCps()*60,10000);if(S.krakenHp>0||S.sushi<cost){toast(S.krakenHp>0?'Already fighting!':'Need '+fmt(cost));return;}
S.sushi-=cost;S.krakenMax=S.krakenHp=Math.floor(10+S.totalEarned/1e6+totalB(S)*2);
bossPaint();toast('🦑 KRAKEN! Click it!');};}
function memFlip(i){const m=memState;if(!m||m.found.includes(i)||m.open.includes(i))return;
const btns=$('memGrid').children;btns[i].textContent=m.deck[i];m.open.push(i);
if(m.open.length===2){m.moves++;const[a,b]=m.open;m.open=[];
if(m.deck[a]===m.deck[b]){m.found.push(a,b);buyS();
if(m.found.length===6){const w=Math.max(rawCps()*120,5000)*(1+Math.max(0,6-m.moves)*0.2);
gain(w);S.roulette++;$('memMsg').textContent='Done in '+m.moves+' moves! +'+fmt(w);goldS();checkAch();updateHUD();save();}}
else setTimeout(()=>{btns[a].textContent='❓';btns[b].textContent='❓';},600);}}
function bossPaint(){$('kraken').textContent='🦑';
$('krakenHp').textContent='HP '+fmt(S.krakenHp)+' / '+fmt(S.krakenMax);}
function bossHit(){if(S.krakenHp<=0)return;
const dmg=Math.max(1,Math.floor(clickGain()+rawCps()*0.5+1));S.krakenHp-=dmg;pop();
burst(innerWidth/2,innerHeight/2,false);
if(S.krakenHp<=0){S.krakenHp=0;S.bossWins=(S.bossWins||0)+1;
const w=Math.max(rawCps()*300,50000);gain(w);frenzyUntil=Date.now()+30000;
$('krakenHp').textContent='DEFEATED! +'+fmt(w)+' + frenzy!';
toast('🦑 KRAKEN SLAIN! +'+fmt(w));goldS();checkAch();}
else bossPaint();updateHUD();}

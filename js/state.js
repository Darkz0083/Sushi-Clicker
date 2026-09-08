'use strict';
/* state + math (consumed by engine/ui/minigames) */
const KEY='sushiClickerV5';
let S=fresh(),buyAmt=1;
let frenzyUntil=0,clickFrenzyUntil=0,inspUntil=0,rainUntil=0,catBoostUntil=0,stormUntil=0,michUntil=0,emerUntil=0,sacUntil=0,rbowUntil=0,voidUntil=0;
let combo=[],cpsHist=new Array(60).fill(0);
function fresh(){return{sushi:0,totalEarned:0,runEarned:0,totalClicks:0,handmade:0,buildings:{},upgrades:{},ach:{},
golden:0,crits:0,playSec:0,muted:false,music:false,theme:'dark',stars:0,rings:0,ascensions:0,pUp:{},rUp:{},
catLvl:1,roulette:0,maxCombo:0,lastSeen:Date.now(),spec:'',manager:false,quests:[],questsDone:0,
streak:0,lastDay:'',dailyReady:true,exps:[],expsDone:0,stocks:{nori:0,tuna:0,sake:0,miso:0,uni:0},prices:{nori:100,tuna:500,sake:2500,miso:12000,uni:60000},
research:{},activeCh:'',doneCh:{},rival:null,lucky:0,lastGold:0,bestRun:0,bestCps:0,fishWins:0,memWins:0,slotWins:0,
krakenHp:0,krakenMax:0,bossWins:0,samuraiHp:0,samuraiMax:0,samWins:0,voidWins:0,
relics:{},charms:{},aura:'',titles:[],title:'',factoryAuto:false,gardenPlant:0,gardenReady:0,gardenCrop:'',museum:[],bossRush:0,
set:{particles:true,shake:true,full:false}};}
const $=id=>document.getElementById(id);
const totalB=s=>Object.values(s.buildings).reduce((a,b)=>a+b,0);
const stockTotal=s=>Object.values(s.stocks).reduce((a,b)=>a+b,0);
function fmt(n){if(S.set.full)return Math.floor(n).toLocaleString('en-US');if(n<1000)return Math.floor(n)+'';
const u=['K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc'];let i=-1,v=n;
while(v>=1000&&i<u.length-1){v/=1000;i++;}return(v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+u[i];}
function costMult(){return S.activeCh==='poor'?1.5:1;}
function bCost(b,o,q){let c=0;for(let i=0;i<q;i++)c+=b.baseCost*Math.pow(1.15,o+i);return c*costMult();}
function bMax(b,o,m){let q=0,c=0;while(q<500){const n=b.baseCost*Math.pow(1.15,o+q)*costMult();if(c+n>m)break;c+=n;q++;}return{q,cost:c};}
function bMult(id){let m=1;for(const u of UPGRADES){if(u.building===id&&S.upgrades[u.id])m*=u.mult;if(u.eff&&u.eff[id]&&S.upgrades[u.id])m*=u.eff[id];}
if(S.spec===id)m*=3;return m;}
function mileBonus(){let t=0;for(const k in S.buildings)t+=Math.floor((S.buildings[k]||0)/25);return 1+t*0.02;}
function chalBonus(){let m=1;if(S.doneCh.noclick)m*=1.2;if(S.doneCh.poor)m*=1.25;if(S.doneCh.slow)m*=1.15;return m;}
function resBonus(){let m=1;if(S.research.rice&&S.research.rice.done)m*=1.1;return m;}
function ringBonus(){let m=1+S.rings*0.25;for(const r of R_UP)if(r.id==='r_dawn'&&S.rUp[r.id])m*=1.1;return m;}
function greedMult(){return S.rUp.r_greed?1.5:1;}
function relicBonus(){let m=1;for(const r of RELICS)if(S.relics&&S.relics[r.id])m*=r.mult;return m;}
function charmBonus(){let m=1;for(const c of CHARMS)if(S.charms&&S.charms[c.id])m*=c.mult;return m;}
function auraBonus(){const a=AURAS.find(x=>x.id===S.aura);return a?a.mult:1;}
function museumBonus(){return Math.pow(1.05,(S.museum||[]).length);}
function titleBonus(){let m=1;for(const t of (S.titles||[])){const d=TITLES.find(x=>x.id===t);if(d)m*=d.mult;}return m;}
function season(){return SEASONS[Math.floor(Date.now()/(5*60*1000))%4];}
function rawCps(){let s=0;for(const b of B)s+=(S.buildings[b.id]||0)*b.baseCps*bMult(b.id);
let g=1;if(S.upgrades.soy1)g*=1.5;if(S.upgrades.soy2)g*=2;if(S.upgrades.soy3)g*=2;if(S.upgrades.soy4)g*=1.5;if(S.upgrades.soy5)g*=1.5;if(S.upgrades.soy6)g*=1.5;if(S.upgrades.soy7)g*=2;
if(Date.now()<inspUntil)g*=1.25;if(Date.now()<michUntil)g*=1.5;if(season().n.includes('Summer'))g*=1.15;
if(Date.now()<sacUntil)g*=2;if(Date.now()<emerUntil)g*=3;if(Date.now()<rbowUntil)g*=5;if(Date.now()<voidUntil)g*=10;
return s*g*(1+DEX.filter(d=>S.totalEarned>=d.at).length*0.01)*(1+Math.floor(Object.keys(S.ach).length/3)*0.02)*(1+S.stars*0.05)*ringBonus()*mileBonus()*chalBonus()*resBonus()*relicBonus()*charmBonus()*auraBonus()*titleBonus()*museumBonus()*(S.activeCh==='slow'?0.5:1)*(S.pUp.p_soul?1.25:1);}
function cps(){let v=rawCps();if(Date.now()<frenzyUntil)v*=7;return v;}
function comboMult(){return 1+Math.min(combo.length*(S.upgrades.click6?2:1),200)*0.02;}
function clickBase(){let p=1;if(S.upgrades.click1)p+=1;if(S.upgrades.click3)p+=5;if(S.upgrades.click2)p*=2;if(S.upgrades.click4)p*=2;if(S.upgrades.click7)p*=2;
if(S.upgrades.click9)p*=2;
if(S.research.hands&&S.research.hands.done)p*=1.25;if(season().n.includes('Spring'))p*=1.25;return p;}
function critChance(){return 0.07+(S.research.luck&&S.research.luck.done?0.05:0);}
function clickGain(){if(S.activeCh==='noclick')return 0;let g=clickBase()*comboMult();
if(S.upgrades.click5)g+=rawCps()*0.15;if(S.upgrades.click8)g+=rawCps()*0.02;if(S.upgrades.click10)g+=rawCps()*0.05;
if(Date.now()<clickFrenzyUntil)g*=777;if(Date.now()<rainUntil)g*=3;if(Date.now()<stormUntil)g*=10;return g;}
function gain(n){S.sushi+=n;S.totalEarned+=n;S.runEarned+=n;if(S.runEarned>S.bestRun)S.bestRun=S.runEarned;}
function offlineMult(){return (season().n.includes('Winter')?2:1)*(S.research.vault&&S.research.vault.done?1.25:1)*(S.rUp.r_patience?1.5:1);}
function save(){try{S.lastSeen=Date.now();localStorage.setItem(KEY,JSON.stringify(S));const n=$('saveNote');if(n)n.textContent='autosaved ✓ '+new Date().toLocaleTimeString();}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(!r)return false;const p=JSON.parse(r);const f=fresh();
S=Object.assign(f,p);S.set=Object.assign(f.set,p.set||{});S.stocks=Object.assign(f.stocks,p.stocks||{});
S.prices=Object.assign(f.prices,p.prices||{});return true;}catch(e){return false;}}

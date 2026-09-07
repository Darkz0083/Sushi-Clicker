'use strict';
/* All game content data. B = buildings(26) U = click/global/synergy upgrades */
const B=[
{id:'chop',name:'Chopsticks',emoji:'🥢',baseCost:15,baseCps:.1,desc:'Auto-picks.'},
{id:'kitchen',name:'Home Kitchen',emoji:'🍳',baseCost:100,baseCps:1,desc:'Maki stove.'},
{id:'chef',name:'Sushi Chef',emoji:'👨‍🍳',baseCost:1100,baseCps:8,desc:'Fast hands.'},
{id:'boat',name:'Fishing Boat',emoji:'🎣',baseCost:12000,baseCps:47,desc:'Fresh fish.'},
{id:'rice',name:'Rice Paddy',emoji:'🌾',baseCost:13e4,baseCps:260,desc:'Perfect rice.'},
{id:'tuna',name:'Tuna Farm',emoji:'🐟',baseCost:14e5,baseCps:1400,desc:'Bluefin.'},
{id:'train',name:'Sushi Train',emoji:'🚂',baseCost:2e7,baseCps:7800,desc:'Belt.'},
{id:'factory',name:'Sushi Factory',emoji:'🏭',baseCost:33e7,baseCps:44e3,desc:'Industrial.'},
{id:'wasabi',name:'Wasabi Lab',emoji:'🧪',baseCost:51e8,baseCps:26e4,desc:'Kick.'},
{id:'portal',name:'Salmon Portal',emoji:'🌀',baseCost:75e9,baseCps:16e5,desc:'Dimension.'},
{id:'temple',name:'Dragon Temple',emoji:'🐉',baseCost:1e12,baseCps:1e7,desc:'Gods.'},
{id:'sake',name:'Sake Brewery',emoji:'🍶',baseCost:14e12,baseCps:65e6,desc:'Vibes.'},
{id:'ninja',name:'Ninja Delivery',emoji:'🥷',baseCost:17e13,baseCps:43e7,desc:'Fast.'},
{id:'catcafe',name:'Cat Café',emoji:'🐈',baseCost:21e14,baseCps:29e8,desc:'Cats.'},
{id:'tower',name:'Omakase Tower',emoji:'🗼',baseCost:26e15,baseCps:21e9,desc:'Sky menu.'},
{id:'fuji',name:'Fuji Shrine',emoji:'🗻',baseCost:31e16,baseCps:175e9,desc:'Blessed.'},
{id:'bamboo',name:'Bamboo Grove',emoji:'🎋',baseCost:4e18,baseCps:14e11,desc:'Zen.'},
{id:'aqua',name:'Sashimi Aquarium',emoji:'🦈',baseCost:5e19,baseCps:10e12,desc:'Live tank.'},
{id:'airport',name:'Sushi Airport',emoji:'✈️',baseCost:6e20,baseCps:64e12,desc:'Fly fresh.'},
{id:'trench',name:'Deep-Sea Trench',emoji:'🦑',baseCost:7e21,baseCps:43e13,desc:'Abyss.'},
{id:'moon',name:'Moon Colony',emoji:'🌙',baseCost:9e22,baseCps:29e14,desc:'Low-g rolls.'},
{id:'volcano',name:'Volcano Grill',emoji:'🌋',baseCost:1.2e24,baseCps:2e16,desc:'Lava sear.'},
{id:'atlantis',name:'Atlantis Sushi',emoji:'🧜',baseCost:1.5e25,baseCps:1.3e17,desc:'Sunken recipes.'},
{id:'dojo',name:'Samurai Dojo',emoji:'⚔️',baseCost:2e26,baseCps:9e17,desc:'Blade-cut fish.'},
{id:'robot',name:'Robot Sushi Bar',emoji:'🤖',baseCost:2.6e27,baseCps:6e18,desc:'No breaks.'},
{id:'time',name:'Time Machine',emoji:'⏰',baseCost:3.4e28,baseCps:4e19,desc:'Future fish.'}];
const UPGRADES=[
{id:'click1',name:'Reinforced Chopsticks',icon:'🥢',desc:'+1/click',cost:100,req:s=>s.totalClicks>=15},
{id:'click2',name:'Titanium Chopsticks',icon:'🍴',desc:'click x2',cost:5e3,req:s=>s.totalClicks>=100},
{id:'click3',name:'Wasabi Fingers',icon:'🌶️',desc:'+5/click',cost:5e5,req:s=>s.handmade>=5e3},
{id:'click4',name:'Dragon Grip',icon:'🐲',desc:'click x2',cost:5e7,req:s=>s.handmade>=5e4},
{id:'click5',name:'Golden Palms',icon:'🙌',desc:'click +15% CPS',cost:5e9,req:s=>s.handmade>=5e5},
{id:'click6',name:'Combo Master',icon:'🔥',desc:'combo 2x faster',cost:5e11,req:s=>s.maxCombo>=30},
{id:'click7',name:'Storm Hands',icon:'⛈️',desc:'click x2 more',cost:5e14,req:s=>s.maxCombo>=60},
{id:'click8',name:'Quantum Touch',icon:'⚛️',desc:'click +2% of CPS',cost:5e18,req:s=>s.handmade>=5e8},
{id:'soy1',name:'Soy Glaze',icon:'🍶',desc:'all x1.5',cost:1e6,req:s=>s.totalEarned>=8e5},
{id:'soy2',name:'Premium Nori',icon:'🌿',desc:'all x2',cost:1e8,req:s=>s.totalEarned>=5e7},
{id:'soy3',name:'Omakase Spirit',icon:'👺',desc:'all x2',cost:1e10,req:s=>s.totalEarned>=5e9},
{id:'soy4',name:'Truffle Oil',icon:'🫒',desc:'all x1.5',cost:1e13,req:s=>s.totalEarned>=5e12},
{id:'soy5',name:'Caviar Dreams',icon:'🖤',desc:'all x1.5',cost:1e17,req:s=>s.totalEarned>=5e16},
{id:'syn1',name:'Chef synergy',icon:'🤝',desc:'Kitchen x2 (10 chefs)',cost:5e6,req:s=>(s.buildings.chef||0)>=10,eff:{kitchen:2}},
{id:'syn2',name:'Boat synergy',icon:'🤝',desc:'Tuna x2 (10 boats)',cost:5e8,req:s=>(s.buildings.boat||0)>=10,eff:{tuna:2}},
{id:'syn3',name:'Lab synergy',icon:'🤝',desc:'Rice x2 (10 labs)',cost:5e11,req:s=>(s.buildings.wasabi||0)>=10,eff:{rice:2}},
{id:'syn4',name:'Cat synergy',icon:'🤝',desc:'Tower x2 (5 cafés)',cost:1e16,req:s=>(s.buildings.catcafe||0)>=5,eff:{tower:2}},
{id:'syn5',name:'Ninja synergy',icon:'🤝',desc:'Train x2 (10 ninja)',cost:1e15,req:s=>(s.buildings.ninja||0)>=10,eff:{train:2}},
{id:'syn6',name:'Moon synergy',icon:'🤝',desc:'Airport x2 (5 moon)',cost:1e24,req:s=>(s.buildings.moon||0)>=5,eff:{airport:2}},
{id:'syn7',name:'Robot synergy',icon:'🤝',desc:'Factory x3 (10 robots)',cost:1e28,req:s=>(s.buildings.robot||0)>=10,eff:{factory:3}}];
B.forEach(b=>{
UPGRADES.push({id:b.id+'-m1',building:b.id,mult:2,name:b.name+' I',icon:b.emoji,desc:b.name+' x2',cost:b.baseCost*12,req:s=>(s.buildings[b.id]||0)>=10});
UPGRADES.push({id:b.id+'-m2',building:b.id,mult:2,name:b.name+' II',icon:b.emoji,desc:b.name+' x2',cost:b.baseCost*250,req:s=>(s.buildings[b.id]||0)>=50});});
const DEX=[
{id:'a',e:'🍣',n:'Nigiri',at:100},{id:'b',e:'🍱',n:'Bento',at:1e4},{id:'c',e:'🍙',n:'Onigiri',at:1e6},
{id:'d',e:'🦐',n:'Ebi',at:1e8},{id:'e',e:'🐙',n:'Tako',at:1e10},{id:'f',e:'🦀',n:'Crab',at:1e12},
{id:'g',e:'🐡',n:'Fugu',at:1e14},{id:'h',e:'🐳',n:'Whale',at:1e16},{id:'i',e:'🐉',n:'Dragon',at:1e18},
{id:'j',e:'👑',n:'Emperor',at:1e20},{id:'k',e:'👽',n:'Alien',at:1e22},{id:'l',e:'🌌',n:'Universe',at:1e24}];
const P_UP=[{id:'p_head',n:'Golden Headband',d:'Start runs with 10k',c:1},{id:'p_paws',n:'Lucky Paws',d:'Cat 2x',c:2},{id:'p_mag',n:'Gold Magnet',d:'Goldens 2x often',c:3},{id:'p_soul',n:'Omakase Soul',d:'+25% CPS',c:5}];
const R_UP=[{id:'r_dawn',n:'Dawn Blessing',d:'+10% CPS',c:1},{id:'r_greed',n:'Greed',d:'Golden rewards x1.5',c:2},{id:'r_patience',n:'Patience',d:'Offline x1.5',c:3}];
const RESEARCH=[
{id:'rice',n:'Rice Efficiency',d:'+10% CPS, 60s',cost:1e6,time:60},
{id:'hands',n:'Fast Hands',d:'+25% click, 120s',cost:5e6,time:120},
{id:'radar',n:'Gold Radar',d:'goldens faster, 180s',cost:2e7,time:180},
{id:'vault',n:'Bank Vault',d:'offline +25%, 240s',cost:1e8,time:240},
{id:'luck',n:'Luck Lab',d:'crit +5%, 300s',cost:1e9,time:300}];
const CHALS=[{id:'noclick',n:'🚫 No-Click',d:'Clicks = 0. Reach 100M: +20% CPS.'},{id:'poor',n:'💸 Tax Season',d:'Costs x1.5. Reach 100M: +25% CPS.'},{id:'slow',n:'🐌 Slow Bake',d:'CPS x0.5. Reach 100M: +15% CPS.'}];
const SEASONS=[{n:'🌸 Spring',d:'clicks +25%'},{n:'☀️ Summer',d:'CPS +15%'},{n:'🍂 Autumn',d:'goldens 2x often'},{n:'❄️ Winter',d:'cat +50%, offline 2x'}];
const DSTOCKS=[{id:'nori',n:'🍙 Nori',p:100},{id:'tuna',n:'🐟 Tuna',p:500},{id:'sake',n:'🍶 Sake',p:2500}];
const ACH=[
{id:'c1',n:'First Bite',d:'Click 10x',c:s=>s.totalClicks>=10},{id:'c2',n:'Pro',d:'Click 500x',c:s=>s.totalClicks>=500},
{id:'c3',n:'Tunnel',d:'Click 5k',c:s=>s.totalClicks>=5e3},{id:'c4',n:'Click God',d:'Click 25k',c:s=>s.totalClicks>=25e3},
{id:'e1',n:'Beginner',d:'Bake 1K',c:s=>s.totalEarned>=1e3},{id:'e2',n:'Dealer',d:'Bake 1M',c:s=>s.totalEarned>=1e6},
{id:'e3',n:'Millionaire',d:'Bake 100M',c:s=>s.totalEarned>=1e8},{id:'e4',n:'Empire',d:'Bake 10B',c:s=>s.totalEarned>=1e10},
{id:'e5',n:'Galactic',d:'Bake 1T',c:s=>s.totalEarned>=1e12},{id:'e6',n:'Universal',d:'Bake 1Qa',c:s=>s.totalEarned>=1e15},
{id:'p1',n:'Spread',d:'10/s',c:()=>cps()>=10},{id:'p2',n:'Belt',d:'500/s',c:()=>cps()>=500},
{id:'p3',n:'Volcano',d:'50K/s',c:()=>cps()>=5e4},{id:'p4',n:'Black Hole',d:'10M/s',c:()=>cps()>=1e7},
{id:'b1',n:'Family',d:'Own 10',c:s=>totalB(s)>=10},{id:'b2',n:'Franchise',d:'Own 75',c:s=>totalB(s)>=75},
{id:'b3',n:'Zaibatsu',d:'Own 200',c:s=>totalB(s)>=200},{id:'b4',n:'Monopoly',d:'Own 400',c:s=>totalB(s)>=400},
{id:'g1',n:'Golden',d:'1 special',c:s=>s.golden>=1},{id:'g2',n:'Hunter',d:'7 specials',c:s=>s.golden>=7},
{id:'g3',n:'Bling',d:'20 specials',c:s=>s.golden>=20},{id:'k1',n:'Combo',d:'15 combo',c:s=>s.maxCombo>=15},
{id:'k2',n:'Unstoppable',d:'50 combo',c:s=>s.maxCombo>=50},{id:'cat1',n:'Cat Person',d:'Cat lvl 3',c:s=>s.catLvl>=3},
{id:'d1',n:'Collector',d:'5 dex',c:s=>DEX.filter(d=>s.totalEarned>=d.at).length>=5},
{id:'s1',n:'Ascended',d:'Prestige',c:s=>s.ascensions>=1},{id:'s2',n:'Ring Lord',d:'1 ring',c:s=>s.rings>=1},
{id:'h1',n:'No-Click Hero',d:'Beat no-click',c:s=>s.doneCh.noclick},{id:'h2',n:'Tax Survivor',d:'Beat tax',c:s=>s.doneCh.poor},
{id:'h3',n:'Patient',d:'Beat slow',c:s=>s.doneCh.slow},{id:'m1',n:'Moon Landing',d:'Own moon',c:s=>(s.buildings.moon||0)>=1},
{id:'m2',n:'Time Lord',d:'Own time machine',c:s=>(s.buildings.time||0)>=1},
{id:'q1',n:'Quester',d:'5 quests',c:s=>(s.questsDone||0)>=5},{id:'q2',n:'Mercenary',d:'3 expeditions',c:s=>(s.expsDone||0)>=3},
{id:'f1',n:'Fisher King',d:'Win fishing 5x',c:s=>(s.fishWins||0)>=5},{id:'x1',n:'Crit Happens',d:'25 crits',c:s=>(s.crits||0)>=25},
{id:'x2',n:'High Roller',d:'Hold 1B',c:s=>s.sushi>=1e9},{id:'x3',n:'Stonks',d:'Hold 10 stocks',c:s=>stockTotal(s)>=10},
{id:'t1',n:'Veteran',d:'Play 30m',c:s=>s.playSec>=1800},{id:'r1',n:'Gambler',d:'Win roulette 3x',c:s=>s.roulette>=3},
{id:'r2',n:'Ring Bearer',d:'3 rings',c:s=>s.rings>=3}];
/* 20 events */
function EV(){
return [
{n:'🧐 Critic!',t:'+60s production!',f:()=>gain(rawCps()*60)},
{n:'🎏 Festival!',t:'Frenzy x7 30s!',f:()=>{frenzyUntil=Date.now()+30000;}},
{n:'🧼 Inspector!',t:'-10% bank, +25% CPS 60s!',f:()=>{S.sushi*=0.9;inspUntil=Date.now()+60000;}},
{n:'🌧️ Rain!',t:'clicks x3 30s!',f:()=>{rainUntil=Date.now()+30000;}},
{n:'🐱 Stray cat!',t:'cat x3 60s!',f:()=>{catBoostUntil=Date.now()+60000;}},
{n:'⛈️ Storm!',t:'CLICK STORM x10 10s!',f:()=>{stormUntil=Date.now()+10000;}},
{n:'🌊 Tsunami!',t:'+120s production!',f:()=>gain(rawCps()*120)},
{n:'⭐ Michelin!',t:'+50% CPS 60s!',f:()=>{michUntil=Date.now()+60000;}},
{n:'📺 Viral!',t:'+25% bank!',f:()=>gain(S.sushi*0.25+1000)},
{n:'🦑 Kraken!',t:'-5% but +90s!',f:()=>{S.sushi*=0.95;gain(rawCps()*90);}},
{n:'🎎 Matsuri!',t:'+500 clicks worth!',f:()=>gain(clickGain()*500)},
{n:'🌕 Full moon!',t:'cat x2 + frenzy 15s!',f:()=>{catBoostUntil=Date.now()+60000;frenzyUntil=Date.now()+15000;}},
{n:'🧄 Garlic out!',t:'clicks x2 30s!',f:()=>{rainUntil=Date.now()+30000;}},
{n:'🏝️ New island!',t:'+45s production!',f:()=>gain(rawCps()*45)},
{n:'👻 Ghost!',t:'paid double +30s!',f:()=>gain(rawCps()*30)},
{n:'🎰 Lucky hour!',t:'gold spawns now!',f:()=>showGold('golden')},
{n:'🌋 Eruption!',t:'Volcano cooks! +75s!',f:()=>gain(rawCps()*75)},
{n:'🐳 Whale sighting!',t:'tourists +15% bank!',f:()=>gain(S.sushi*0.15+500)},
{n:'❄️ Snow day!',t:'cozy! offline boost + frenzy 10s!',f:()=>{frenzyUntil=Date.now()+10000;}},
{n:'🎃 Sushiween!',t:'spooky! clicks x5 20s!',f:()=>{rainUntil=Date.now()+20000;}}];}
const NEWS=['News: clicker owns X buildings.','News: tuna up on demand.','Tip: quests print sushi.','Tip: specialization x3 is OP.','Tip: rings beat stars late.','Tip: fish when waiting.','Tip: expeditions scale with wager.','Tip: stocks drift — buy dips.'];

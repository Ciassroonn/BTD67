// =============================================
// BALLOON TD 6 — GAME DATA
// =============================================

// ---- DIFFICULTIES ----
const DIFFICULTIES = {
  easy:   { name:'EASY',   icon:'🟢', lives:200, cash:750, priceMul:0.85, hpMul:0.85, speedMul:0.9,  incomeMul:1.15, desc:'Cheaper towers, weaker bloons. Great for learning.', color:'#00ff88' },
  medium: { name:'MEDIUM', icon:'🟠', lives:150, cash:650, priceMul:1.0,  hpMul:1.0,  speedMul:1.0,  incomeMul:1.0,  desc:'The standard challenge. Balanced economy & bloons.', color:'#ff6b00' },
  hard:   { name:'HARD',   icon:'🔴', lives:100, cash:600, priceMul:1.08, hpMul:1.25, speedMul:1.12, incomeMul:0.85, desc:'Tougher, faster bloons. Camo & regrow come early.', color:'#ff2244' },
  impoppable:{ name:'IMPOPPABLE', icon:'💀', lives:1, cash:500, priceMul:1.2, hpMul:1.6, speedMul:1.25, incomeMul:0.7, desc:'One life. Brutal bloons. Only for masters.', color:'#aa66ff' },
};

// ---- HEROES ----
const HEROES = {
  quincy: {
    id:'quincy', name:'Quincy', icon:'🏹', color:'#f1c40f',
    desc:'Archer. Fast arrows that pierce bloons.',
    range:170, fireRate:1.4, damage:1, pierce:2, projectileSpeed:420, projectileRadius:5, numProjectiles:1,
    ability:{ name:'Rapid Shot', icon:'💨', cooldown:22, duration:4, desc:'Triples attack speed briefly.' },
    // per-level scaling applied in code
  },
  gwen: {
    id:'gwen', name:'Gwendolin', icon:'🔥', color:'#e74c3c',
    desc:'Pyromaniac. Fireballs that burn bloons over time.',
    range:150, fireRate:1.0, damage:2, pierce:3, projectileSpeed:300, projectileRadius:8,
    dot:1, dotInterval:0.5, explodeRadius:24, isExplosive:true,
    ability:{ name:'Firestorm', icon:'🌋', cooldown:30, duration:0, desc:'Burns all bloons on screen.' },
  },
  obyn: {
    id:'obyn', name:'Obyn', icon:'🌿', color:'#27ae60',
    desc:'Nature spirit. Homing spirits, buffs magic towers, sees camo.',
    range:180, fireRate:1.1, damage:2, pierce:4, projectileSpeed:340, projectileRadius:7, camo:true,
    ability:{ name:'Wall of Trees', icon:'🌲', cooldown:28, duration:6, desc:'Spirits slow & block bloons.' },
  },
  churchill: {
    id:'churchill', name:'Cpt. Churchill', icon:'🎖️', color:'#7f8c8d',
    desc:'Tank commander. High damage explosive shells, shreds MOABs.',
    range:210, fireRate:1.6, damage:4, pierce:3, projectileSpeed:500, projectileRadius:6, moabDmg:3,
    ability:{ name:'MOAB Barrage', icon:'🚀', cooldown:35, duration:5, desc:'Rockets rain on the strongest bloons.' },
  },
  benjamin: {
    id:'benjamin', name:'Benjamin', icon:'💻', color:'#00d4ff',
    desc:'Hacker. Generates cash each round, does not attack.',
    range:0, fireRate:0.01, damage:0, pierce:0, projectileSpeed:1, projectileRadius:1, isHacker:true,
    ability:{ name:'Syphon Funding', icon:'💰', cooldown:40, duration:0, desc:'Instantly grants a big cash bonus.' },
  },
};

// ---- POWERS (limited-use consumables) ----
const POWERS = {
  boost:   { id:'boost',  name:'Monkey Boost', icon:'⚡', uses:3, desc:'All towers +100% attack speed for 8s.', duration:8 },
  cash:    { id:'cash',   name:'Cash Drop',    icon:'💵', uses:3, desc:'Instantly gain $500.' },
  glue:    { id:'glue',   name:'Glue Trap',    icon:'🟢', uses:2, desc:'Slow every bloon on screen for 6s.', duration:6 },
  pineapple:{ id:'pineapple', name:'Bomb',     icon:'🍍', uses:4, desc:'Click the track to detonate a huge explosion.' },
};

// ---- TOWER DEFINITIONS ----
// (crosspath rule: you may take a path to tier 5 only if the other two paths sum to <=2 tiers,
//  and you can have at most ONE path above tier 2)
const TOWER_DEFS = [
  {
    id: 'dart', name: 'Dart Monkey', icon: '🐒', color: '#8B6914', cost: 200, unlockLevel: 1,
    desc: 'Basic tower. Throws darts at bloons.',
    range: 140, fireRate: 1.2, damage: 1, projectileSpeed: 320, projectileRadius: 5, pierce:1,
    upgrades: [
      { name:'Sharp Shots', levels:[
        { name:'Sharp Shots', cost:140, desc:'Darts pop 2 bloons', effect:{pierce:2} },
        { name:'Razor Sharp Shots', cost:170, desc:'Darts pop 4 bloons', effect:{pierce:4} },
        { name:'Spike-o-pult', cost:400, desc:'Throws large spike balls', effect:{pierce:18, damage:2, projectileRadius:10} },
        { name:'Juggernaut', cost:1800, desc:'Massive spike balls, pops 100', effect:{pierce:100, damage:5, projectileRadius:16} },
        { name:'Ultra-Juggernaut', cost:32000, desc:'Godly spike balls', effect:{pierce:300, damage:10, projectileRadius:22} },
      ]},
      { name:'Quick Shots', levels:[
        { name:'Quick Shots', cost:100, desc:'Faster attack speed', effect:{fireRateMul:1.33} },
        { name:'Very Quick Shots', cost:190, desc:'Even faster attacks', effect:{fireRateMul:1.43} },
        { name:'Triple Shot', cost:500, desc:'Shoots 3 darts at once', effect:{multishot:3} },
        { name:'Super Monkey Fan Club', cost:12000, desc:'Rapid multi-dart barrage', effect:{multishot:5, fireRateMul:2} },
        { name:'Plasma Monkey Fan Club', cost:18000, desc:'Plasma darts', effect:{multishot:7, fireRateMul:2.5, damage:3} },
      ]},
      { name:'Long Range', levels:[
        { name:'Long Range Darts', cost:100, desc:'Increased range', effect:{rangeMul:1.2} },
        { name:'Enhanced Eyesight', cost:130, desc:'+range, sees camo', effect:{rangeMul:1.3, camo:true} },
        { name:'Crossbow', cost:650, desc:'Faster, longer, stronger', effect:{rangeMul:1.4, fireRateMul:1.5, damage:2} },
        { name:'Sharp Shooter', cost:1200, desc:'Crit shots, camo', effect:{rangeMul:1.6, camo:true, fireRateMul:1.8, damage:2} },
        { name:'Crossbow Master', cost:35000, desc:'Incredible speed and range', effect:{rangeMul:2, fireRateMul:5, damage:8, pierce:20} },
      ]}
    ]
  },
  {
    id: 'boomerang', name: 'Boomerang Monkey', icon: '🪃', color: '#c0392b', cost: 325, unlockLevel: 2,
    desc: 'Throws boomerangs that curve and pierce many bloons.',
    range: 150, fireRate: 0.8, damage: 1, projectileSpeed: 300, projectileRadius: 7, pierce: 6,
    upgrades: [
      { name:'Improved Rangs', levels:[
        { name:'Improved Rangs', cost:150, desc:'More pierce', effect:{pierce:8} },
        { name:'Glaives', cost:200, desc:'Faster & sharper', effect:{fireRateMul:1.33, damage:2} },
        { name:'Glaive Ricochet', cost:1000, desc:'Bounces between bloons', effect:{lead:true, pierce:16, damage:2} },
        { name:'MOAB Press', cost:2500, desc:'Damages MOAB-class', effect:{moabDmg:5, pierce:20, damage:3} },
        { name:'Glaive Lord', cost:45000, desc:'Orbiting glaives of doom', effect:{moabDmg:50, pierce:60, damage:12, fireRateMul:2} },
      ]},
      { name:'Multiple Rangs', levels:[
        { name:'Multiple Rangs', cost:300, desc:'Throws 3 at once', effect:{numProjectiles:3} },
        { name:'Long Range Rangs', cost:200, desc:'Longer range', effect:{rangeMul:1.3} },
        { name:'Bionic Boomerang', cost:1200, desc:'Rapid mechanical throws', effect:{fireRateMul:2, damage:2, numProjectiles:3} },
        { name:'Turbo Charge', cost:9000, desc:'Insane throw speed', effect:{fireRateMul:3, damage:5, numProjectiles:5} },
        { name:'Perma-Charge', cost:45000, desc:'Permanent turbo mode', effect:{damage:15, pierce:40, numProjectiles:6, fireRateMul:4} },
      ]},
      { name:'Red Hot Rangs', levels:[
        { name:'Red Hot Rangs', cost:250, desc:'Pops lead, burns', effect:{lead:true, dot:1, dotInterval:0.6} },
        { name:'Kylie Boomerang', cost:900, desc:'Returns twice', effect:{pierce:14, damage:2} },
        { name:'Bloonberang', cost:2500, desc:'Devastating boomerang', effect:{damage:5, pierce:24, dot:2} },
        { name:'MOAB Domination', cost:6000, desc:'Melts MOAB-class', effect:{moabDmg:15, damage:6, pierce:30} },
        { name:'Bloontonium Rang', cost:25000, desc:'Radioactive glaive', effect:{damage:14, dot:6, dotInterval:0.2, pierce:50, moabDmg:20} },
      ]}
    ]
  },
  {
    id: 'cannon', name: 'Bomb Shooter', icon: '💣', color: '#2c3e50', cost: 500, unlockLevel: 3,
    desc: 'Launches bombs that explode on impact. Pops Leads & clusters.',
    range: 160, fireRate: 0.6, damage: 1, projectileSpeed: 240, projectileRadius: 8, explodeRadius: 32, isExplosive: true, pierce: 20, lead:true,
    upgrades: [
      { name:'Bigger Bombs', levels:[
        { name:'Bigger Bombs', cost:350, desc:'Larger explosions', effect:{explodeRadiusMul:1.4} },
        { name:'Heavy Bombs', cost:550, desc:'Even bigger + damage', effect:{explodeRadiusMul:1.6, damage:2} },
        { name:'Really Big Bombs', cost:1200, desc:'Massive explosions', effect:{explodeRadiusMul:2, damage:3} },
        { name:'Bloon Impact', cost:3000, desc:'Stuns bloons', effect:{explodeRadiusMul:2.2, damage:4, stun:1} },
        { name:'Bloon Crush', cost:30000, desc:'Incredible AoE + stun', effect:{explodeRadiusMul:3, damage:14, stun:2, moabDmg:5} },
      ]},
      { name:'Faster Reload', levels:[
        { name:'Faster Reload', cost:250, desc:'Reloads faster', effect:{fireRateMul:1.33} },
        { name:'Missile Launcher', cost:400, desc:'Much faster', effect:{fireRateMul:1.6} },
        { name:'MOAB Mauler', cost:900, desc:'Extra MOAB damage', effect:{fireRateMul:1.8, moabDmg:8} },
        { name:'MOAB Assassin', cost:3600, desc:'Huge single-target MOAB blast', effect:{fireRateMul:2, moabDmg:50, damage:5} },
        { name:'MOAB Eliminator', cost:22000, desc:'Deletes MOAB-class', effect:{fireRateMul:3, moabDmg:200, damage:12, explodeRadiusMul:1.5} },
      ]},
      { name:'Extra Range', levels:[
        { name:'Extra Range', cost:150, desc:'More range', effect:{rangeMul:1.2} },
        { name:'Frag Bombs', cost:300, desc:'Shrapnel fragments', effect:{rangeMul:1.3, pierce:30} },
        { name:'Cluster Bombs', cost:750, desc:'Cluster explosions', effect:{rangeMul:1.4, damage:2, pierce:40} },
        { name:'Recursive Cluster', cost:2200, desc:'Clusters within clusters', effect:{rangeMul:1.6, damage:3, explodeRadiusMul:1.4} },
        { name:'Bomb Blitz', cost:35000, desc:'Constant carpet bombing', effect:{rangeMul:2, damage:10, explodeRadiusMul:2, fireRateMul:2} },
      ]}
    ]
  },
  {
    id: 'tack', name: 'Tack Shooter', icon: '🌟', color: '#c0392b', cost: 360, unlockLevel: 4,
    desc: 'Shoots tacks in all directions. Deadly at chokepoints.',
    range: 100, fireRate: 0.9, damage: 1, projectileSpeed: 280, projectileRadius: 4, multiTarget: true, numProjectiles: 8, pierce:1,
    upgrades: [
      { name:'Faster Shooting', levels:[
        { name:'Faster Shooting', cost:200, desc:'Faster attack rate', effect:{fireRateMul:1.33} },
        { name:'Even Faster Shooting', cost:200, desc:'Even faster shooting', effect:{fireRateMul:1.43} },
        { name:'Hot Shots', cost:600, desc:'Fire tacks, pops lead', effect:{damage:2, fireRateMul:1.5, lead:true, dot:1, dotInterval:0.5} },
        { name:'Ring of Fire', cost:2500, desc:'Continuous ring of fire', effect:{damage:5, fireRateMul:4, pierce:50, dot:3} },
        { name:'Inferno Ring', cost:40000, desc:'Devastating fire ring', effect:{damage:20, fireRateMul:6, pierce:200, dot:10, dotInterval:0.2} },
      ]},
      { name:'Extra Range', levels:[
        { name:'Extra Range Tacks', cost:100, desc:'Slightly more range', effect:{rangeMul:1.15} },
        { name:'Super Range Tacks', cost:150, desc:'More range', effect:{rangeMul:1.3} },
        { name:'Blade Shooter', cost:500, desc:'Rotating blades', effect:{rangeMul:1.5, pierce:8, damage:2} },
        { name:'Blade Maelstrom', cost:1900, desc:'Blade storm', effect:{rangeMul:1.7, pierce:20, damage:5, fireRateMul:2} },
        { name:'Super Maelstrom', cost:24000, desc:'Massive blade storm', effect:{rangeMul:2, pierce:60, damage:12, fireRateMul:4, numProjectiles:16} },
      ]},
      { name:'More Tacks', levels:[
        { name:'More Tacks', cost:150, desc:'10 tacks per shot', effect:{numProjectiles:10} },
        { name:'Even More Tacks', cost:200, desc:'12 tacks per shot', effect:{numProjectiles:12} },
        { name:'Tack Sprayer', cost:400, desc:'16 tacks', effect:{numProjectiles:16, fireRateMul:1.3} },
        { name:'Overdrive', cost:4000, desc:'20 tacks, rapid', effect:{numProjectiles:20, fireRateMul:2, damage:2} },
        { name:'The Tack Zone', cost:20000, desc:'Ridiculous tack count', effect:{numProjectiles:32, fireRateMul:3, damage:4} },
      ]}
    ]
  },
  {
    id: 'ice', name: 'Ice Monkey', icon: '🧊', color: '#5dade2', cost: 500, unlockLevel: 5,
    desc: 'Freezes bloons in range temporarily.',
    range: 110, fireRate: 0.4, damage: 0, freezeDuration: 1.5, freezeRadius: 110, isFreeze: true, projectileSpeed: 999, projectileRadius: 0,
    upgrades: [
      { name:'Permafrost', levels:[
        { name:'Permafrost', cost:200, desc:'Frozen bloons stay slow', effect:{permafrost:true} },
        { name:'Cold Snap', cost:300, desc:'Damages frozen bloons', effect:{damage:1} },
        { name:'Ice Shards', cost:1000, desc:'Shards damage bloons', effect:{damage:2, iceShards:true} },
        { name:'Embrittlement', cost:2000, desc:'Frozen bloons take more hits', effect:{embrittlement:true, freezeDurationMul:1.5, damage:2} },
        { name:'Super Brittle', cost:25000, desc:'Massive freeze & damage', effect:{embrittlement:true, freezeDurationMul:3, freezeRadiusMul:1.5, damage:5} },
      ]},
      { name:'Enhanced Freeze', levels:[
        { name:'Enhanced Freeze', cost:200, desc:'Longer freeze', effect:{freezeDurationMul:1.5} },
        { name:'Deep Freeze', cost:300, desc:'Even longer freeze', effect:{freezeDurationMul:2} },
        { name:'Arctic Wind', cost:1500, desc:'Constant slow aura', effect:{aoeSlow:true, freezeDurationMul:2} },
        { name:'Snowstorm', cost:3000, desc:'Freezes wide area', effect:{freezeRadiusMul:1.8, freezeDurationMul:2.5} },
        { name:'Absolute Zero', cost:25000, desc:'Global freeze ability', effect:{freezeRadiusMul:2.5, freezeDurationMul:4, damage:3} },
      ]},
      { name:'Larger Radius', levels:[
        { name:'Larger Radius', cost:100, desc:'Bigger freeze area', effect:{freezeRadiusMul:1.2} },
        { name:'Re-Freeze', cost:150, desc:'Faster refreeze', effect:{fireRateMul:1.5} },
        { name:'Cryo Cannon', cost:400, desc:'Much larger area', effect:{freezeRadiusMul:1.5} },
        { name:'Icicles', cost:1200, desc:'Sharp icicle damage', effect:{damage:3, freezeRadiusMul:1.8} },
        { name:'Icicle Impale', cost:12000, desc:'Devastating icicles', effect:{damage:10, freezeRadiusMul:2.2, freezeDurationMul:2} },
      ]}
    ]
  },
  {
    id: 'glue', name: 'Glue Gunner', icon: '💧', color: '#e67e22', cost: 275, unlockLevel: 6,
    desc: 'Slows bloons with sticky glue.',
    range: 145, fireRate: 0.7, damage: 0, slowFactor: 0.5, slowDuration: 4.0, isGlue: true, projectileSpeed: 280, projectileRadius: 6, pierce: 1,
    upgrades: [
      { name:'Glue Soak', levels:[
        { name:'Glue Soak', cost:170, desc:'Soaks multiple bloons', effect:{pierce:2} },
        { name:'Corrosive Glue', cost:300, desc:'Damage over time', effect:{dot:1, dotInterval:1} },
        { name:'Bloon Dissolver', cost:1400, desc:'Rapidly dissolves bloons', effect:{dot:3, dotInterval:0.5} },
        { name:'Bloon Liquefier', cost:3500, desc:'Extreme corrosion', effect:{dot:6, dotInterval:0.3} },
        { name:'The Bloon Solver', cost:30000, desc:'Melts all bloon types', effect:{dot:14, dotInterval:0.1, pierce:999, lead:true} },
      ]},
      { name:'Bigger Globs', levels:[
        { name:'Bigger Globs', cost:200, desc:'Hits more bloons', effect:{pierce:3} },
        { name:'Glue Splatter', cost:500, desc:'Splatters on impact', effect:{pierce:10, explodeRadius:22, isExplosive:true} },
        { name:'Glue Hose', cost:1600, desc:'Much faster firing', effect:{fireRateMul:3, pierce:15} },
        { name:'Glue Strike', cost:7000, desc:'Glues MOAB-class', effect:{fireRateMul:4, pierce:30, moabDmg:2} },
        { name:'Glue Storm', cost:15000, desc:'Screen-wide glue', effect:{fireRateMul:5, pierce:80, explodeRadius:60} },
      ]},
      { name:'Stronger Glue', levels:[
        { name:'Stickier Glue', cost:100, desc:'Glue lasts longer', effect:{slowDurationMul:1.5} },
        { name:'Slow-Setting Glue', cost:200, desc:'Slows more', effect:{slowFactor:0.35, slowDurationMul:2} },
        { name:'Relentless Glue', cost:500, desc:'Reapplies constantly', effect:{slowFactor:0.3, slowDurationMul:3} },
        { name:'Super Glue', cost:1800, desc:'Nearly stops bloons', effect:{slowFactor:0.12, slowDurationMul:4} },
        { name:'Bloon Glue', cost:22000, desc:'Freezes bloons in place', effect:{slowFactor:0.05, dot:5, dotInterval:0.2} },
      ]}
    ]
  },
  {
    id: 'sniper', name: 'Sniper Monkey', icon: '🎯', color: '#27ae60', cost: 350, unlockLevel: 7,
    desc: 'Infinite range. High damage, picks off priority targets.',
    range: 9999, fireRate: 0.4, damage: 2, projectileSpeed: 999, projectileRadius: 4, pierce: 1,
    upgrades: [
      { name:'Full Metal Jacket', levels:[
        { name:'Full Metal Jacket', cost:350, desc:'Pops Lead, +dmg', effect:{damage:4, lead:true} },
        { name:'Large Calibre', cost:400, desc:'+2 damage', effect:{damage:6} },
        { name:'Deadly Precision', cost:1000, desc:'Triple MOAB dmg', effect:{damage:8, moabDmg:3} },
        { name:'Maim MOAB', cost:3000, desc:'Stuns MOABs', effect:{damage:14, stun:0.5, moabDmg:6} },
        { name:'Cripple MOAB', cost:22000, desc:'Devastates MOABs', effect:{damage:40, stun:2, moabDmg:15} },
      ]},
      { name:'Night Vision', levels:[
        { name:'Night Vision Goggles', cost:250, desc:'Detects camo', effect:{camo:true} },
        { name:'Shrapnel Shot', cost:350, desc:'Shrapnel spray', effect:{pierce:3, camo:true} },
        { name:'Bouncing Bullet', cost:1000, desc:'Bullets ricochet', effect:{pierce:6, damage:2} },
        { name:'Supply Drop', cost:8500, desc:'Cash + bounce', effect:{pierce:8, damage:4, income:600} },
        { name:'Elite Sniper', cost:35000, desc:'Ultra fast & powerful', effect:{fireRateMul:3, damage:50, pierce:10} },
      ]},
      { name:'Semi-Auto', levels:[
        { name:'Faster Firing', cost:200, desc:'Slightly faster', effect:{fireRateMul:1.3} },
        { name:'Night Vision', cost:300, desc:'Faster + camo', effect:{fireRateMul:1.5, camo:true} },
        { name:'Semi-Automatic', cost:1500, desc:'Much faster', effect:{fireRateMul:2.5} },
        { name:'Full Auto Rifle', cost:5000, desc:'Rapid fire', effect:{fireRateMul:4, damage:2} },
        { name:'Elite Defender', cost:15000, desc:'Extreme fire rate', effect:{fireRateMul:8, damage:10} },
      ]}
    ]
  },
  {
    id: 'sub', name: 'Monkey Sub', icon: '🚢', color: '#2980b9', cost: 325, unlockLevel: 8,
    desc: 'Reveals Camo, decimates MOABs from afar.',
    range: 160, fireRate: 1.4, damage: 1, projectileSpeed: 340, projectileRadius: 5, pierce: 2,
    upgrades: [
      { name:'Barbed Darts', levels:[
        { name:'Longer Range', cost:100, desc:'More range', effect:{rangeMul:1.3} },
        { name:'Barbed Darts', cost:400, desc:'More pierce & damage', effect:{pierce:4, damage:2} },
        { name:'Heat-tipped Darts', cost:900, desc:'Pops lead', effect:{lead:true, damage:3} },
        { name:'Ballistic Missile', cost:4000, desc:'Explosive missiles', effect:{damage:5, explodeRadius:30, isExplosive:true, moabDmg:5} },
        { name:'First Strike', cost:42000, desc:'Destroys strongest MOAB', effect:{damage:20, moabDmg:200, pierce:10} },
      ]},
      { name:'Airburst Darts', levels:[
        { name:'Advanced Intel', cost:500, desc:'Global range, camo', effect:{rangeMul:6, camo:true} },
        { name:'Submerge & Support', cost:300, desc:'Strips camo', effect:{camo:true, damage:2} },
        { name:'Airburst Darts', cost:1200, desc:'Darts split apart', effect:{pierce:6, damage:2, numProjectiles:3} },
        { name:'Sub Commander', cost:18000, desc:'Buffs all subs', effect:{fireRateMul:2, damage:5} },
        { name:'Energizer', cost:45000, desc:'Supercharges attacks', effect:{fireRateMul:3, damage:15, pierce:20} },
      ]},
      { name:'Bloontonium', levels:[
        { name:'Bloontonium Reactor', cost:300, desc:'Radiation damages bloons', effect:{dot:1, dotInterval:0.5} },
        { name:'Ground Zero', cost:900, desc:'Bigger radiation', effect:{dot:2, damage:2} },
        { name:'Reactor Meltdown', cost:2500, desc:'Nuclear pulse', effect:{dot:4, damage:4, explodeRadius:40} },
        { name:'Bloon Blitz', cost:9000, desc:'Continuous radiation', effect:{dot:8, dotInterval:0.2, damage:6} },
        { name:'Nautilus', cost:32000, desc:'Sea fortress', effect:{fireRateMul:2, damage:12, dot:12, pierce:20} },
      ]}
    ]
  },
  {
    id: 'buccaneer', name: 'Monkey Buccaneer', icon: '⚓', color: '#16a085', cost: 500, unlockLevel: 9,
    desc: 'Powerful ship with darts & grapes. Can hook MOABs.',
    range: 170, fireRate: 1.0, damage: 1, projectileSpeed: 300, projectileRadius: 5, pierce: 2,
    upgrades: [
      { name:'Faster Shooting', levels:[
        { name:'Faster Shooting', cost:250, desc:'Faster attack', effect:{fireRateMul:1.33} },
        { name:'Double Shot', cost:300, desc:'Fires 2 darts', effect:{fireRateMul:1.4, numProjectiles:2} },
        { name:'Destroyer', cost:2500, desc:'Rapid-fire cannon', effect:{fireRateMul:3, damage:2} },
        { name:'Aircraft Carrier', cost:6500, desc:'Launches planes', effect:{fireRateMul:4, damage:3, pierce:5} },
        { name:'Carrier Flagship', cost:30000, desc:'Flagship carrier', effect:{fireRateMul:5, damage:8, pierce:15} },
      ]},
      { name:'Grape Shot', levels:[
        { name:'Grape Shot', cost:350, desc:'Sprays grapes', effect:{numProjectiles:5, pierce:3} },
        { name:'Hot Shot', cost:450, desc:'Fire grapes, pops lead', effect:{damage:2, lead:true, dot:1} },
        { name:'Cannon Ship', cost:1500, desc:'Cannon balls', effect:{damage:3, explodeRadius:24, isExplosive:true} },
        { name:'Monkey Pirates', cost:7000, desc:'Hooks MOAB-class', effect:{damage:5, moabDmg:15, pierce:8} },
        { name:'Pirate Lord', cost:22000, desc:'Supreme pirate power', effect:{damage:12, moabDmg:60, pierce:30} },
      ]},
      { name:'Merchantman', levels:[
        { name:'Long Range', cost:100, desc:'More range', effect:{rangeMul:1.2} },
        { name:'Crow\'s Nest', cost:350, desc:'Detects camo', effect:{camo:true, rangeMul:1.3} },
        { name:'Merchantman', cost:2700, desc:'+$300 per round', effect:{rangeMul:1.5, income:300} },
        { name:'Favored Trades', cost:6500, desc:'+$600 per round', effect:{rangeMul:1.6, income:600, fireRateMul:1.5} },
        { name:'Trade Empire', cost:20000, desc:'+$1500 per round', effect:{rangeMul:2, income:1500, damage:5} },
      ]}
    ]
  },
  {
    id: 'ace', name: 'Monkey Ace', icon: '✈️', color: '#8e44ad', cost: 800, unlockLevel: 10,
    desc: 'Aerial tower that circles the map, shredding bloons.',
    range: 9999, fireRate: 1.0, damage: 1, projectileSpeed: 380, projectileRadius: 5, pierce: 2, multiTarget: true, numProjectiles: 8,
    upgrades: [
      { name:'Rapid Fire', levels:[
        { name:'Rapid Fire', cost:400, desc:'Fires faster', effect:{fireRateMul:1.5} },
        { name:'Lots More Darts', cost:350, desc:'+2 darts', effect:{numProjectiles:10} },
        { name:'Fighter Plane', cost:1700, desc:'Powerful fighter', effect:{fireRateMul:2, damage:2} },
        { name:'Operation Dart Storm', cost:7500, desc:'Massive dart storm', effect:{fireRateMul:3, numProjectiles:16, damage:3} },
        { name:'Sky Shredder', cost:25000, desc:'Ultimate aerial weapon', effect:{fireRateMul:5, numProjectiles:24, damage:6} },
      ]},
      { name:'Neva-Miss', levels:[
        { name:'Exploding Pineapple', cost:500, desc:'Drops bombs', effect:{explodeRadius:28, isExplosive:true, damage:2} },
        { name:'Spy Plane', cost:500, desc:'Detects camo', effect:{camo:true, pierce:4} },
        { name:'Neva-Miss Targeting', cost:2000, desc:'Homing darts', effect:{pierce:6, damage:3} },
        { name:'Spectre', cost:24000, desc:'Godly gunship', effect:{fireRateMul:2, damage:5, pierce:8, numProjectiles:20} },
        { name:'Flying Fortress', cost:100000, desc:'Unstoppable fortress', effect:{fireRateMul:4, damage:15, pierce:30, numProjectiles:30} },
      ]},
      { name:'Ground Zero', levels:[
        { name:'Sharp Darts', cost:350, desc:'More pierce, pops lead', effect:{pierce:4, lead:true} },
        { name:'Centered Path', cost:250, desc:'Damage boost', effect:{damage:2} },
        { name:'Bomber Ace', cost:1200, desc:'Bomb runs', effect:{damage:3, explodeRadius:30, isExplosive:true} },
        { name:'Ground Zero', cost:15000, desc:'Massive bomb', effect:{damage:10, explodeRadius:60, moabDmg:20} },
        { name:'Tsar Bomba', cost:65000, desc:'Most powerful bomb', effect:{damage:25, explodeRadius:100, moabDmg:100, pierce:20} },
      ]}
    ]
  },
  {
    id: 'heli', name: 'Heli Pilot', icon: '🚁', color: '#d35400', cost: 1400, unlockLevel: 11,
    desc: 'Mobile aerial gunship with rapid fire.',
    range: 200, fireRate: 1.2, damage: 1, projectileSpeed: 340, projectileRadius: 5, pierce: 2, numProjectiles: 2,
    upgrades: [
      { name:'Quad Darts', levels:[
        { name:'Quad Darts', cost:700, desc:'4 dart spread', effect:{numProjectiles:4} },
        { name:'Pursuit', cost:500, desc:'Chases bloons', effect:{fireRateMul:1.3} },
        { name:'Razor Rotors', cost:2500, desc:'Razor sharp rotors', effect:{damage:3, pierce:6} },
        { name:'Apache Dartship', cost:12000, desc:'Powerful gunship', effect:{fireRateMul:2, damage:5, numProjectiles:6} },
        { name:'Apache Prime', cost:45000, desc:'Most powerful heli', effect:{fireRateMul:4, damage:12, numProjectiles:8, pierce:8} },
      ]},
      { name:'Bigger Jets', levels:[
        { name:'Bigger Jets', cost:350, desc:'Faster movement', effect:{fireRateMul:1.2} },
        { name:'IFR', cost:450, desc:'Detects camo', effect:{camo:true} },
        { name:'Downdraft', cost:2000, desc:'Blows bloons back', effect:{damage:2, rangeMul:1.2} },
        { name:'Support Chinook', cost:8000, desc:'Supplies cash', effect:{damage:3, income:400, rangeMul:1.4} },
        { name:'Special Poperations', cost:35000, desc:'Full assault', effect:{damage:8, pierce:10, fireRateMul:2, numProjectiles:8} },
      ]},
      { name:'Comanche', levels:[
        { name:'Lots of Guns', cost:500, desc:'Extra gun power', effect:{damage:2} },
        { name:'Heli Support', cost:600, desc:'Range boost', effect:{rangeMul:1.3} },
        { name:'Comanche Defense', cost:6000, desc:'Spawns mini heli', effect:{fireRateMul:2, damage:4} },
        { name:'Comanche Commander', cost:15000, desc:'Commands helis', effect:{fireRateMul:3, damage:8, numProjectiles:8} },
        { name:'Flying Fortress', cost:70000, desc:'Sky fortress', effect:{damage:18, pierce:20, fireRateMul:3, numProjectiles:12} },
      ]}
    ]
  },
  {
    id: 'mortar', name: 'Mortar Monkey', icon: '💥', color: '#7f8c8d', cost: 750, unlockLevel: 12,
    desc: 'Blasts a targeted area anywhere on the map.',
    range: 9999, fireRate: 0.5, damage: 1, projectileSpeed: 250, projectileRadius: 8, explodeRadius: 44, isExplosive: true, pierce: 30, lead:true,
    upgrades: [
      { name:'Bigger Blast', levels:[
        { name:'Bigger Blast', cost:350, desc:'Bigger explosion', effect:{explodeRadiusMul:1.3} },
        { name:'Bloon Buster', cost:500, desc:'More damage', effect:{damage:2, explodeRadiusMul:1.5} },
        { name:'Shell Shock', cost:1000, desc:'Stuns bloons', effect:{stun:1, damage:3} },
        { name:'The Big One', cost:5000, desc:'Massive explosion', effect:{explodeRadiusMul:2, damage:6, pierce:60} },
        { name:'The Biggest One', cost:35000, desc:'Earth-shattering', effect:{explodeRadiusMul:3, damage:20, pierce:200, stun:1} },
      ]},
      { name:'Rapid Reload', levels:[
        { name:'Faster Reload', cost:250, desc:'Reloads faster', effect:{fireRateMul:1.33} },
        { name:'Rapid Reload', cost:300, desc:'Much faster', effect:{fireRateMul:1.6} },
        { name:'Heavy Shells', cost:1000, desc:'Heavier shells', effect:{damage:3, fireRateMul:1.8} },
        { name:'Artillery Battery', cost:5000, desc:'Rapid fire mortar', effect:{fireRateMul:3, damage:4} },
        { name:'Pop and Awe', cost:35000, desc:'Constant barrages', effect:{fireRateMul:6, damage:8, explodeRadiusMul:2, stun:0.5} },
      ]},
      { name:'Burny Stuff', levels:[
        { name:'Burny Stuff', cost:300, desc:'Burns bloons', effect:{dot:1, dotInterval:0.5} },
        { name:'Bloon Buster', cost:500, desc:'More burn', effect:{dot:2, dotInterval:0.4, damage:2} },
        { name:'Signal Flare', cost:750, desc:'Removes camo', effect:{camo:true, dot:2} },
        { name:'Shattering Shells', cost:4500, desc:'Destroys fortified', effect:{damage:5, dot:4, pierce:50} },
        { name:'Blooncineration', cost:45000, desc:'Incinerate all bloons', effect:{damage:10, dot:8, dotInterval:0.1, explodeRadiusMul:2.5} },
      ]}
    ]
  },
  {
    id: 'wizard', name: 'Wizard Monkey', icon: '🧙', color: '#9b59b6', cost: 450, unlockLevel: 13,
    desc: 'Arcane magic. Fireballs, lightning, strips Camo.',
    range: 155, fireRate: 0.9, damage: 1, projectileSpeed: 300, projectileRadius: 7, pierce: 2,
    upgrades: [
      { name:'Arcane Blast', levels:[
        { name:'Magic Bolts', cost:200, desc:'Faster bolts', effect:{fireRateMul:1.3, damage:2} },
        { name:'Fireball', cost:400, desc:'Explosive fireball', effect:{explodeRadius:24, isExplosive:true, dot:1, dotInterval:0.5} },
        { name:'Wall of Fire', cost:1100, desc:'Burning wall', effect:{damage:4, dot:3, dotInterval:0.3, pierce:6} },
        { name:'Dragon\'s Breath', cost:3500, desc:'Breathes fire', effect:{damage:6, dot:5, dotInterval:0.2, pierce:10} },
        { name:'Wizard Lord Phoenix', cost:32000, desc:'Summons phoenix', effect:{damage:18, dot:10, dotInterval:0.1, pierce:30, rangeMul:1.5} },
      ]},
      { name:'Guided Magic', levels:[
        { name:'Guided Magic', cost:350, desc:'Homing bolts', effect:{pierce:4} },
        { name:'Arcane Mastery', cost:600, desc:'Powerful bolts', effect:{damage:3, pierce:6, fireRateMul:1.3} },
        { name:'Arcane Spike', cost:2500, desc:'Piercing spike', effect:{damage:8, pierce:12, fireRateMul:1.5} },
        { name:'Archmage', cost:12000, desc:'Master of magic', effect:{damage:16, pierce:20, fireRateMul:2} },
        { name:'Prince of Darkness', cost:45000, desc:'Necromancer lord', effect:{damage:35, pierce:40, fireRateMul:2.5, rangeMul:1.5} },
      ]},
      { name:'Shimmer', levels:[
        { name:'Shimmer', cost:650, desc:'Reveals camo', effect:{camo:true} },
        { name:'Monkey Sense', cost:500, desc:'Sees camo, +range', effect:{camo:true, rangeMul:1.2} },
        { name:'Necromancer', cost:2000, desc:'Reanimates bloons', effect:{damage:3, pierce:8, rangeMul:1.3} },
        { name:'Unpopped Army', cost:5000, desc:'Army of the undead', effect:{damage:6, pierce:14, rangeMul:1.5} },
        { name:'Necro Lord', cost:35000, desc:'Dark necromancer', effect:{damage:14, pierce:30, rangeMul:2, fireRateMul:1.5} },
      ]}
    ]
  },
  {
    id: 'super', name: 'Super Monkey', icon: '🦸', color: '#f39c12', cost: 2800, unlockLevel: 15,
    desc: 'Blazing dart speed. Becomes a Sun God devastator.',
    range: 160, fireRate: 10.0, damage: 1, projectileSpeed: 460, projectileRadius: 4, pierce: 1,
    upgrades: [
      { name:'Laser Vision', levels:[
        { name:'Laser Blasts', cost:2500, desc:'Lasers, pops lead', effect:{damage:2, lead:true, pierce:2} },
        { name:'Plasma Blasts', cost:4000, desc:'Plasma bolts', effect:{damage:4, pierce:3, fireRateMul:1.3} },
        { name:'Sun Avatar', cost:20000, desc:'Sun Avatar', effect:{damage:8, pierce:6, fireRateMul:1.5, rangeMul:1.2, numProjectiles:3} },
        { name:'Sun Temple', cost:100000, desc:'Radiant temple', effect:{damage:20, pierce:15, fireRateMul:2, numProjectiles:5} },
        { name:'True Sun God', cost:300000, desc:'Destroys everything', effect:{damage:60, pierce:40, fireRateMul:3, rangeMul:1.5, numProjectiles:8} },
      ]},
      { name:'Super Range', levels:[
        { name:'Super Range', cost:1500, desc:'More range', effect:{rangeMul:1.3} },
        { name:'Epic Range', cost:2500, desc:'Even more range', effect:{rangeMul:1.6} },
        { name:'Robo Monkey', cost:8000, desc:'Dual shooters', effect:{numProjectiles:2, fireRateMul:1.5} },
        { name:'Tech Terror', cost:25000, desc:'Devastating tech', effect:{damage:5, numProjectiles:3, pierce:5} },
        { name:'The Anti-Bloon', cost:60000, desc:'Supreme anti-bloon', effect:{damage:20, numProjectiles:4, pierce:12, rangeMul:1.3, moabDmg:5} },
      ]},
      { name:'Dark Knight', levels:[
        { name:'Knockback', cost:2000, desc:'Knockback bloons', effect:{damage:2, pierce:2} },
        { name:'Ultravision', cost:1200, desc:'Camo detection', effect:{camo:true} },
        { name:'Dark Knight', cost:5000, desc:'Dark power', effect:{damage:4, pierce:4, rangeMul:1.3} },
        { name:'Dark Champion', cost:50000, desc:'Champion of darkness', effect:{damage:14, pierce:10, rangeMul:1.5, fireRateMul:1.5} },
        { name:'Legend of the Night', cost:200000, desc:'Legendary power', effect:{damage:45, pierce:30, rangeMul:2, fireRateMul:2, camo:true} },
      ]}
    ]
  },
  {
    id: 'ninja', name: 'Ninja Monkey', icon: '🥷', color: '#2c3e50', cost: 500, unlockLevel: 17,
    desc: 'Fast shurikens. Sees Camo natively.',
    range: 145, fireRate: 1.8, damage: 1, projectileSpeed: 380, projectileRadius: 5, pierce: 1, camo: true,
    upgrades: [
      { name:'Bloonjitsu', levels:[
        { name:'Ninja Discipline', cost:200, desc:'Faster + range', effect:{fireRateMul:1.33, rangeMul:1.1} },
        { name:'Sharp Shurikens', cost:300, desc:'More pierce', effect:{pierce:3, damage:2} },
        { name:'Double Shot', cost:1200, desc:'Two shurikens', effect:{numProjectiles:2, fireRateMul:1.3} },
        { name:'Bloonjitsu', cost:3000, desc:'Throws 5 shurikens', effect:{numProjectiles:5, fireRateMul:1.5} },
        { name:'Grandmaster Ninja', cost:24000, desc:'Master of ninja arts', effect:{numProjectiles:10, fireRateMul:2.5, damage:4} },
      ]},
      { name:'Shinobi', levels:[
        { name:'Distraction', cost:250, desc:'Sends bloons back', effect:{damage:2} },
        { name:'Counter-Espionage', cost:400, desc:'Decamos bloons', effect:{pierce:2} },
        { name:'Shinobi Tactics', cost:900, desc:'Buffs ninjas', effect:{fireRateMul:1.5, damage:2} },
        { name:'Bloon Sabotage', cost:4500, desc:'Slows all bloons', effect:{damage:5, pierce:6, fireRateMul:2} },
        { name:'Grand Saboteur', cost:30000, desc:'Master saboteur', effect:{damage:12, pierce:20, moabDmg:20} },
      ]},
      { name:'Sticky Bomb', levels:[
        { name:'Seeking Shuriken', cost:400, desc:'Homing shurikens', effect:{pierce:3} },
        { name:'Caltrops', cost:500, desc:'Drops caltrops', effect:{pierce:4, damage:2} },
        { name:'Flash Bomb', cost:3000, desc:'Stun explosion', effect:{stun:0.5, damage:3, explodeRadius:26, isExplosive:true} },
        { name:'Sticky Bomb', cost:6000, desc:'Bombs stick to MOABs', effect:{moabDmg:60, damage:5} },
        { name:'Master Bomber', cost:32000, desc:'MOAB destroyer', effect:{moabDmg:300, damage:10, pierce:15, explodeRadius:40} },
      ]}
    ]
  },
  {
    id: 'alchemist', name: 'Alchemist', icon: '⚗️', color: '#e74c3c', cost: 550, unlockLevel: 18,
    desc: 'Brews acids and buffs. Turns bloons weaker.',
    range: 150, fireRate: 0.7, damage: 2, projectileSpeed: 260, projectileRadius: 8, pierce: 3, dot:1, dotInterval:0.6, isExplosive:true, explodeRadius:20,
    upgrades: [
      { name:'Acidic Mixture', levels:[
        { name:'Larger Potions', cost:200, desc:'Bigger area', effect:{explodeRadius:28, pierce:5} },
        { name:'Acidic Mixture Dip', cost:300, desc:'Acid damage', effect:{dot:2, dotInterval:0.4} },
        { name:'Berserker Brew', cost:1200, desc:'Buffs nearby monkeys', effect:{fireRateMul:1.3, damage:3} },
        { name:'Stronger Stimulant', cost:3500, desc:'Stronger buff', effect:{fireRateMul:1.6, damage:5, rangeMul:1.2} },
        { name:'Permanent Brew', cost:45000, desc:'Permanent buff aura', effect:{fireRateMul:2, damage:8, rangeMul:1.5, dot:6} },
      ]},
      { name:'Unstable', levels:[
        { name:'Stronger Acid', cost:300, desc:'More acid', effect:{dot:3, dotInterval:0.4} },
        { name:'Perishing Potions', cost:600, desc:'Explosive potions', effect:{explodeRadius:32, dot:4} },
        { name:'Unstable Concoction', cost:2500, desc:'Unstable blast', effect:{damage:5, explodeRadius:44, dot:5} },
        { name:'Transforming Tonic', cost:7000, desc:'Beast mode', effect:{damage:9, pierce:12, dot:7} },
        { name:'Total Transformation', cost:45000, desc:'Total transformation', effect:{damage:22, pierce:25, dot:12, dotInterval:0.1} },
      ]},
      { name:'Lead to Gold', levels:[
        { name:'Faster Throwing', cost:300, desc:'Throws faster', effect:{fireRateMul:1.4} },
        { name:'Acid Pool', cost:400, desc:'Splash acid', effect:{pierce:8, explodeRadius:24} },
        { name:'Lead to Gold', cost:1000, desc:'Pops lead for cash', effect:{lead:true, damage:3} },
        { name:'Rubber to Gold', cost:3000, desc:'Bloons drop cash', effect:{lead:true, damage:5, pierce:10} },
        { name:'Bloon Master Alchemist', cost:35000, desc:'Shrinks MOABs', effect:{damage:12, pierce:20, lead:true, moabDmg:40} },
      ]}
    ]
  },
  {
    id: 'druid', name: 'Druid', icon: '🌿', color: '#27ae60', cost: 425, unlockLevel: 19,
    desc: 'Nature power: thorns, lightning and storms.',
    range: 150, fireRate: 1.1, damage: 1, projectileSpeed: 320, projectileRadius: 6, pierce: 2,
    upgrades: [
      { name:'Thorn Swarm', levels:[
        { name:'Hard Thorns', cost:200, desc:'Thorns pop more', effect:{pierce:4, damage:2} },
        { name:'Thorn Swarm', cost:350, desc:'More thorns', effect:{numProjectiles:4, pierce:5} },
        { name:'Heart of Thunder', cost:1800, desc:'Lightning strikes', effect:{damage:3, pierce:6, dot:1} },
        { name:'Ball Lightning', cost:5000, desc:'Ball lightning', effect:{damage:6, pierce:12, dot:3} },
        { name:'Superstorm', cost:35000, desc:'Massive storm', effect:{damage:14, pierce:30, dot:8, dotInterval:0.2, rangeMul:1.5} },
      ]},
      { name:'Druid of Storm', levels:[
        { name:'Druid of the Storm', cost:500, desc:'Storm winds', effect:{rangeMul:1.2, fireRateMul:1.3} },
        { name:'Druid of the Vine', cost:800, desc:'Vines slow', effect:{isGlue:true, slowFactor:0.6, slowDuration:2} },
        { name:'Ball Lightning', cost:2500, desc:'Storm power', effect:{damage:4, rangeMul:1.4, fireRateMul:1.5} },
        { name:'Poplust', cost:4000, desc:'Buffs allies', effect:{damage:6, pierce:10, fireRateMul:2} },
        { name:'Avatar of Wrath', cost:40000, desc:'Wrath of nature', effect:{damage:16, pierce:30, fireRateMul:3, rangeMul:1.8} },
      ]},
      { name:'Jungle Bounty', levels:[
        { name:'Druid of the Jungle', cost:300, desc:'Camo detection', effect:{camo:true, damage:2} },
        { name:'Jungle\'s Bounty', cost:500, desc:'Generates cash', effect:{damage:3, income:200} },
        { name:'Spirit of the Forest', cost:2000, desc:'Forest spirits', effect:{damage:5, pierce:8, dot:2, income:400} },
        { name:'Sun Avatar Grove', cost:6000, desc:'Big income', effect:{damage:7, pierce:12, income:800} },
        { name:'Grand Jungle', cost:30000, desc:'Master of the jungle', effect:{damage:16, pierce:25, dot:6, income:2000} },
      ]}
    ]
  },
  {
    id: 'farm', name: 'Banana Farm', icon: '🍌', color: '#f1c40f', cost: 1250, unlockLevel: 14,
    desc: 'Generates cash every round. Essential economy tower.',
    range: 0, fireRate: 0.01, damage: 0, projectileSpeed: 1, projectileRadius: 1, pierce: 0, isFarm: true, income: 200,
    upgrades: [
      { name:'More Bananas', levels:[
        { name:'More Bananas', cost:300, desc:'+$120/round', effect:{income:120} },
        { name:'Banana Plantation', cost:500, desc:'+$300/round', effect:{income:300} },
        { name:'Greater Production', cost:1500, desc:'+$700/round', effect:{income:700} },
        { name:'Banana Research Facility', cost:8000, desc:'+$2000/round', effect:{income:2000} },
        { name:'Banana Central', cost:50000, desc:'+$6000/round', effect:{income:6000} },
      ]},
      { name:'Monkey Bank', levels:[
        { name:'Long Life Bananas', cost:400, desc:'+$200/round', effect:{income:200} },
        { name:'Valuable Bananas', cost:700, desc:'+$450/round', effect:{income:450} },
        { name:'Monkey Bank', cost:2500, desc:'+$1000/round w/ interest', effect:{income:1000} },
        { name:'IMF Loan', cost:6000, desc:'+$2500/round', effect:{income:2500} },
        { name:'Monkey-Nomics', cost:60000, desc:'+$8000/round', effect:{income:8000} },
      ]},
      { name:'Marketplace', levels:[
        { name:'Fertilizer', cost:500, desc:'+$300/round', effect:{income:300} },
        { name:'Marketplace', cost:1200, desc:'+$700/round', effect:{income:700} },
        { name:'Central Market', cost:3000, desc:'+$1400/round', effect:{income:1400} },
        { name:'Monkey Wall Street', cost:10000, desc:'+$3500/round', effect:{income:3500} },
        { name:'Monkey Empire', cost:60000, desc:'+$10000/round', effect:{income:10000} },
      ]}
    ]
  },
  {
    id: 'spike', name: 'Spike Factory', icon: '🦔', color: '#e67e22', cost: 1000, unlockLevel: 20,
    desc: 'Lays spikes on the track. Last line of defense.',
    range: 90, fireRate: 0.5, damage: 1, projectileSpeed: 100, projectileRadius: 5, pierce: 8, isSpike:true,
    upgrades: [
      { name:'Bigger Stacks', levels:[
        { name:'Bigger Stacks', cost:300, desc:'More spikes', effect:{pierce:14} },
        { name:'White Hot Spikes', cost:350, desc:'Pops lead', effect:{lead:true, pierce:18} },
        { name:'Spiked Balls', cost:1000, desc:'Bigger spikes', effect:{pierce:24, damage:2} },
        { name:'Spiked Mines', cost:4000, desc:'Exploding mines', effect:{pierce:50, damage:5, explodeRadius:30, isExplosive:true} },
        { name:'Super Mines', cost:55000, desc:'Massive mines', effect:{pierce:200, damage:24, explodeRadius:80} },
      ]},
      { name:'MOAB Shredder', levels:[
        { name:'Faster Production', cost:200, desc:'Faster spikes', effect:{fireRateMul:1.5} },
        { name:'Even Faster', cost:300, desc:'Even faster', effect:{fireRateMul:2} },
        { name:'MOAB Shredder', cost:2500, desc:'Shreds MOABs', effect:{fireRateMul:3, moabDmg:8, damage:3} },
        { name:'Spike Storm', cost:5500, desc:'Spike ability', effect:{fireRateMul:5, pierce:30, damage:5} },
        { name:'Carpet of Spikes', cost:40000, desc:'Carpet the track', effect:{fireRateMul:8, pierce:100, damage:12, moabDmg:15} },
      ]},
      { name:'Perma-Spike', levels:[
        { name:'Long Reach', cost:200, desc:'Longer range', effect:{rangeMul:1.4} },
        { name:'Long Life Spikes', cost:350, desc:'Wider coverage', effect:{rangeMul:1.7, pierce:14} },
        { name:'Perma-Spike', cost:2000, desc:'Long-lasting spikes', effect:{rangeMul:2, pierce:30, damage:3} },
        { name:'Deadly Spikes', cost:4000, desc:'Deadlier spikes', effect:{rangeMul:2.2, damage:6, pierce:50} },
        { name:'Perma-Spike Ultra', cost:30000, desc:'Permanent spike field', effect:{rangeMul:3, damage:14, pierce:100, moabDmg:10} },
      ]}
    ]
  },
  {
    id: 'village', name: 'Monkey Village', icon: '🏘️', color: '#8e44ad', cost: 1200, unlockLevel: 22,
    desc: 'Buffs nearby towers: range, speed and camo detection.',
    range: 200, fireRate: 0.01, damage: 0, projectileSpeed: 1, projectileRadius: 1, pierce: 0, isVillage: true,
    buff: { rangeMul:1.15, fireRateMul:1.0, camo:false, damage:0 },
    upgrades: [
      { name:'Radar', levels:[
        { name:'Bigger Radius', cost:300, desc:'+range to all', effect:{buffRange:1.25} },
        { name:'Radar Scanner', cost:700, desc:'All towers see camo', effect:{buffCamo:true} },
        { name:'Monkey Intelligence Bureau', cost:8000, desc:'All towers pop all types', effect:{buffLead:true, buffRange:1.4} },
        { name:'Call to Arms', cost:22000, desc:'Massive speed boost', effect:{buffFireRate:1.5, buffRange:1.5} },
        { name:'Homeland Defense', cost:55000, desc:'Ultimate buff aura', effect:{buffFireRate:2, buffRange:1.6, buffDamage:2} },
      ]},
      { name:'Jungle Drums', levels:[
        { name:'Jungle Drums', cost:600, desc:'+attack speed to all', effect:{buffFireRate:1.2} },
        { name:'Faster Drums', cost:700, desc:'More speed', effect:{buffFireRate:1.35} },
        { name:'Primary Training', cost:2000, desc:'Extra damage aura', effect:{buffDamage:1, buffRange:1.3} },
        { name:'Primary Mentoring', cost:8000, desc:'Strong buffs', effect:{buffDamage:2, buffFireRate:1.4} },
        { name:'Primary Expertise', cost:20000, desc:'Massive buffs', effect:{buffDamage:3, buffFireRate:1.6, buffRange:1.5} },
      ]},
      { name:'Monkey Economy', levels:[
        { name:'Monkey Business', cost:500, desc:'Small income', effect:{income:150} },
        { name:'Monkey Commerce', cost:600, desc:'More income', effect:{income:350} },
        { name:'Monkey Town', cost:3000, desc:'Cash generation', effect:{income:800} },
        { name:'Monkey City', cost:10000, desc:'Big income', effect:{income:2000} },
        { name:'Monkeyopolis', cost:50000, desc:'Massive income', effect:{income:6000} },
      ]}
    ]
  },
  {
    id: 'engineer', name: 'Engineer Monkey', icon: '🔧', color: '#e67e22', cost: 450, unlockLevel: 23,
    desc: 'Builds sentries and overclocks. Versatile support.',
    range: 140, fireRate: 0.9, damage: 1, projectileSpeed: 320, projectileRadius: 5, pierce: 1,
    upgrades: [
      { name:'Sentry', levels:[
        { name:'Sentry Gun', cost:700, desc:'Builds sentries', effect:{damage:2, pierce:2} },
        { name:'Sprockets', cost:400, desc:'Faster building', effect:{fireRateMul:1.4, pierce:3} },
        { name:'Sentry Expert', cost:2500, desc:'Better sentries', effect:{damage:4, pierce:5, fireRateMul:2} },
        { name:'Sentry Paragon', cost:12000, desc:'Paragon sentries', effect:{damage:8, pierce:10, fireRateMul:3} },
        { name:'Sentry Champion', cost:23500, desc:'Champion sentries', effect:{damage:16, pierce:20, fireRateMul:4} },
      ]},
      { name:'Overclock', levels:[
        { name:'Larger Service Area', cost:200, desc:'Bigger range', effect:{rangeMul:1.3} },
        { name:'Deconstruction', cost:400, desc:'Weakens MOABs', effect:{moabDmg:5, rangeMul:1.3} },
        { name:'Overclock', cost:7000, desc:'Overclocks towers', effect:{fireRateMul:1.5, rangeMul:1.5} },
        { name:'Ultraboost', cost:32000, desc:'Ultra boost', effect:{fireRateMul:2, rangeMul:1.8, damage:5} },
        { name:'Apex Plasma Master', cost:90000, desc:'Plasma weapons', effect:{fireRateMul:4, damage:16, pierce:20, rangeMul:2} },
      ]},
      { name:'Cleansing Foam', levels:[
        { name:'Faster Nails', cost:200, desc:'Faster nail gun', effect:{fireRateMul:1.3} },
        { name:'Lots More Nails', cost:300, desc:'More nails, camo', effect:{numProjectiles:3, pierce:3, camo:true} },
        { name:'Cleansing Foam', cost:2000, desc:'Foam dissolves bloons', effect:{dot:3, dotInterval:0.3, pierce:8} },
        { name:'Overclock Foam', cost:8000, desc:'Powered foam', effect:{dot:5, damage:4, pierce:12} },
        { name:'XXXL Trap', cost:15000, desc:'Freezing foam trap', effect:{damage:8, pierce:20, dot:6, isGlue:true, slowFactor:0.3, slowDuration:3} },
      ]}
    ]
  },
  {
    id: 'dartling', name: 'Dartling Gunner', icon: '🔫', color: '#c0392b', cost: 850, unlockLevel: 25,
    desc: 'Rapid-fire gunner. Aims at a fixed direction.',
    range: 9999, fireRate: 3.0, damage: 1, projectileSpeed: 520, projectileRadius: 4, pierce: 2,
    upgrades: [
      { name:'Laser Cannon', levels:[
        { name:'Focused Firing', cost:300, desc:'More accurate', effect:{fireRateMul:1.2} },
        { name:'Laser Cannon', cost:1000, desc:'Fires lasers, lead', effect:{damage:2, pierce:4, lead:true} },
        { name:'Plasma Accelerator', cost:4500, desc:'Plasma beam', effect:{damage:4, pierce:10} },
        { name:'Ray of Doom', cost:45000, desc:'Infinite pierce beam', effect:{damage:10, pierce:999, fireRateMul:2} },
        { name:'Ray of Doom+', cost:200000, desc:'Reality-warping beam', effect:{damage:30, pierce:999, fireRateMul:4} },
      ]},
      { name:'Hydra Rockets', levels:[
        { name:'Faster Barrel Spin', cost:450, desc:'Faster', effect:{fireRateMul:1.4} },
        { name:'Hydra Rocket Pods', cost:2500, desc:'Fires rockets', effect:{damage:3, explodeRadius:28, isExplosive:true, pierce:12} },
        { name:'Rocket Storm', cost:6000, desc:'Rocket barrage', effect:{fireRateMul:2, damage:5, explodeRadius:38} },
        { name:'MAD', cost:20000, desc:'Missile dartship', effect:{fireRateMul:3, damage:10, moabDmg:50, explodeRadius:44} },
        { name:'MAD Prime', cost:95000, desc:'Worldwide coverage', effect:{fireRateMul:5, damage:20, moabDmg:200, explodeRadius:60} },
      ]},
      { name:'Buckshot', levels:[
        { name:'Faster Swivel', cost:150, desc:'Rotates faster', effect:{fireRateMul:1.15} },
        { name:'Powerful Darts', cost:600, desc:'More pierce', effect:{pierce:6} },
        { name:'Buckshot', cost:1500, desc:'Spread shot', effect:{numProjectiles:6, damage:2} },
        { name:'Bloon Area Denial', cost:11000, desc:'BADS system', effect:{numProjectiles:9, damage:5, pierce:12} },
        { name:'BADS Prime', cost:60000, desc:'Total area denial', effect:{numProjectiles:14, damage:16, pierce:25, moabDmg:100} },
      ]}
    ]
  },
];

// ---- ENEMY (BLOON) TYPES ----
// Each breaks into its child. Camo/regrow/fortified are set per-spawn as flags.
const ENEMY_TYPES = {
  red:    { name:'Red',    color:'#e74c3c', hp:1,    speed:66,  radius:9,  cash:1,   spawnOn:null },
  blue:   { name:'Blue',   color:'#3498db', hp:1,    speed:83,  radius:9,  cash:1,   spawnOn:'red' },
  green:  { name:'Green',  color:'#27ae60', hp:1,    speed:100, radius:9,  cash:1,   spawnOn:'blue' },
  yellow: { name:'Yellow', color:'#f1c40f', hp:1,    speed:150, radius:9,  cash:1,   spawnOn:'green' },
  pink:   { name:'Pink',   color:'#ff5fa2', hp:1,    speed:185, radius:9,  cash:1,   spawnOn:'yellow' },
  white:  { name:'White',  color:'#ecf0f1', hp:1,    speed:100, radius:10, cash:1,   spawnOn:'pink', outline:'#aaa', immuneFreeze:true },
  black:  { name:'Black',  color:'#2c3e50', hp:1,    speed:100, radius:10, cash:1,   spawnOn:'pink', immuneExplode:true },
  purple: { name:'Purple', color:'#9b59b6', hp:1,    speed:105, radius:10, cash:1,   spawnOn:'pink', immuneFire:true },
  lead:   { name:'Lead',   color:'#95a5a6', hp:1,    speed:66,  radius:11, cash:1,   spawnOn:'black', isLead:true },
  zebra:  { name:'Zebra',  color:'#bdc3c7', hp:1,    speed:100, radius:11, cash:1,   spawnOn:'white', stripe:true, immuneFreeze:true, immuneExplode:true },
  rainbow:{ name:'Rainbow',color:'#e74c3c', hp:1,    speed:110, radius:12, cash:1,   spawnOn:'zebra', isRainbow:true },
  ceramic:{ name:'Ceramic',color:'#d35400', hp:10,   speed:90,  radius:12, cash:5,   spawnOn:'rainbow', isCeramic:true },
  moab:   { name:'MOAB',   color:'#2980b9', hp:200,  speed:34,  radius:30, cash:40,  spawnOn:'ceramic', isMoab:true, numSpawn:4 },
  bfb:    { name:'BFB',    color:'#c0392b', hp:700,  speed:16,  radius:44, cash:120, spawnOn:'moab', isMoab:true, numSpawn:4 },
  ddt:    { name:'DDT',    color:'#1a1a1a', hp:400,  speed:135, radius:30, cash:120, spawnOn:'ceramic', isMoab:true, numSpawn:4, camo:true, isLead:true, immuneFire:false },
  zomg:   { name:'ZOMG',   color:'#8e44ad', hp:4000, speed:10,  radius:58, cash:400, spawnOn:'bfb', isMoab:true, numSpawn:4 },
  bad:    { name:'BAD',    color:'#c0392b', hp:20000,speed:9,   radius:70, cash:1200,spawnOn:'zomg', isMoab:true, numSpawn:3, fortified:true },
};

// HP scaling factor applied to raw bloon layers so ceramics/MOABs scale in freeplay
const LAYER_HP = { // effective hp of a single bloon layer (child re-added on pop)
  red:1, blue:1, green:1, yellow:1, pink:1, white:1, black:1, purple:1, lead:1, zebra:1, rainbow:1,
};

// ---- WAVE GENERATION (harder + BTD6-style properties) ----
function getWaveComposition(round, playerCount, diff) {
  const mult = 1 + (playerCount - 1) * 0.65;
  const base = [];
  const push = (type, n, props) => { for (let i=0;i<Math.max(0,Math.floor(n*mult));i++) base.push({type, ...props}); };

  // regrow / camo / fortified introduced progressively (earlier on hard/impoppable)
  const early = (diff==='hard'||diff==='impoppable');
  const camoStart = early ? 12 : 18;
  const regrowStart = early ? 10 : 15;
  const fortStart = early ? 40 : 55;

  if (round <= 5) {
    push('red', round*10+8);
    if (round>=3) push('blue', (round-2)*6);
  } else if (round <= 10) {
    push('blue', 14); push('green', (round-4)*7);
    if (round>=regrowStart) push('green', (round-regrowStart+1)*4, {regrow:true});
    if (round>=8) push('yellow', (round-7)*4);
  } else if (round <= 20) {
    push('green', 12); push('yellow', (round-8)*6); push('pink', (round-12)*3);
    if (round>=camoStart) push('green', (round-camoStart+1)*3, {camo:true});
    if (round>=regrowStart) push('yellow', (round-regrowStart)*3, {regrow:true});
    if (round>=17) push('white', (round-16)*2);
    if (round>=18) push('black', (round-17)*2);
  } else if (round <= 30) {
    push('yellow', 14); push('pink', (round-18)*5); push('white', (round-20)*3); push('black', (round-20)*3);
    push('pink', (round-22)*3, {camo:true, regrow:true});
    if (round>=24) push('lead', (round-23)*2);
    if (round>=26) push('zebra', (round-25)*2);
    if (round>=28) push('purple', (round-27)*3);
  } else if (round <= 40) {
    push('white', 8); push('black', 8); push('lead', (round-28)*3); push('zebra', (round-28)*3);
    push('rainbow', (round-32)*2); push('pink', (round-30)*4, {camo:true, regrow:true});
    if (fortStart<=round) push('lead', (round-fortStart)*2, {fortified:true});
    if (round>=35) push('ceramic', (round-34)*1);
    if (round===40) push('moab', 1);
  } else if (round <= 50) {
    push('rainbow', 10); push('ceramic', (round-38)*2); push('lead', 8, {fortified: round>=fortStart});
    push('zebra', 8, {camo:true}); push('rainbow', (round-42)*2, {regrow:true});
    push('moab', Math.floor((round-40)*0.6));
    if (round===50) { push('bfb', 1); }
  } else if (round <= 60) {
    push('ceramic', (round-48)*3); push('ceramic', (round-50)*2, {camo:true, regrow:true});
    push('moab', (round-49)*1); push('rainbow', 12, {fortified:true});
    if (round>=55) push('ddt', Math.floor((round-54)*0.4));
    if (round>=58) push('bfb', Math.floor((round-57)*0.6));
    if (round===60) push('bfb', 2);
  } else if (round <= 80) {
    push('ceramic', (round-58)*3, {fortified:true}); push('moab', (round-58)*1.2);
    push('bfb', (round-60)*0.6); push('ddt', (round-62)*0.5, {regrow:true});
    if (round>=75) push('zomg', Math.floor((round-74)*0.3));
  } else if (round <= 100) {
    push('ceramic', (round-78)*3, {fortified:true, camo:true, regrow:true});
    push('moab', (round-78)*1.4); push('bfb', (round-80)*0.9); push('ddt', (round-80)*0.5);
    if (round>=90) push('zomg', Math.floor((round-89)*0.5));
    if (round===100) { push('zomg', 3); push('bad', 1); }
  } else {
    // FREEPLAY — endless scaling
    const f = round - 98;
    push('ceramic', f*3, {fortified:true, camo:true, regrow:true});
    push('moab', f*1.5, {fortified:true}); push('bfb', f*0.9);
    push('ddt', f*0.6, {camo:true, regrow:true}); push('zomg', f*0.4);
    if (round>=120) push('bad', Math.floor((round-119)*0.2), {fortified:true});
  }

  // Shuffle
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  return base;
}

// HP multiplier for bloons based on round (freeplay ramp) — makes late game hard
function getRoundHpMul(round) {
  if (round <= 80) return 1;
  if (round <= 100) return 1 + (round-80)*0.06;      // up to ~2.2x
  if (round <= 150) return 2.2 + (round-100)*0.09;   // up to ~6.7x
  return 6.7 + (round-150)*0.15;                     // endless
}

function getIncomeMultiplier(round) {
  if (round <= 50) return 1.0;
  if (round <= 60) return 0.55;
  if (round <= 85) return 0.25;
  if (round <= 100) return 0.12;
  if (round <= 120) return 0.06;
  if (round <= 140) return 0.04;
  return 0.02;
}

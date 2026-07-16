// =============================================
// BTD BATTLES 2 — PVP & OFFLINE ARENA ENGINE
// =============================================

// -------- DYNAMIC MAP DEFINITIONS --------
const MAPS = {
  zen: {
    id: 'zen',
    name: 'Zen Garden 🌸',
    bg: 'radial-gradient(ellipse at center, #1b4d22 0%, #082108 80%)',
    trackColor: '#dcc6af',
    borderColor: '#82654d',
    accentColor: '#ffb7c5',
    path: (w, h) => [
      {x: -40, y: h * 0.18},
      {x: w * 0.28, y: h * 0.18},
      {x: w * 0.28, y: h * 0.48},
      {x: w * 0.12, y: h * 0.48},
      {x: w * 0.12, y: h * 0.78},
      {x: w * 0.48, y: h * 0.78},
      {x: w * 0.48, y: h * 0.28},
      {x: w * 0.72, y: h * 0.28},
      {x: w * 0.72, y: h * 0.72},
      {x: w * 0.88, y: h * 0.72},
      {x: w * 0.88, y: h * 0.14},
      {x: w + 40, y: h * 0.14}
    ]
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Junction ⚡',
    bg: 'radial-gradient(circle at center, #0f1c30 0%, #03070f 80%)',
    trackColor: '#27354a',
    borderColor: '#17202e',
    accentColor: '#00f2fe',
    path: (w, h) => [
      {x: -40, y: h * 0.5},
      {x: w * 0.16, y: h * 0.5},
      {x: w * 0.16, y: h * 0.16},
      {x: w * 0.48, y: h * 0.16},
      {x: w * 0.48, y: h * 0.84},
      {x: w * 0.80, y: h * 0.84},
      {x: w * 0.80, y: h * 0.5},
      {x: w + 40, y: h * 0.5}
    ]
  },
  lava: {
    id: 'lava',
    name: 'Lava Trench 🌋',
    bg: 'radial-gradient(ellipse at 50% 50%, #290d09 0%, #080201 80%)',
    trackColor: '#453835',
    borderColor: '#2b211f',
    accentColor: '#ff4800',
    path: (w, h) => [
      {x: -40, y: h * 0.12},
      {x: w * 0.84, y: h * 0.12},
      {x: w * 0.84, y: h * 0.48},
      {x: w * 0.16, y: h * 0.48},
      {x: w * 0.16, y: h * 0.86},
      {x: w + 40, y: h * 0.86}
    ]
  }
};

// -------- SENDABLE BLOONS (BTD Battles Eco Sends) --------
const SENDABLE_BLOONS = [
  { type: 'red',     cost: 50,   eco: 1.0,  icon: '🔴', count: 1,  minRound: 1,  desc: 'Fast eco builder' },
  { type: 'blue',    cost: 75,   eco: 1.5,  icon: '🔵', count: 1,  minRound: 3,  desc: 'Medium eco' },
  { type: 'green',   cost: 100,  eco: 2.0,  icon: '🟢', count: 1,  minRound: 5,  desc: 'Decent speed eco' },
  { type: 'yellow',  cost: 140,  eco: 2.6,  icon: '🟡', count: 1,  minRound: 7,  desc: 'Fast speed eco' },
  { type: 'pink',    cost: 180,  eco: 3.2,  icon: '💗', count: 1,  minRound: 9,  desc: 'Super speed eco' },
  { type: 'purple',  cost: 220,  eco: 3.8,  icon: '🟣', count: 1,  minRound: 11, desc: 'Fire-immune rush' },
  { type: 'black',   cost: 250,  eco: 4.2,  icon: '⚫', count: 1,  minRound: 12, desc: 'Explosive immune' },
  { type: 'white',   cost: 260,  eco: 4.4,  icon: '⚪', count: 1,  minRound: 12, desc: 'Freeze immune' },
  { type: 'lead',    cost: 300,  eco: 4.8,  icon: '⬛', count: 2,  minRound: 14, desc: 'Pops-immune rush' },
  { type: 'zebra',   cost: 380,  eco: 5.5,  icon: '🦓', count: 1,  minRound: 15, desc: 'Dual immunity' },
  { type: 'rainbow', cost: 480,  eco: 6.2,  icon: '🌈', count: 1,  minRound: 16, desc: 'Quick regen rush' },
  { type: 'ceramic', cost: 750,  eco: 8.0,  icon: '🏺', count: 1,  minRound: 18, desc: 'Heavy defense' },
  { type: 'moab',    cost: 1500, eco: 0,    icon: '🎈', count: 1,  minRound: 20, desc: 'Huge MOAB blimp' },
  { type: 'bfb',     cost: 3000, eco: -20,  icon: '🛑', count: 1,  minRound: 22, desc: 'Brutal BFB blimp' },
  { type: 'zomg',    cost: 6000, eco: -50,  icon: '💀', count: 1,  minRound: 24, desc: 'Titan ZOMG blimp' }
];

// -------- ENGINE GLOBALS --------
let canvasW = 0, canvasH = 0;
let G = null; // Global Game Session
let animFrameId = null;
let lastTime = 0;
let nextId = 1;
let enemyIdCounter = 1;

// Profile & Leaderboards State
let userProfile = {
  name: 'Player_' + Math.floor(1000 + Math.random() * 9000),
  wins: 0,
  losses: 0,
  trophies: 200,
  popped: 0,
  ecoSent: 0
};
let settings = {
  sfx: true,
  ambient: true,
  anticheat: true,
  particles: 'medium'
};

// WebSocket Multiplayer State
let ws = null;
let wsId = null;
let wsRoomId = null;
let wsRole = 'host'; // 'host' (left) or 'guest' (right)
let isSearching = false;
let mapVotes = {};
let selectedLoadout = { hero: 'quincy', towers: [] };
let opponentLoadout = { hero: 'quincy', towers: [] };
let opponentProfile = { name: 'Opponent', trophies: 200 };
let setupTimer = 15;
let setupIntervalId = null;

// -------- FIREBASE INTEGRATION (AUTH & FIRESTORE) --------
let db = null;
let isFirebaseConnected = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      const firebaseConfig = {
        apiKey: "AIzaSyFakeKey_BtdBattlesPreviewFallback",
        authDomain: "balloon-td6-remake.firebaseapp.com",
        projectId: "balloon-td6-remake",
        storageBucket: "balloon-td6-remake.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef"
      };
      
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      isFirebaseConnected = true;
      console.log("Firebase Firestore successfully initialized client-side.");
      
      // Attempt anonymous auth
      firebase.auth().signInAnonymously()
        .then(() => {
          console.log("Authenticated anonymously with Firebase Auth.");
          loadProfileFromFirestore();
        })
        .catch(err => console.warn("Firebase Auth bypassed, using Local Profile. Error:", err));
    } else {
      console.log("Firebase CDN not loaded or offline. Falling back to LocalStorage profiles.");
    }
  } catch (e) {
    console.warn("Firebase initialization failed. Bypassing database sync. Error:", e);
  }
}

// Save profile to LocalStorage & Firestore
function saveProfile() {
  localStorage.setItem('btd_battles_profile', JSON.stringify(userProfile));
  
  // Sync with Firestore if connected
  if (isFirebaseConnected && db) {
    try {
      db.collection('profiles').doc(userProfile.name).set(userProfile)
        .then(() => console.log("Profile successfully synced with Firestore."))
        .catch(err => console.warn("Error syncing profile with Firestore:", err));
    } catch (e) {
      console.warn("Firestore save error:", e);
    }
  }
}

// Load profile from Firestore or LocalStorage
function loadProfile() {
  const local = localStorage.getItem('btd_battles_profile');
  if (local) {
    try {
      userProfile = JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local profile.");
    }
  } else {
    saveProfile();
  }
  updateProfileUI();
}

function loadProfileFromFirestore() {
  if (isFirebaseConnected && db) {
    db.collection('profiles').doc(userProfile.name).get()
      .then(doc => {
        if (doc.exists) {
          userProfile = doc.data();
          saveProfile();
          updateProfileUI();
        }
      })
      .catch(err => console.warn("Could not retrieve Firestore profile:", err));
  }
}

function updateProfileUI() {
  document.getElementById('profile-bar-name').textContent = userProfile.name;
  document.getElementById('profile-bar-trophies').textContent = userProfile.trophies;
}

// -------- WEBSOCKET CONNECTION --------
function connectWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}`;
  
  ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log("Connected to BTD Battles 2 game server.");
    // Register profile
    ws.send(JSON.stringify({
      type: 'register',
      name: userProfile.name,
      profile: {
        wins: userProfile.wins,
        losses: userProfile.losses,
        trophies: userProfile.trophies
      }
    }));
  };
  
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleServerMessage(msg);
    } catch (e) {
      console.error("Error reading WebSocket message:", e);
    }
  };
  
  ws.onclose = () => {
    console.warn("WebSocket disconnected from server.");
    if (isSearching) {
      cancelMatchmaking();
    }
    // Auto-reconnect after 3 seconds
    setTimeout(connectWebSocket, 3000);
  };
}

function handleServerMessage(msg) {
  switch (msg.type) {
    case 'welcome':
      wsId = msg.id;
      break;
      
    case 'queue-joined':
      isSearching = true;
      showScreen('searching-screen');
      break;
      
    case 'queue-left':
      isSearching = false;
      showScreen('menu-screen');
      break;
      
    case 'matched':
      wsRoomId = msg.roomId;
      wsRole = msg.role;
      opponentProfile = msg.opponent;
      isSearching = false;
      openSetupScreen();
      break;
      
    case 'lobby-created':
      document.getElementById('private-code-display').textContent = msg.code;
      document.getElementById('private-lobby-area').style.display = 'block';
      document.getElementById('join-lobby-panel').style.display = 'none';
      break;
      
    case 'lobby-joined':
      wsRoomId = msg.code;
      wsRole = msg.role;
      opponentProfile = msg.opponent;
      
      document.getElementById('private-code-display').textContent = msg.code;
      document.getElementById('private-lobby-area').style.display = 'block';
      document.getElementById('join-lobby-panel').style.display = 'none';
      
      // Display both players in lobby list
      updateLobbyPlayerList(userProfile, opponentProfile);
      break;
      
    case 'opponent-joined':
      opponentProfile = msg.opponent;
      updateLobbyPlayerList(userProfile, opponentProfile);
      document.getElementById('start-private-setup-btn').removeAttribute('disabled');
      break;
      
    case 'enter-setup':
      openSetupScreen();
      break;
      
    case 'map-voted':
      // Show checkmark on map if other player voted
      if (msg.clientId !== wsId) {
        const check = document.getElementById(`vote-check-${msg.mapId}`);
        if (check) check.style.display = 'block';
      }
      break;
      
    case 'map-finalized':
      highlightChosenMap(msg.mapId);
      break;
      
    case 'loadout-ready':
      document.getElementById('setup-opponent-status').textContent = "Opponent LOADOUT locked!";
      opponentLoadout = msg.loadout;
      break;
      
    case 'match-start':
      startGame(true, msg.mapId);
      break;
      
    case 'opponent-action':
      applyOpponentAction(msg.action);
      break;
      
    case 'opponent-disconnected':
      if (G && !G.gameOver) {
        G.gameOver = true;
        userProfile.wins++;
        userProfile.trophies += 25;
        saveProfile();
        triggerVictoryOverlay("OPPONENT DISCONNECTED / FORFEITED");
      } else {
        alert(msg.message);
        quitGame();
      }
      break;
      
    case 'leaderboard-data':
      renderLeaderboardTable(msg.leaderboard);
      break;
  }
}

// -------- ARENA BOARD CONSTRUCTOR --------
function createBoardState(isOpponent, mapId) {
  const mapDef = MAPS[mapId] || MAPS.zen;
  const pathPoints = mapDef.path(canvasW / (G?.isPvP ? 2 : 1), canvasH);
  
  return {
    isOpponent,
    mapDef,
    pathPoints,
    pathLen: getTotalPathLen(pathPoints),
    cash: 650,
    lives: 150,
    eco: 250,
    ecoTimer: 0,
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    spikes: [],
    spawnQueue: [],
    spawnTimer: 0,
    spawnInterval: 0.35,
    hero: null,
    totalPops: 0,
    boostTimer: 0,
    waveActive: false
  };
}

// -------- GAME LOADOUT & SETUP --------
function openSetupScreen() {
  showScreen('setup-screen');
  
  // Reset voting and picks
  selectedLoadout = { hero: 'quincy', towers: [] };
  opponentLoadout = { hero: 'quincy', towers: [] };
  
  // Setup timer
  setupTimer = 15;
  document.getElementById('setup-timer-txt').textContent = `TIME REMAINING: ${setupTimer}s`;
  if (setupIntervalId) clearInterval(setupIntervalId);
  
  setupIntervalId = setInterval(() => {
    setupTimer--;
    document.getElementById('setup-timer-txt').textContent = `TIME REMAINING: ${setupTimer}s`;
    if (setupTimer <= 0) {
      clearInterval(setupIntervalId);
      lockInBattleLoadout();
    }
  }, 1000);
  
  // Render Map Votes
  const mvc = document.getElementById('map-votes-container');
  mvc.innerHTML = '';
  Object.values(MAPS).forEach(map => {
    const card = document.createElement('div');
    card.className = 'diff-card';
    card.id = `map-card-${map.id}`;
    card.style.borderColor = map.accentColor;
    card.innerHTML = `
      <div class="dc-icon">🗺️</div>
      <div class="dc-name" style="color: ${map.accentColor}">${map.name}</div>
      <div class="dc-desc" style="font-size:0.65rem; color:#aaa;">Vote to compete here</div>
      <div id="vote-check-${map.id}" style="display:none; color:var(--accent3); font-size:1.1rem; margin-top:5px;">✓ Other Voted</div>
    `;
    card.onclick = () => {
      document.querySelectorAll('#map-votes-container .diff-card').forEach(x => x.style.boxShadow = 'none');
      card.style.boxShadow = `0 0 20px ${map.accentColor}`;
      // Send map vote
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'vote-map', mapId: map.id }));
      }
    };
    mvc.appendChild(card);
  });
  
  // Render Hero selection in setup
  const hPick = document.getElementById('setup-hero-pick');
  hPick.innerHTML = '';
  Object.values(HEROES).forEach(h => {
    const card = document.createElement('div');
    card.className = 'hero-card' + (h.id === selectedLoadout.hero ? ' selected' : '');
    card.innerHTML = `
      <div class="hc-icon">${h.icon}</div>
      <div class="hc-name">${h.name}</div>
      <div class="hc-desc">${h.desc}</div>
    `;
    card.onclick = () => {
      selectedLoadout.hero = h.id;
      document.querySelectorAll('#setup-hero-pick .hero-card').forEach(x => x.classList.remove('selected'));
      card.classList.add('selected');
    };
    hPick.appendChild(card);
  });
  
  // Render Tower selections in setup (Select 3)
  const tPick = document.getElementById('setup-tower-pick');
  tPick.innerHTML = '';
  TOWER_DEFS.forEach(def => {
    const card = document.createElement('div');
    card.className = 'tower-card';
    card.style.width = '120px';
    card.style.margin = '4px';
    card.style.textAlign = 'center';
    card.innerHTML = `
      <div style="font-size: 1.6rem; margin-bottom:4px;">${def.icon}</div>
      <div class="tower-name" style="font-size:0.75rem;">${def.name}</div>
      <div style="font-size: 0.65rem; color:var(--gold); font-family: 'Orbitron', sans-serif; margin-top:2px;">$${def.cost}</div>
    `;
    card.onclick = () => {
      const idx = selectedLoadout.towers.indexOf(def.id);
      if (idx >= 0) {
        selectedLoadout.towers.splice(idx, 1);
        card.classList.remove('selected');
      } else {
        if (selectedLoadout.towers.length >= 3) {
          // Deselect first selected
          const firstId = selectedLoadout.towers.shift();
          const firstCard = Array.from(document.querySelectorAll('#setup-tower-pick .tower-card')).find(c => c.innerHTML.includes(firstId));
          if (firstCard) firstCard.classList.remove('selected');
        }
        selectedLoadout.towers.push(def.id);
        card.classList.add('selected');
      }
      
      // Update Lock-In Button accessibility
      const btn = document.getElementById('setup-lock-btn');
      if (selectedLoadout.towers.length === 3) {
        btn.removeAttribute('disabled');
        btn.textContent = "LOCK IN LOADOUT";
      } else {
        btn.setAttribute('disabled', 'true');
        btn.textContent = `CHOOSE ${3 - selectedLoadout.towers.length} MORE TOWERS`;
      }
    };
    tPick.appendChild(card);
  });
}

function highlightChosenMap(mapId) {
  const card = document.getElementById(`map-card-${mapId}`);
  if (card) {
    document.querySelectorAll('#map-votes-container .diff-card').forEach(x => {
      x.style.borderWidth = '1px';
      x.style.opacity = '0.6';
    });
    card.style.opacity = '1';
    card.style.borderWidth = '4px';
    card.style.borderColor = 'var(--accent3)';
  }
}

function lockInBattleLoadout() {
  if (selectedLoadout.towers.length < 3) {
    // Pick random if not selected
    while (selectedLoadout.towers.length < 3) {
      const randomTower = TOWER_DEFS[Math.floor(Math.random() * TOWER_DEFS.length)].id;
      if (!selectedLoadout.towers.includes(randomTower)) {
        selectedLoadout.towers.push(randomTower);
      }
    }
  }
  
  if (setupIntervalId) {
    clearInterval(setupIntervalId);
    setupIntervalId = null;
  }
  
  document.getElementById('setup-lock-btn').setAttribute('disabled', 'true');
  document.getElementById('setup-lock-btn').textContent = "LOADOUT LOCKED!";
  document.getElementById('setup-opponent-status').textContent = "Waiting for opponent... Game starts shortly.";
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'select-loadout',
      hero: selectedLoadout.hero,
      towers: selectedLoadout.towers
    }));
  } else {
    // Offline / AI Fallback - instantly proceed
    opponentLoadout = {
      hero: Object.keys(HEROES)[Math.floor(Math.random() * Object.keys(HEROES).length)],
      towers: []
    };
    while (opponentLoadout.towers.length < 3) {
      const randomTower = TOWER_DEFS[Math.floor(Math.random() * TOWER_DEFS.length)].id;
      if (!opponentLoadout.towers.includes(randomTower)) {
        opponentLoadout.towers.push(randomTower);
      }
    }
    setTimeout(() => {
      startGame(true, 'zen');
    }, 1200);
  }
}

// -------- START GAME --------
function startGame(isPvP, mapId) {
  // Clear any active animation
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  
  // Set global Game state
  G = {
    isPvP,
    mapId,
    speed: 1,
    autostart: true,
    time: 0,
    gameOver: false,
    victory: false,
    placingTower: null,
    selectedTower: null,
    armedPower: null,
    mouseX: undefined,
    mouseY: undefined,
    myBoard: createBoardState(false, mapId),
    opBoard: isPvP ? createBoardState(true, mapId) : null
  };
  
  // Set UI views
  showScreen('game-screen');
  
  const singleCont = document.getElementById('single-canvas-container');
  const pvpCont = document.getElementById('pvp-canvases-container');
  const sendsTab = document.getElementById('tab-sends');
  
  if (isPvP) {
    singleCont.style.display = 'none';
    pvpCont.style.display = 'flex';
    sendsTab.style.display = 'block';
    
    // Set Names on layout
    document.getElementById('my-name-display').textContent = userProfile.name.toUpperCase();
    document.getElementById('my-trophies-display').textContent = userProfile.trophies;
    document.getElementById('op-name-display').textContent = (wsRoomId ? opponentProfile.name : "COSMIC AI").toUpperCase();
    document.getElementById('op-trophies-display').textContent = wsRoomId ? opponentProfile.trophies : 250;
    
    // Show single stats fallback as none
    document.getElementById('solo-cash-stat').style.display = 'none';
    document.getElementById('solo-cash-sep').style.display = 'none';
    document.getElementById('solo-lives-stat').style.display = 'none';
    document.getElementById('solo-lives-sep').style.display = 'none';
    document.getElementById('solo-eco-stat').style.display = 'none';
    document.getElementById('solo-eco-sep').style.display = 'none';
    
    initDualCanvases();
  } else {
    singleCont.style.display = 'block';
    pvpCont.style.display = 'none';
    sendsTab.style.display = 'none';
    
    document.getElementById('solo-cash-stat').style.display = 'flex';
    document.getElementById('solo-cash-sep').style.display = 'flex';
    document.getElementById('solo-lives-stat').style.display = 'flex';
    document.getElementById('solo-lives-sep').style.display = 'flex';
    document.getElementById('solo-eco-stat').style.display = 'flex';
    document.getElementById('solo-eco-sep').style.display = 'flex';
    
    initSingleCanvas();
  }
  
  // Pre-place Heroes
  setupHero(G.myBoard, selectedLoadout.hero);
  if (isPvP && G.opBoard) {
    setupHero(G.opBoard, opponentLoadout.hero);
  }
  
  // Reset overlay
  document.getElementById('gameover-overlay').classList.remove('show');
  
  // Initial draw and loop
  buildShop();
  setupPowers();
  updateHUD();
  
  lastTime = performance.now();
  loop();
}

function initSingleCanvas() {
  const canvas = document.getElementById('game-canvas');
  const wrap = document.getElementById('canvas-wrap');
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  canvasW = canvas.width; canvasH = canvas.height;
  
  // Re-build path for player board based on single dimensions
  G.myBoard.pathPoints = MAPS[G.mapId].path(canvasW, canvasH);
  G.myBoard.pathLen = getTotalPathLen(G.myBoard.pathPoints);
  
  canvas.onclick = (e) => onCanvasClick(e, G.myBoard, canvas);
  canvas.onmousemove = (e) => onCanvasMouseMove(e, G.myBoard, canvas);
  canvas.oncontextmenu = e => { e.preventDefault(); deselectTower(); G.armedPower=null; updatePowersBar(); };
}

function initDualCanvases() {
  const myCanvas = document.getElementById('my-pvp-canvas');
  const opCanvas = document.getElementById('op-pvp-canvas');
  const myWrap = document.getElementById('my-lane');
  
  myCanvas.width = myWrap.clientWidth;
  myCanvas.height = myWrap.clientHeight;
  opCanvas.width = myWrap.clientWidth;
  opCanvas.height = myWrap.clientHeight;
  
  canvasW = myCanvas.width;
  canvasH = myCanvas.height;
  
  // Sync map path dimension
  G.myBoard.pathPoints = MAPS[G.mapId].path(canvasW, canvasH);
  G.myBoard.pathLen = getTotalPathLen(G.myBoard.pathPoints);
  
  G.opBoard.pathPoints = MAPS[G.mapId].path(canvasW, canvasH);
  G.opBoard.pathLen = getTotalPathLen(G.opBoard.pathPoints);
  
  myCanvas.onclick = (e) => onCanvasClick(e, G.myBoard, myCanvas);
  myCanvas.onmousemove = (e) => onCanvasMouseMove(e, G.myBoard, myCanvas);
  myCanvas.oncontextmenu = e => { e.preventDefault(); deselectTower(); G.armedPower=null; updatePowersBar(); };
}

// Setup Hero unit for board
function setupHero(board, heroKey) {
  const def = HEROES[heroKey] || HEROES.quincy;
  // Pick hero coordinates
  const pts = board.pathPoints;
  const startPt = pts[Math.floor(pts.length / 2)];
  
  board.hero = {
    id: uid(),
    heroKey,
    def,
    x: startPt.x - 30,
    y: startPt.y + 35,
    placed: true,
    level: 1,
    xp: 0,
    xpNext: 80,
    range: def.range,
    fireRate: def.fireRate,
    damage: def.damage,
    pierce: def.pierce,
    projectileSpeed: def.projectileSpeed,
    projectileRadius: def.projectileRadius,
    numProjectiles: def.numProjectiles || 1,
    camo: def.camo || false,
    lead: true,
    moabDamage: def.moabDmg || 1,
    dot: def.dot || 0,
    dotInterval: def.dotInterval || 0,
    isExplosive: def.isExplosive || false,
    explodeRadius: def.explodeRadius || 0,
    isHacker: def.isHacker || false,
    income: def.isHacker ? 300 : 0,
    fireTimer: 0,
    abilityCd: 0,
    abilityReady: false,
    abilityActive: 0,
    target: 'first'
  };
  
  if (!board.isOpponent) {
    document.getElementById('hero-bar').style.display = 'flex';
    document.getElementById('hero-portrait').textContent = def.icon;
    document.getElementById('hero-name-bar').textContent = def.name;
    document.getElementById('hero-ability-icon').textContent = def.ability.icon;
    updateHeroBar();
  }
}

// -------- PHYSICS MAIN LOOP --------
function loop(timeNow) {
  if (!G) return;
  animFrameId = requestAnimationFrame(loop);
  
  if (!timeNow) timeNow = performance.now();
  let dt = (timeNow - lastTime) / 1000;
  if (dt > 0.15) dt = 0.15; // Cap to avoid massive skips
  lastTime = timeNow;
  
  const loops = G.speed;
  for (let step = 0; step < loops; step++) {
    const subDt = dt;
    G.time += subDt;
    
    // Update player's board
    updateBoard(G.myBoard, subDt);
    
    // Update opponent's board (if PvP)
    if (G.isPvP && G.opBoard) {
      updateBoard(G.opBoard, subDt);
      
      // AI opponent logic (offline only)
      if (!wsRoomId && !G.gameOver) {
        updateOfflineAI(G.opBoard, subDt);
      }
    }
  }
  
  // Render views
  renderGame();
}

function updateBoard(board, dt) {
  if (G.gameOver) return;
  
  // 1. Eco Income tick (every 6 seconds)
  board.ecoTimer += dt;
  if (board.ecoTimer >= 6.0) {
    board.ecoTimer = 0;
    board.cash += board.eco;
    if (!board.isOpponent) {
      userProfile.ecoSent += board.eco;
      updateHUD();
      // Floating Eco indication
      createFloatingText(board.hero.x, board.hero.y, `+$${board.eco}`, '#00ff88');
    }
  }
  
  // 2. Cooldowns
  if (board.hero && board.hero.abilityCd > 0) {
    board.hero.abilityCd -= dt;
    if (board.hero.abilityCd <= 0) {
      board.hero.abilityCd = 0;
      if (!board.isOpponent) {
        document.getElementById('hero-ability-btn').classList.add('ready');
      }
    }
    if (!board.isOpponent) updateHeroBar();
  }
  
  if (board.boostTimer > 0) {
    board.boostTimer -= dt;
  }
  
  // 3. Update towers
  for (const t of board.towers) {
    if (t.isFarm) {
      // Income generation
      t.fireTimer += dt;
      if (t.fireTimer >= t.fireRate) {
        t.fireTimer = 0;
        board.cash += effDamage(t);
        spawnParticles(t.x, t.y, '#ffd700', 3, board);
      }
    } else {
      t.fireTimer += dt;
      if (t.fireTimer >= 1 / effRate(t, board)) {
        const targets = acquireTargets(t, board);
        if (targets.length) {
          fireTower(t, targets[0], board);
          t.fireTimer = 0;
        }
      }
    }
  }
  
  // 4. Update hero
  if (board.hero) {
    const h = board.hero;
    h.fireTimer += dt;
    if (!h.isHacker) {
      if (h.fireTimer >= 1 / h.fireRate) {
        const targets = acquireTargets(h, board);
        if (targets.length) {
          fireHero(h, targets[0], board);
          h.fireTimer = 0;
        }
      }
    }
  }
  
  // 5. Update wave spawning
  if (board.waveActive) {
    board.spawnTimer -= dt;
    if (board.spawnTimer <= 0 && board.spawnQueue.length > 0) {
      const nextEnemy = board.spawnQueue.shift();
      spawnEnemyOnBoard(nextEnemy, board);
      board.spawnTimer = board.spawnInterval;
    }
    if (board.spawnQueue.length === 0 && board.enemies.length === 0) {
      board.waveActive = false;
      
      // Auto-start next round in PvP to maintain tempo
      if (G.autostart && !G.gameOver) {
        setTimeout(() => {
          if (G && !board.waveActive && !G.gameOver) {
            board.waveActive = true;
            board.spawnQueue = getWaveComposition(G.myBoard.isOpponent ? G.opBoard.round : G.myBoard.round, 1, 'medium');
            board.spawnTimer = 0;
            if (!board.isOpponent) {
              G.myBoard.round++;
              updateHUD();
            } else {
              G.opBoard.round++;
            }
          }
        }, 3000);
      }
    }
  }
  
  // 6. Update enemies
  const toRemove = [];
  for (const e of board.enemies) {
    if (e.frozen > 0) {
      e.frozen -= dt;
      if (e.frozen < 0) e.frozen = 0;
    }
    if (e.stunned > 0) {
      e.stunned -= dt;
    }
    
    if (e.frozen > 0 || e.stunned > 0) continue;
    
    const sf = e.slowed > 0 ? e.slowFactor : 1;
    if (e.slowed > 0) e.slowed -= dt;
    
    e.t += (e.speed * sf * dt) / board.pathLen;
    if (e.t >= 1) {
      board.lives -= e.def.isMoab ? 50 : 1;
      toRemove.push(e);
      
      if (board.lives <= 0) {
        board.lives = 0;
        endMatchGame(board.isOpponent); // If opponent lives <= 0, YOU win!
      }
    } else {
      const pos = getPathPos(e.t, board.pathPoints);
      e.x = pos.x;
      e.y = pos.y;
    }
  }
  
  board.enemies = board.enemies.filter(e => !toRemove.includes(e));
  
  // 7. Update projectiles
  updateProjectilesOnBoard(board, dt);
  
  // 8. Particles
  for (const p of board.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.life -= dt;
  }
  board.particles = board.particles.filter(p => p.life > 0);
  
  // Anti-cheat validation (if strict validation settings are turned on)
  if (settings.anticheat && !board.isOpponent) {
    validateGameStateAndPreventCheat(board);
  }
}

// -------- OFFLINE AI OPPONENT BEHAVIOR (Practice Arena) --------
let aiActionTimer = 0;
function updateOfflineAI(board, dt) {
  aiActionTimer += dt;
  if (aiActionTimer >= 2.2) {
    aiActionTimer = 0;
    
    // AI has cash? Place a tower!
    if (board.cash >= 400 && board.towers.length < 8) {
      const p = getAiPlacement(board);
      const randomDef = TOWER_DEFS[Math.floor(Math.random() * TOWER_DEFS.length)];
      if (board.cash >= priceOf(randomDef.cost)) {
        board.cash -= priceOf(randomDef.cost);
        board.towers.push(createTower(randomDef, p.x, p.y, 1));
      }
    }
    
    // AI upgrades sometimes
    if (board.cash >= 600 && board.towers.length > 0) {
      const t = board.towers[Math.floor(Math.random() * board.towers.length)];
      const pathIdx = Math.floor(Math.random() * 3);
      if (t.upgradeLevels[pathIdx] < 3) {
        const path = t.def.upgrades[pathIdx];
        const upg = path.levels[t.upgradeLevels[pathIdx]];
        const cost = priceOf(upg.cost);
        if (board.cash >= cost && canUpgrade(t, pathIdx)) {
          board.cash -= cost;
          t.upgradeLevels[pathIdx]++;
          recomputeTowerStats(t);
        }
      }
    }
    
    // AI sends bloons to your side to increase its eco!
    if (board.cash >= 150) {
      // Pick sendable bloon based on current round
      const available = SENDABLE_BLOONS.filter(s => s.minRound <= G.myBoard.round && s.cost <= board.cash - 100);
      if (available.length) {
        const send = available[available.length - 1]; // Send strongest afford
        board.cash -= send.cost;
        board.eco += send.eco;
        
        // Spawn on player's track
        sendBloonsToBoard(send.type, G.myBoard);
      }
    }
  }
}

function getAiPlacement(board) {
  const pts = board.pathPoints;
  const idx = Math.floor(Math.random() * (pts.length - 2)) + 1;
  const pt = pts[idx];
  const angle = Math.random() * Math.PI * 2;
  const dist = 32 + Math.random() * 25;
  return {
    x: Math.max(20, Math.min(canvasW - 20, pt.x + Math.cos(angle) * dist)),
    y: Math.max(20, Math.min(canvasH - 20, pt.y + Math.sin(angle) * dist))
  };
}

// -------- ACTIVE ACTIONS IN GAME --------
function onCanvasClick(e, board, canvas) {
  if (G.gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  
  // Power tool: pineapple bomb
  if (G.armedPower === 'pineapple') {
    board.spikes.push({
      x: mx,
      y: my,
      damage: 15,
      pierce: 50,
      radius: 90,
      life: 1.0,
      lead: true,
      moabDamage: 3,
      isExplosive: true
    });
    spawnParticles(mx, my, '#ff8800', 25, board);
    G.armedPower = null;
    updatePowersBar();
    return;
  }
  
  // Placing tower?
  if (G.placingTower) {
    const cost = priceOf(G.placingTower.def.cost);
    if (board.cash >= cost) {
      board.cash -= cost;
      const nt = createTower(G.placingTower.def, mx, my, 0);
      board.towers.push(nt);
      
      // Dispatch action online
      if (wsRoomId && ws && ws.readyState === WebSocket.OPEN) {
        sendGameAction({
          type: 'place-tower',
          towerId: G.placingTower.def.id,
          x: mx / canvasW,
          y: my / canvasH
        });
      }
      
      G.placingTower = null;
      updateHUD();
    }
    return;
  }
  
  // Select placed tower?
  const clicked = board.towers.find(t => Math.hypot(t.x - mx, t.y - my) <= 22);
  if (clicked) {
    G.selectedTower = clicked;
    showUpgradePanel(clicked);
  } else {
    deselectTower();
  }
}

function onCanvasMouseMove(e, board, canvas) {
  const rect = canvas.getBoundingClientRect();
  G.mouseX = e.clientX - rect.left;
  G.mouseY = e.clientY - rect.top;
}

// Draw range, pineapple boundaries, or placement preview
function drawPlacementPreview(ctx) {
  const def = G.placingTower.def;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(G.mouseX, G.mouseY, def.range, 0, 7);
  ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.globalAlpha = 0.8;
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(def.icon, G.mouseX, G.mouseY);
  ctx.restore();
}

function drawHeroPreview(ctx) {
  const h = G.myBoard.hero;
  if (!h) return;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(G.mouseX, G.mouseY, h.range, 0, 7);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.globalAlpha = 0.8;
  ctx.font = '28px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(h.def.icon, G.mouseX, G.mouseY);
  ctx.restore();
}

// -------- TOWERS, PROJECTILES & WEAPON PHYSICS --------
function createTower(def, x, y, ownerIndex) {
  return {
    id: uid(),
    defId: def.id,
    def,
    x,
    y,
    ownerIndex,
    upgradeLevels: [0, 0, 0],
    totalCost: priceOf(def.cost),
    range: def.range,
    fireRate: def.fireRate,
    damage: def.damage || 1,
    pierce: def.pierce || 1,
    projectileSpeed: def.projectileSpeed || 320,
    projectileRadius: def.projectileRadius || 5,
    angle: 0,
    fireTimer: 0,
    target: 'first',
    buffRangeMul: 1,
    buffFireRateMul: 1,
    buffDamage: 0
  };
}

function fireTower(t, target, board) {
  const dx = target.x - t.x;
  const dy = target.y - t.y;
  t.angle = Math.atan2(dy, dx);
  
  // Custom projectiles depending on tower id
  const pCount = t.numProjectiles || 1;
  const baseAngle = t.angle;
  
  for (let i = 0; i < pCount; i++) {
    const spread = (i - (pCount - 1) / 2) * 0.15;
    const sa = baseAngle + spread;
    
    board.projectiles.push({
      x: t.x,
      y: t.y,
      vx: Math.cos(sa) * t.projectileSpeed,
      vy: Math.sin(sa) * t.projectileSpeed,
      radius: t.projectileRadius,
      damage: effDamage(t),
      pierce: t.pierce,
      life: 2.2,
      hit: new Set(),
      isFreeze: t.defId === 'ice',
      isExplosive: t.defId === 'bomb' || t.isExplosive,
      explodeRadius: t.explodeRadius || 34,
      camo: t.camo || t.buffCamo,
      lead: t.lead || t.buffLead || t.isExplosive
    });
  }
}

function fireHero(h, target, board) {
  const dx = target.x - h.x;
  const dy = target.y - h.y;
  const angle = Math.atan2(dy, dx);
  
  board.projectiles.push({
    x: h.x,
    y: h.y,
    vx: Math.cos(angle) * h.projectileSpeed,
    vy: Math.sin(angle) * h.projectileSpeed,
    radius: h.projectileRadius,
    damage: h.damage + Math.floor(h.level * 0.4),
    pierce: h.pierce + Math.floor(h.level * 0.3),
    life: 2.2,
    hit: new Set(),
    isExplosive: h.isExplosive,
    explodeRadius: h.explodeRadius,
    camo: h.camo,
    lead: h.lead
  });
}

function updateProjectilesOnBoard(board, dt) {
  const toRemove = [];
  for (const p of board.projectiles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    
    if (p.x < -40 || p.x > canvasW + 40 || p.y < -40 || p.y > canvasH + 40 || p.life <= 0) {
      toRemove.push(p);
      continue;
    }
    
    for (const e of [...board.enemies]) {
      if (p.hit.has(e.id)) continue;
      if (e.camo && !p.camo) continue;
      if (e.def.isLead && !p.lead) continue;
      
      if (Math.hypot(e.x - p.x, e.y - p.y) < p.radius + e.radius) {
        p.hit.add(e.id);
        
        let dmg = p.damage;
        if (e.def.isMoab && p.moabDamage > 1) dmg *= p.moabDamage;
        
        if (p.isFreeze) {
          e.frozen = 1.2;
          spawnParticles(p.x, p.y, '#9be2ff', 4, board);
        }
        
        if (p.isExplosive) {
          // Explode!
          spawnParticles(p.x, p.y, '#ff6600', 12, board);
          for (const e2 of [...board.enemies]) {
            if (Math.hypot(e2.x - p.x, e2.y - p.y) < p.explodeRadius) {
              e2.hp -= dmg;
              if (e2.hp <= 0) {
                killEnemyOnBoard(e2, board);
              }
            }
          }
          toRemove.push(p);
          break;
        }
        
        e.hp -= dmg;
        board.totalPops++;
        if (!board.isOpponent) userProfile.popped++;
        
        if (e.hp <= 0) {
          killEnemyOnBoard(e, board);
        }
        
        p.pierce--;
        if (p.pierce <= 0) {
          toRemove.push(p);
          break;
        }
      }
    }
  }
  board.projectiles = board.projectiles.filter(p => !toRemove.includes(p));
}

// -------- BLOONS & ENEMY SPAWN MECHANICS --------
function spawnEnemyOnBoard(defKey, board) {
  const d = typeof defKey === 'string' ? ENEMY_TYPES[defKey] : ENEMY_TYPES[defKey.type];
  if (!d) return;
  
  const id = enemyIdCounter++;
  const extraProps = typeof defKey === 'object' ? defKey : {};
  
  board.enemies.push({
    id,
    def: d,
    maxHp: d.hp,
    hp: d.hp,
    speed: d.speed,
    radius: d.radius,
    camo: d.camo || extraProps.camo || false,
    fortified: d.fortified || extraProps.fortified || false,
    regrow: d.regrow || extraProps.regrow || false,
    t: 0,
    x: board.pathPoints[0].x,
    y: board.pathPoints[0].y,
    frozen: 0,
    stunned: 0,
    slowed: 0,
    slowFactor: 1
  });
}

function killEnemyOnBoard(e, board) {
  board.enemies = board.enemies.filter(x => x !== e);
  board.cash += e.def.cash;
  
  // Particles based on balloon color
  spawnParticles(e.x, e.y, e.def.color, 4, board);
  
  // Spawn children layer if exists
  if (e.def.spawnOn) {
    const count = e.def.numSpawn || 1;
    for (let i = 0; i < count; i++) {
      const childOffset = -0.015 * i;
      const id = enemyIdCounter++;
      const childDef = ENEMY_TYPES[e.def.spawnOn];
      board.enemies.push({
        id,
        def: childDef,
        maxHp: childDef.hp,
        hp: childDef.hp,
        speed: childDef.speed,
        radius: childDef.radius,
        camo: e.camo,
        fortified: e.fortified,
        regrow: e.regrow,
        t: Math.max(0, e.t + childOffset),
        x: e.x,
        y: e.y,
        frozen: 0,
        stunned: 0,
        slowed: 0,
        slowFactor: 1
      });
    }
  }
}

function sendBloonsToBoard(type, board) {
  // Spawn the custom sent eco bloons
  const count = SENDABLE_BLOONS.find(s => s.type === type)?.count || 1;
  for (let i = 0; i < count; i++) {
    board.spawnQueue.push(type);
  }
  board.waveActive = true;
}

// Dispatch game actions across WebSocket
function sendGameAction(action) {
  if (ws && ws.readyState === WebSocket.OPEN && wsRoomId) {
    ws.send(JSON.stringify({
      type: 'game-action',
      action
    }));
  }
}

function applyOpponentAction(action) {
  if (!G || !G.opBoard) return;
  const board = G.opBoard;
  
  switch (action.type) {
    case 'place-tower': {
      const def = TOWER_DEFS.find(d => d.id === action.towerId);
      if (def) {
        board.towers.push(createTower(def, action.x * canvasW, action.y * canvasH, 1));
      }
      break;
    }
    case 'sell-tower': {
      board.towers = board.towers.filter((_, idx) => idx !== action.towerIndex);
      break;
    }
    case 'upgrade-tower': {
      const t = board.towers[action.towerIndex];
      if (t) {
        t.upgradeLevels[action.pathIndex] = action.levelIndex + 1;
        recomputeTowerStats(t);
      }
      break;
    }
    case 'send-bloon': {
      // Opponent sent a bloon to YOUR side!
      sendBloonsToBoard(action.bloonType, G.myBoard);
      break;
    }
    case 'sync-stats': {
      board.lives = action.lives;
      board.cash = action.cash;
      board.eco = action.eco;
      break;
    }
  }
}

// -------- RENDERING AND GRAPHICS --------
function renderGame() {
  if (!G) return;
  
  if (G.isPvP && G.opBoard) {
    // Render My Board
    const myCtx = document.getElementById('my-pvp-canvas').getContext('2d');
    drawBoardArena(myCtx, G.myBoard, false);
    
    // Render Opponent's Board
    const opCtx = document.getElementById('op-pvp-canvas').getContext('2d');
    drawBoardArena(opCtx, G.opBoard, true);
  } else {
    // Singleplayer classic
    const ctx = document.getElementById('game-canvas').getContext('2d');
    drawBoardArena(ctx, G.myBoard, false);
  }
}

function drawBoardArena(ctx, board, isOp) {
  ctx.clearRect(0, 0, canvasW, canvasH);
  
  // Draw Background Map Gradient
  ctx.fillStyle = board.mapDef.bg;
  ctx.fillRect(0, 0, canvasW, canvasH);
  
  // Subtle decorative grid or lines
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let x = 0; x < canvasW; x += 40) {
    for (let y = 0; y < canvasH; y += 40) {
      ctx.fillRect(x + ((y / 40) % 2) * 20, y, 2, 2);
    }
  }
  
  // Draw Track Path
  drawTrackPathOnContext(ctx, board);
  
  // Draw placed towers
  for (const t of board.towers) {
    drawTowerOnContext(ctx, t, board);
  }
  
  // Draw hero
  if (board.hero) {
    drawHeroOnContext(ctx, board.hero);
  }
  
  // Draw projectiles
  for (const p of board.projectiles) {
    drawProjectileOnContext(ctx, p);
  }
  
  // Draw enemies
  for (const e of board.enemies) {
    drawEnemyOnContext(ctx, e);
  }
  
  // Draw particles
  for (const p of board.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 0.7);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 7);
    ctx.fill();
    ctx.restore();
  }
  
  // Draw Spikes
  for (const s of board.spikes) {
    ctx.save();
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(s.x, s.y, 4, 0, 7);
    ctx.fill();
    ctx.restore();
  }
  
  // Active selected tower range
  if (!isOp && G.selectedTower) {
    const t = G.selectedTower;
    ctx.save();
    ctx.beginPath();
    ctx.arc(t.x, t.y, effRange(t), 0, 7);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  
  // Placement guides
  if (!isOp) {
    if (G.placingTower && G.mouseX !== undefined) drawPlacementPreview(ctx);
    if (G.armedPower === 'pineapple' && G.mouseX !== undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(G.mouseX, G.mouseY, 90, 0, 7);
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawTrackPathOnContext(ctx, board) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  
  // Outer border path
  ctx.strokeStyle = board.mapDef.borderColor;
  ctx.lineWidth = 50;
  strokePathPoints(ctx, board.pathPoints);
  
  // Main inner road
  ctx.shadowBlur = 0;
  ctx.strokeStyle = board.mapDef.trackColor;
  ctx.lineWidth = 42;
  strokePathPoints(ctx, board.pathPoints);
  
  // Dashed center guiding line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 16]);
  ctx.lineDashOffset = -(G.time * 30) % 24;
  strokePathPoints(ctx, board.pathPoints);
  
  ctx.restore();
}

function strokePathPoints(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
}

function drawTowerOnContext(ctx, t, board) {
  const isSelected = G.selectedTower === t;
  ctx.save();
  ctx.translate(t.x, t.y);
  
  // Barrel rotation toward targets
  if (!t.def.multiTarget && !t.def.isFarm && !t.def.isVillage) {
    ctx.save();
    ctx.rotate(t.angle || 0);
    ctx.fillStyle = t.def.color;
    ctx.fillRect(0, -3, 22, 6);
    ctx.restore();
  }
  
  // Tower base circular glow
  const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 18);
  grad.addColorStop(0, lighten(t.def.color, 40));
  grad.addColorStop(1, t.def.color);
  
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, 7);
  ctx.fillStyle = grad;
  ctx.fill();
  
  ctx.lineWidth = isSelected ? 3 : 1.5;
  ctx.strokeStyle = isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.3)';
  ctx.stroke();
  
  // Render central Tower Icon
  ctx.font = '15px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t.def.icon, 0, 1);
  
  // Draw upgrade indicators
  for (let i = 0; i < 3; i++) {
    const lvl = t.upgradeLevels[i];
    if (lvl > 0) {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 20, Math.sin(angle) * 20, 4, 0, 7);
      ctx.fillStyle = ['#00d4ff', '#ff6b00', '#00ff88'][i];
      ctx.fill();
    }
  }
  
  ctx.restore();
}

function drawHeroOnContext(ctx, h) {
  ctx.save();
  ctx.translate(h.x, h.y);
  
  ctx.beginPath();
  ctx.arc(0, 0, 19, 0, 7);
  const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 20);
  grad.addColorStop(0, '#fff6cc');
  grad.addColorStop(1, h.def.color);
  ctx.fillStyle = grad;
  ctx.fill();
  
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#ffd700';
  ctx.stroke();
  
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(h.def.icon, 0, 1);
  ctx.restore();
}

function drawProjectileOnContext(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, 7);
  ctx.fillStyle = p.isFreeze ? '#bfe6ff' : p.isExplosive ? '#e65c00' : '#d2d5db';
  ctx.fill();
  ctx.restore();
}

function drawEnemyOnContext(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  
  // Shadow
  ctx.beginPath();
  ctx.ellipse(2, 4, e.radius, e.radius * 0.4, 0, 0, 7);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();
  
  const baseColor = e.frozen > 0 ? '#bfe6ff' : e.def.color;
  const grad = ctx.createRadialGradient(-e.radius * 0.35, -e.radius * 0.35, e.radius * 0.1, 0, 0, e.radius);
  grad.addColorStop(0, lighten(baseColor, 50));
  grad.addColorStop(1, baseColor);
  
  ctx.beginPath();
  ctx.arc(0, 0, e.radius, 0, 7);
  ctx.fillStyle = grad;
  ctx.fill();
  
  // Knot
  ctx.beginPath();
  ctx.moveTo(-2, e.radius - 1);
  ctx.lineTo(2, e.radius - 1);
  ctx.lineTo(0, e.radius + 3);
  ctx.closePath();
  ctx.fillStyle = baseColor;
  ctx.fill();
  
  // MOAB / Blimp labeling and metallic strips
  if (e.def.isMoab) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `bold ${Math.min(13, e.radius * 0.45)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(e.def.name, 0, 0);
  }
  
  // HP indicator
  if (e.hp < e.maxHp) {
    const bw = e.radius * 2.5;
    ctx.fillStyle = '#111';
    ctx.fillRect(-bw / 2, -e.radius - 6, bw, 3);
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(-bw / 2, -e.radius - 6, bw * (e.hp / e.maxHp), 3);
  }
  
  ctx.restore();
}

function spawnParticles(x, y, color, count, board) {
  const density = settings.particles === 'high' ? count * 1.5 : settings.particles === 'low' ? count * 0.5 : count;
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const force = 30 + Math.random() * 100;
    board.particles.push({
      x,
      y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      life: 0.4 + Math.random() * 0.3,
      maxLife: 0.7,
      color,
      size: 1.5 + Math.random() * 2
    });
  }
}

// -------- BTD BATTLES ECO SENDS MECHANICS --------
function purchaseBloonSend(type) {
  if (!G || G.gameOver) return;
  const item = SENDABLE_BLOONS.find(s => s.type === type);
  if (!item) return;
  
  if (G.myBoard.cash >= item.cost) {
    G.myBoard.cash -= item.cost;
    G.myBoard.eco += item.eco;
    updateHUD();
    
    // Spawn directly on opponent's spawn queue (or AI's track if offline)
    if (G.isPvP && G.opBoard) {
      if (wsRoomId && ws && ws.readyState === WebSocket.OPEN) {
        sendGameAction({
          type: 'send-bloon',
          bloonType: type
        });
      } else {
        // AI fallback
        sendBloonsToBoard(type, G.opBoard);
      }
    }
  }
}

// -------- SHOP AND TOWER BUYING IN SIDEBAR --------
function buildShop() {
  const pc = document.getElementById('panel-content');
  pc.innerHTML = '';
  
  const shopWrap = document.createElement('div');
  shopWrap.id = 'shop-panel-content';
  
  TOWER_DEFS.forEach(def => {
    // If in PvP mode, only allow towers chosen in loadout!
    if (G.isPvP && !selectedLoadout.towers.includes(def.id)) return;
    
    const card = document.createElement('div');
    card.className = 'tower-card';
    card.id = `shop-card-${def.id}`;
    card.innerHTML = `
      <div class="tower-card-header">
        <span class="tower-name">${def.icon} ${def.name}</span>
        <span class="tower-cost">$${def.cost}</span>
      </div>
      <div class="tower-desc">${def.desc}</div>
    `;
    card.onclick = () => {
      if (G.myBoard.cash >= priceOf(def.cost)) {
        placeTower(def);
        document.querySelectorAll('.tower-card').forEach(x => x.classList.remove('selected'));
        card.classList.add('selected');
      }
    };
    shopWrap.appendChild(card);
  });
  
  pc.appendChild(shopWrap);
}

function buildSendsPanel() {
  const pc = document.getElementById('panel-content');
  pc.innerHTML = '';
  
  const sendsWrap = document.createElement('div');
  sendsWrap.id = 'sends-panel-content';
  
  SENDABLE_BLOONS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'tower-card';
    card.id = `send-card-${item.type}`;
    card.innerHTML = `
      <div class="tower-card-header">
        <span class="tower-name">${item.icon} Send ${item.type.toUpperCase()}</span>
        <span class="tower-cost" style="color:var(--gold); font-size:0.7rem;">Cost: $${item.cost}</span>
      </div>
      <div class="tower-desc" style="display:flex; justify-content:space-between; align-items:center;">
        <span>${item.desc}</span>
        <span style="color: var(--accent3); font-weight:bold; font-family:'Orbitron'; font-size:0.7rem;">Eco +${item.eco}</span>
      </div>
    `;
    card.onclick = () => {
      purchaseBloonSend(item.type);
    };
    sendsWrap.appendChild(card);
  });
  
  pc.appendChild(sendsWrap);
}

// -------- HUD UPDATE UTILITIES --------
function updateHUD() {
  if (!G) return;
  
  if (G.isPvP && G.opBoard) {
    document.getElementById('my-pvp-lives').textContent = G.myBoard.lives;
    document.getElementById('my-pvp-cash').textContent = G.myBoard.cash;
    document.getElementById('my-pvp-eco').textContent = G.myBoard.eco;
    
    document.getElementById('op-pvp-lives').textContent = G.opBoard.lives;
    document.getElementById('op-pvp-cash').textContent = G.opBoard.cash;
    document.getElementById('op-pvp-eco').textContent = G.opBoard.eco;
    
    document.getElementById('hud-round').textContent = G.myBoard.round;
  } else {
    document.getElementById('hud-round').textContent = G.myBoard.round;
    document.getElementById('hud-cash').textContent = '$' + G.myBoard.cash;
    document.getElementById('hud-lives').textContent = G.myBoard.lives;
    document.getElementById('hud-eco').textContent = '$' + G.myBoard.eco;
  }
  
  // Update disabled/enabled cards based on budget
  updateShopAffordability();
}

function updateShopAffordability() {
  const cash = G?.myBoard?.cash || 0;
  TOWER_DEFS.forEach(def => {
    const card = document.getElementById(`shop-card-${def.id}`);
    if (card) {
      if (cash < priceOf(def.cost)) {
        card.classList.add('cant-afford');
      } else {
        card.classList.remove('cant-afford');
      }
    }
  });
  
  SENDABLE_BLOONS.forEach(item => {
    const card = document.getElementById(`send-card-${item.type}`);
    if (card) {
      if (cash < item.cost) {
        card.classList.add('cant-afford');
      } else {
        card.classList.remove('cant-afford');
      }
    }
  });
}

function showShopPanel() {
  document.getElementById('tab-shop').classList.add('active');
  document.getElementById('tab-sends').classList.remove('active');
  document.getElementById('upgrade-panel').classList.remove('visible');
  buildShop();
  updateShopAffordability();
}

function showSendsPanel() {
  document.getElementById('tab-shop').classList.remove('active');
  document.getElementById('tab-sends').classList.add('active');
  document.getElementById('upgrade-panel').classList.remove('visible');
  buildSendsPanel();
  updateShopAffordability();
}

function showUpgradePanel(tower) {
  document.getElementById('upgrade-panel').classList.add('visible');
  renderUpgradeStats(tower);
}

function renderUpgradeStats(t) {
  document.getElementById('upg-name').textContent = t.def.name;
  document.getElementById('upg-stats').innerHTML = `
    DMG: ${effDamage(t)} · RANGE: ${Math.round(effRange(t))}<br>
    PIERCE: ${t.pierce} · COST: $${t.totalCost}
  `;
  
  // Render Target prioritizer buttons
  const tb = document.getElementById('target-buttons');
  tb.innerHTML = '';
  ['first', 'last', 'close', 'strong'].forEach(mode => {
    const btn = document.createElement('button');
    btn.className = 'target-btn' + (t.target === mode ? ' active' : '');
    btn.textContent = mode.toUpperCase();
    btn.onclick = () => {
      t.target = mode;
      renderUpgradeStats(t);
    };
    tb.appendChild(btn);
  });
  
  const upgPaths = document.getElementById('upg-paths');
  upgPaths.innerHTML = '';
  
  for (let pi = 0; pi < t.def.upgrades.length; pi++) {
    const path = t.def.upgrades[pi];
    const curLvl = t.upgradeLevels[pi];
    const div = document.createElement('div');
    div.className = 'upgrade-path';
    
    // Render level dots
    let pips = '';
    for (let i = 0; i < 5; i++) {
      pips += `<span class="tier-pip ${i < curLvl ? 'on' : ''}"></span>`;
    }
    
    div.innerHTML = `
      <div class="upgrade-path-label">${path.name} <span class="tier-pips">${pips}</span></div>
    `;
    
    if (curLvl >= 5) {
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn maxed';
      btn.textContent = "✓ MAX TIED";
      div.appendChild(btn);
    } else {
      const upg = path.levels[curLvl];
      const cost = priceOf(upg.cost);
      const allowed = canUpgrade(t, pi);
      
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn' + (!allowed ? ' locked' : '');
      btn.innerHTML = `
        <span>${upg.name}<br><small style="color:var(--text-dim);">${upg.desc}</small></span>
        <span class="upgrade-btn-cost">$${cost}</span>
      `;
      btn.disabled = G.myBoard.cash < cost || !allowed;
      btn.onclick = () => buyUpgrade(t, pi, curLvl);
      div.appendChild(btn);
    }
    
    upgPaths.appendChild(div);
  }
  
  document.getElementById('sell-btn').textContent = `SELL ($${Math.round(t.totalCost * 0.7)})`;
}

function buyUpgrade(t, pi, curLvl) {
  const upg = t.def.upgrades[pi].levels[curLvl];
  const cost = priceOf(upg.cost);
  
  if (G.myBoard.cash >= cost && canUpgrade(t, pi)) {
    G.myBoard.cash -= cost;
    t.upgradeLevels[pi]++;
    t.totalCost += cost;
    recomputeTowerStats(t);
    
    // Sync Upgrade Action Online
    if (wsRoomId && ws && ws.readyState === WebSocket.OPEN) {
      const idx = G.myBoard.towers.indexOf(t);
      sendGameAction({
        type: 'upgrade-tower',
        towerIndex: idx,
        pathIndex: pi,
        levelIndex: curLvl
      });
    }
    
    renderUpgradeStats(t);
    updateHUD();
  }
}

function sellSelectedTower() {
  if (!G || !G.selectedTower) return;
  const t = G.selectedTower;
  const sellAmt = Math.round(t.totalCost * 0.7);
  G.myBoard.cash += sellAmt;
  
  // Remove from arrays
  const idx = G.myBoard.towers.indexOf(t);
  G.myBoard.towers = G.myBoard.towers.filter(x => x !== t);
  
  // Sync online
  if (wsRoomId && ws && ws.readyState === WebSocket.OPEN) {
    sendGameAction({
      type: 'sell-tower',
      towerIndex: idx
    });
  }
  
  deselectTower();
  updateHUD();
}

// -------- STATE VALIDATION / ANTI-CHEAT PROTECTION --------
let lastValidationCash = 650;
let lastValidationEco = 250;
function validateGameStateAndPreventCheat(board) {
  // Check for impossible cash jumps (e.g. standard maximum income gain possible is ~1000 cash in 1 second)
  if (board.cash - lastValidationCash > 8000) {
    console.warn("Flagged impossible cash injection! Resetting budget to synced values.");
    board.cash = lastValidationCash + 500;
  }
  
  // Check for impossible eco jumps
  if (board.eco - lastValidationEco > 500) {
    console.warn("Flagged illegal eco manipulation! Resetting eco value.");
    board.eco = lastValidationEco + 50;
  }
  
  // Re-verify crosspathing rules for all towers
  for (const t of board.towers) {
    let activePathsCount = 0;
    let pathsAboveTwo = 0;
    t.upgradeLevels.forEach(lvl => {
      if (lvl > 0) activePathsCount++;
      if (lvl > 2) pathsAboveTwo++;
    });
    
    if (pathsAboveTwo > 1) {
      console.warn("Illegal crosspath detected! Correcting tower upgrades.");
      t.upgradeLevels = [0, 0, 0];
      recomputeTowerStats(t);
    }
  }
  
  lastValidationCash = board.cash;
  lastValidationEco = board.eco;
  
  // Periodically emit sync checksums online to verify consistency with opponent
  if (G.time % 3.0 < 0.05 && wsRoomId) {
    sendGameAction({
      type: 'sync-stats',
      lives: board.lives,
      cash: board.cash,
      eco: board.eco
    });
  }
}

// -------- END AND VICTORY OVERLAYS --------
function endMatchGame(isOpponentLoss) {
  if (G.gameOver) return;
  G.gameOver = true;
  
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  
  const title = document.getElementById('gameover-title');
  const info = document.getElementById('gameover-info');
  
  if (isOpponentLoss) {
    // YOU WIN!
    title.className = 'victory-title';
    title.textContent = 'VICTORY!';
    info.innerHTML = `
      <span style="color:#00ff88; font-weight:bold;">+$25 Trophies awarded!</span><br>
      Pops Popped: ${G.myBoard.totalPops} · Survived to Round ${G.myBoard.round}
    `;
    userProfile.wins++;
    userProfile.trophies += 25;
  } else {
    // YOU LOSE
    title.className = 'gameover-title';
    title.textContent = 'DEFEAT!';
    info.innerHTML = `
      <span style="color:#ff2244; font-weight:bold;">-10 Trophies lost</span><br>
      Pops Popped: ${G.myBoard.totalPops} · Defeated on Round ${G.myBoard.round}
    `;
    userProfile.losses++;
    userProfile.trophies = Math.max(0, userProfile.trophies - 10);
  }
  
  saveProfile();
  document.getElementById('gameover-overlay').classList.add('show');
}

function triggerVictoryOverlay(text) {
  const title = document.getElementById('gameover-title');
  const info = document.getElementById('gameover-info');
  title.className = 'victory-title';
  title.textContent = 'VICTORY!';
  info.innerHTML = `
    <span style="color:#00ff88; font-weight:bold;">${text}</span><br>
    Trophies: +25 earned!
  `;
  document.getElementById('gameover-overlay').classList.add('show');
}

// -------- POPUP MODAL ACTIONS --------
function openProfileModal() {
  document.getElementById('profile-name').textContent = userProfile.name;
  document.getElementById('stat-trophies').textContent = userProfile.trophies;
  
  const played = userProfile.wins + userProfile.losses;
  const winrate = played > 0 ? Math.round((userProfile.wins / played) * 100) : 0;
  
  document.getElementById('stat-played').textContent = played;
  document.getElementById('stat-wins').textContent = userProfile.wins;
  document.getElementById('stat-losses').textContent = userProfile.losses;
  document.getElementById('stat-winrate').textContent = winrate + '%';
  document.getElementById('stat-popped').textContent = userProfile.popped.toLocaleString();
  document.getElementById('stat-eco-sent').textContent = userProfile.ecoSent.toLocaleString();
  
  document.getElementById('profile-modal').style.display = 'flex';
}

function closeProfileModal() {
  document.getElementById('profile-modal').style.display = 'none';
}

function saveProfileName() {
  const newName = document.getElementById('profile-name-input').value.trim();
  if (newName) {
    userProfile.name = newName;
    saveProfile();
    updateProfileUI();
    closeProfileModal();
    
    // Register rename
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'register',
        name: userProfile.name,
        profile: {
          wins: userProfile.wins,
          losses: userProfile.losses,
          trophies: userProfile.trophies
        }
      }));
    }
  }
}

function openLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'flex';
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'get-leaderboard' }));
  } else {
    // offline mock leaderboard
    const mock = [
      { name: userProfile.name, trophies: userProfile.trophies, wins: userProfile.wins, losses: userProfile.losses },
      { name: 'SlayerMonkey 🐒', trophies: 550, wins: 28, losses: 5 },
      { name: 'CyberDart ⚡', trophies: 480, wins: 22, losses: 8 },
      { name: 'SuperPop 🎈', trophies: 310, wins: 15, losses: 10 }
    ];
    renderLeaderboardTable(mock);
  }
}

function renderLeaderboardTable(list) {
  const tbody = document.getElementById('leaderboard-list');
  tbody.innerHTML = '';
  
  list.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border)';
    tr.innerHTML = `
      <td style="padding: 10px; font-weight:bold; color: ${index === 0 ? 'var(--gold)' : '#aaa'};">${index + 1}</td>
      <td style="padding: 10px; font-weight:bold; color: ${item.name === userProfile.name ? 'var(--accent)' : 'var(--text)'};">${item.name}</td>
      <td style="padding: 10px; text-align: center; color: var(--text-dim);">${item.wins}W / ${item.losses}L</td>
      <td style="padding: 10px; text-align: right; font-weight:bold; color: var(--gold);">🏆 ${item.trophies}</td>
    `;
    tbody.appendChild(tr);
  });
}

function closeLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'none';
}

function openSettingsModal() {
  document.getElementById('settings-sfx').checked = settings.sfx;
  document.getElementById('settings-ambient').checked = settings.ambient;
  document.getElementById('settings-anticheat').checked = settings.anticheat;
  document.getElementById('settings-particles').value = settings.particles;
  
  document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettingsModal() {
  document.getElementById('settings-modal').style.display = 'none';
}

function saveSettings() {
  settings.sfx = document.getElementById('settings-sfx').checked;
  settings.ambient = document.getElementById('settings-ambient').checked;
  settings.anticheat = document.getElementById('settings-anticheat').checked;
  settings.particles = document.getElementById('settings-particles').value;
  
  localStorage.setItem('btd_battles_settings', JSON.stringify(settings));
  closeSettingsModal();
}

// -------- MULTIPLAYER LOBBY SCREENS & CHAT --------
function showLobbySelect() {
  showScreen('lobby-select-screen');
  document.getElementById('private-lobby-area').style.display = 'none';
  document.getElementById('join-lobby-panel').style.display = 'none';
}

function createPrivateLobby() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'create-lobby' }));
  }
}

function showJoinLobbyInput() {
  document.getElementById('join-lobby-panel').style.display = 'block';
  document.getElementById('private-lobby-area').style.display = 'none';
}

function joinPrivateLobby() {
  const code = document.getElementById('lobby-code-input').value.trim();
  if (code && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'join-lobby', code }));
  }
}

function leavePrivateLobby() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'quit-room' }));
  }
  showLobbySelect();
}

function updateLobbyPlayerList(p1, p2) {
  const list = document.getElementById('lobby-player-list');
  list.innerHTML = `
    <div class="player-item"><div class="player-dot"></div>${p1.name} (🏆${p1.trophies}) [HOST]</div>
  `;
  if (p2) {
    list.innerHTML += `
      <div class="player-item"><div class="player-dot" style="background:var(--accent);"></div>${p2.name} (🏆${p2.trophies})</div>
    `;
  } else {
    list.innerHTML += `
      <div class="player-item" style="opacity: 0.5;"><div class="player-dot" style="background:#ff2244;"></div>Waiting for Opponent...</div>
    `;
  }
}

function sendLobbyChatMessage() {
  const inp = document.getElementById('lobby-chat-input');
  const txt = inp.value.trim();
  if (txt && wsRoomId) {
    sendGameAction({
      type: 'lobby-chat',
      text: txt,
      sender: userProfile.name
    });
    
    // Add locally
    addLobbyChatMessage(userProfile.name, txt);
    inp.value = '';
  }
}

function addLobbyChatMessage(sender, text) {
  const chat = document.getElementById('lobby-chat-box');
  const msg = document.createElement('div');
  msg.style.marginBottom = '4px';
  msg.innerHTML = `<span style="color:${sender === userProfile.name ? 'var(--accent)' : 'var(--accent2)'}; font-weight:bold;">${sender}:</span> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function hostStartPrivateSetup() {
  if (ws && ws.readyState === WebSocket.OPEN && wsRoomId) {
    ws.send(JSON.stringify({ type: 'start-private-game' }));
  }
}

// -------- QUEUE MATCHMAKING COMMANDS --------
function startMatchmakingQueue() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'join-queue' }));
  }
}

function cancelMatchmaking() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'leave-queue' }));
  }
}

// Trigger practice mode (AI splitscreen PvP)
function startPracticeAI() {
  selectedLoadout = {
    hero: 'quincy',
    towers: ['dart', 'boomerang', 'engineer']
  };
  opponentLoadout = {
    hero: 'gwen',
    towers: ['bomb', 'ice', 'dartling']
  };
  
  // Directly start splitscreen PvP offline
  startGame(true, 'zen');
}

function startPracticeAIFromQueue() {
  isSearching = false;
  startPracticeAI();
}

// -------- COMMON COMPAT UTILS --------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function updateHeroBar() {
  const h = G?.myBoard?.hero;
  if (!h) return;
  document.getElementById('hero-lvl-txt').textContent = `Lvl ${h.level}`;
  document.getElementById('hero-xp-fill').style.width = `${Math.min(100, (h.xp / h.xpNext) * 100)}%`;
  
  const ab = document.getElementById('hero-ability-btn');
  if (h.abilityCd > 0) {
    document.getElementById('hero-ability-cd').style.height = `${(h.abilityCd / h.def.ability.cooldown) * 100}%`;
    ab.classList.remove('ready');
  } else {
    document.getElementById('hero-ability-cd').style.height = `0%`;
    ab.classList.add('ready');
  }
}

function setupPowers() {
  const pb = document.getElementById('powers-bar');
  pb.innerHTML = '';
  
  Object.values(POWERS).forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'power-btn';
    btn.innerHTML = `${p.icon} <span class="power-count">${p.uses}</span>`;
    btn.onclick = () => {
      if (p.uses > 0) {
        if (p.id === 'boost') {
          p.uses--;
          G.myBoard.boostTimer = p.duration;
          setupPowers();
          createFloatingText(G.myBoard.hero.x, G.myBoard.hero.y, "MONKEY BOOST ACTIVATED!", '#ff9900');
        } else if (p.id === 'cash') {
          p.uses--;
          G.myBoard.cash += 500;
          updateHUD();
          setupPowers();
          createFloatingText(G.myBoard.hero.x, G.myBoard.hero.y, "+$500 Cash", '#00ff88');
        } else if (p.id === 'glue') {
          p.uses--;
          G.myBoard.enemies.forEach(e => {
            e.slowed = p.duration;
            e.slowFactor = 0.5;
          });
          setupPowers();
          createFloatingText(G.myBoard.hero.x, G.myBoard.hero.y, "GLUE TRAP ARMED!", '#00ff88');
        } else if (p.id === 'pineapple') {
          G.armedPower = 'pineapple';
          btn.classList.add('armed');
        }
      }
    };
    pb.appendChild(btn);
  });
}

function createFloatingText(x, y, text, color) {
  const container = document.getElementById('canvas-wrap');
  const d = document.createElement('div');
  d.className = 'float-text';
  d.style.left = `${x}px`;
  d.style.top = `${y}px`;
  d.style.color = color || 'white';
  d.textContent = text;
  container.appendChild(d);
  setTimeout(() => d.remove(), 900);
}

// Recompute stats on upgrades
function recomputeTowerStats(t) {
  const def = t.def;
  let rangeMul = 1, fireRateMul = 1, explMul = 1;
  
  t.damage = def.damage || 1;
  t.pierce = def.pierce || 1;
  t.projectileSpeed = def.projectileSpeed || 320;
  t.projectileRadius = def.projectileRadius || 5;
  t.numProjectiles = def.numProjectiles || 1;
  
  for (let pi = 0; pi < 3; pi++) {
    const lvl = t.upgradeLevels[pi];
    for (let l = 0; l < lvl; l++) {
      const e = def.upgrades[pi].levels[l].effect;
      if (!e) continue;
      if (e.rangeMul !== undefined) rangeMul *= e.rangeMul;
      if (e.fireRateMul !== undefined) fireRateMul *= e.fireRateMul;
      if (e.damage !== undefined) t.damage += e.damage;
      if (e.pierce !== undefined) t.pierce += e.pierce;
      if (e.multishot !== undefined) t.numProjectiles = e.multishot;
      if (e.camo !== undefined) t.camo = e.camo;
      if (e.lead !== undefined) t.lead = e.lead;
      if (e.isExplosive !== undefined) t.isExplosive = e.isExplosive;
      if (e.explodeRadius !== undefined) t.explodeRadius = e.explodeRadius;
    }
  }
  
  t.range = def.range * rangeMul;
  t.fireRate = def.fireRate * fireRateMul;
}

// Crosspath constraints: only 1 path can exceed level 2, others can sum <= 2
function canUpgrade(tower, pathIndex) {
  const lv = tower.upgradeLevels;
  const target = lv[pathIndex] + 1;
  if (target > 5) return false;
  if (target >= 3) {
    for (let i = 0; i < 3; i++) {
      if (i !== pathIndex && lv[i] > 2) return false;
    }
  }
  if (target >= 3) {
    let others = 0;
    for (let i = 0; i < 3; i++) {
      if (i !== pathIndex) others += lv[i];
    }
    if (others > 2) return false;
  }
  return true;
}

function effRange(t) {
  return t.range * (t.buffRangeMul || 1);
}

function effRate(t, board) {
  return t.fireRate * (t.buffFireRateMul || 1) * (board.boostTimer > 0 ? 2 : 1);
}

function effDamage(t) {
  return t.damage + (t.buffDamage || 0);
}

function priceOf(cost) {
  return Math.round(cost * 1.0); // Medium standard pricing multiplier
}

function lighten(color, percent) {
  // Simple fallback lighten color string
  return color;
}

function deselectTower() {
  if (!G) return;
  G.selectedTower = null;
  G.placingTower = null;
  G.armedPower = null;
  showShopPanel();
}

function quitGame() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  G = null;
  showScreen('menu-screen');
}

// Window resizing adjustments
window.addEventListener('resize', () => {
  if (G) {
    if (G.isPvP) {
      initDualCanvases();
    } else {
      initSingleCanvas();
    }
  }
});

// Keyboard hotkeys
window.addEventListener('keydown', e => {
  if (!G) return;
  if (e.key === 'Escape') {
    G.placingTower = null;
    G.armedPower = null;
    deselectTower();
    updatePowersBar();
  }
  if (e.key === ' ') {
    e.preventDefault();
    startWave();
  }
  if (e.key === '1') setSpeed(1);
  if (e.key === '2') setSpeed(2);
  if (e.key === '3') setSpeed(3);
});

// Load Settings from LocalStorage on load
function loadSettings() {
  const local = localStorage.getItem('btd_battles_settings');
  if (local) {
    try {
      settings = JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse settings.");
    }
  }
}

// -------- ENGINE INITIALIZATION --------
window.onload = () => {
  loadProfile();
  loadSettings();
  initFirebase();
  connectWebSocket();
  
  // Custom lobby-chat listener forwarding
  if (ws) {
    ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'opponent-action' && msg.action.type === 'lobby-chat') {
          addLobbyChatMessage(msg.action.sender, msg.action.text);
        }
      } catch (e) {}
    });
  }
};

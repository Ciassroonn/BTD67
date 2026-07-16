const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Fallback all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Memory Stores
const clients = new Map(); // id -> { ws, name, profile, roomId, queueJoinedAt }
const rooms = new Map(); // roomId -> { id, p1, p2, state: 'setup'|'playing'|'ended', mapId, votes: {}, loadouts: {}, startedAt }
const globalLeaderboard = []; // Array of { name, trophies, wins, losses }

// Helper: Generate unique IDs
function generateId(prefix = '') {
  return prefix + Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Helper: Broadcast to room
function broadcastToRoom(roomId, message, excludeClientId = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  const p1Client = clients.get(room.p1);
  const p2Client = clients.get(room.p2);
  
  if (p1Client && p1Client.id !== excludeClientId && p1Client.ws.readyState === WebSocket.OPEN) {
    p1Client.ws.send(JSON.stringify(message));
  }
  if (p2Client && p2Client.id !== excludeClientId && p2Client.ws.readyState === WebSocket.OPEN) {
    p2Client.ws.send(JSON.stringify(message));
  }
}

// Helper: Matchmaking queue searcher
function checkMatchmaking() {
  const queue = Array.from(clients.values()).filter(c => c.queueJoinedAt && !c.roomId);
  if (queue.length >= 2) {
    // Sort by join time
    queue.sort((a, b) => a.queueJoinedAt - b.queueJoinedAt);
    const p1 = queue[0];
    const p2 = queue[1];

    // Remove from queue
    p1.queueJoinedAt = null;
    p2.queueJoinedAt = null;

    // Create Room
    const roomId = generateId('ROOM-');
    p1.roomId = roomId;
    p2.roomId = roomId;

    const room = {
      id: roomId,
      p1: p1.id,
      p2: p2.id,
      state: 'setup',
      votes: {},
      loadouts: {},
      startedAt: Date.now()
    };
    rooms.set(roomId, room);

    // Send Matched events
    p1.ws.send(JSON.stringify({
      type: 'matched',
      roomId,
      role: 'host',
      opponent: { name: p2.name, trophies: p2.profile.trophies }
    }));

    p2.ws.send(JSON.stringify({
      type: 'matched',
      roomId,
      role: 'guest',
      opponent: { name: p1.name, trophies: p1.profile.trophies }
    }));

    console.log(`Matched players ${p1.name} and ${p2.name} in Room ${roomId}`);
  }
}

// Helper: Update leaderboard in-memory
function updateLeaderboard(name, profile) {
  let found = globalLeaderboard.find(p => p.name === name);
  if (found) {
    found.trophies = profile.trophies;
    found.wins = profile.wins;
    found.losses = profile.losses;
  } else {
    globalLeaderboard.push({
      name,
      trophies: profile.trophies,
      wins: profile.wins,
      losses: profile.losses
    });
  }
  // Sort by trophies descending, then wins descending
  globalLeaderboard.sort((a, b) => b.trophies - a.trophies || b.wins - a.wins);
  if (globalLeaderboard.length > 50) globalLeaderboard.pop(); // Keep top 50
}

wss.on('connection', (ws) => {
  const clientId = generateId('P-');
  const clientState = {
    id: clientId,
    ws,
    name: 'Guest',
    profile: { wins: 0, losses: 0, trophies: 200 },
    roomId: null,
    queueJoinedAt: null
  };
  clients.set(clientId, clientState);

  // Send welcome
  ws.send(JSON.stringify({ type: 'welcome', id: clientId }));

  ws.on('message', (messageStr) => {
    try {
      const msg = JSON.parse(messageStr);
      
      switch (msg.type) {
        case 'register':
          clientState.name = msg.name || 'Guest';
          clientState.profile = msg.profile || { wins: 0, losses: 0, trophies: 200 };
          updateLeaderboard(clientState.name, clientState.profile);
          break;

        case 'join-queue':
          clientState.queueJoinedAt = Date.now();
          ws.send(JSON.stringify({ type: 'queue-joined' }));
          checkMatchmaking();
          break;

        case 'leave-queue':
          clientState.queueJoinedAt = null;
          ws.send(JSON.stringify({ type: 'queue-left' }));
          break;

        case 'create-lobby': {
          const lobbyCode = Math.random().toString(36).substring(2, 7).toUpperCase();
          clientState.roomId = lobbyCode;
          
          const room = {
            id: lobbyCode,
            p1: clientState.id,
            p2: null,
            state: 'setup',
            votes: {},
            loadouts: {},
            isPrivate: true
          };
          rooms.set(lobbyCode, room);
          ws.send(JSON.stringify({ type: 'lobby-created', code: lobbyCode }));
          break;
        }

        case 'join-lobby': {
          const code = msg.code ? msg.code.trim().toUpperCase() : '';
          const room = rooms.get(code);
          if (room && !room.p2 && room.isPrivate) {
            clientState.roomId = code;
            room.p2 = clientState.id;
            
            const host = clients.get(room.p1);
            ws.send(JSON.stringify({
              type: 'lobby-joined',
              code,
              role: 'guest',
              opponent: { name: host.name, trophies: host.profile.trophies }
            }));
            
            host.ws.send(JSON.stringify({
              type: 'opponent-joined',
              opponent: { name: clientState.name, trophies: clientState.profile.trophies }
            }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Lobby not found or already full.' }));
          }
          break;
        }

        case 'start-private-game': {
          const room = rooms.get(clientState.roomId);
          if (room && room.p1 === clientState.id && room.p2) {
            broadcastToRoom(room.id, { type: 'enter-setup' });
          }
          break;
        }

        case 'vote-map': {
          const room = rooms.get(clientState.roomId);
          if (room) {
            room.votes[clientState.id] = msg.mapId;
            broadcastToRoom(room.id, {
              type: 'map-voted',
              clientId: clientState.id,
              mapId: msg.mapId
            });

            // If both voted, finalize map
            const voters = Object.keys(room.votes);
            const player2Id = room.p2;
            if (voters.length === 2 || (voters.length === 1 && !player2Id)) {
              const voteList = Object.values(room.votes);
              // Pick random if tied, else majority
              const chosenMap = voteList[0] === voteList[1] ? voteList[0] : voteList[Math.floor(Math.random() * voteList.length)];
              room.mapId = chosenMap;
              broadcastToRoom(room.id, { type: 'map-finalized', mapId: chosenMap });
            }
          }
          break;
        }

        case 'select-loadout': {
          const room = rooms.get(clientState.roomId);
          if (room) {
            room.loadouts[clientState.id] = { hero: msg.hero, towers: msg.towers };
            
            // Send acknowledgement to other player
            const role = room.p1 === clientState.id ? 'host' : 'guest';
            broadcastToRoom(room.id, {
              type: 'loadout-ready',
              role,
              loadout: { hero: msg.hero, towers: msg.towers }
            }, clientState.id);

            // If both ready, start!
            const loadoutKeys = Object.keys(room.loadouts);
            if (loadoutKeys.length === 2) {
              room.state = 'playing';
              broadcastToRoom(room.id, {
                type: 'match-start',
                mapId: room.mapId || 'zen',
                hostLoadout: room.loadouts[room.p1],
                guestLoadout: room.loadouts[room.p2]
              });
            }
          }
          break;
        }

        case 'game-action': {
          const room = rooms.get(clientState.roomId);
          if (room && room.state === 'playing') {
            // Forward action to the opponent
            const opponentId = room.p1 === clientState.id ? room.p2 : room.p1;
            if (opponentId) {
              const opponent = clients.get(opponentId);
              if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
                opponent.ws.send(JSON.stringify({
                  type: 'opponent-action',
                  action: msg.action
                }));
              }
            }
          }
          break;
        }

        case 'get-leaderboard':
          ws.send(JSON.stringify({
            type: 'leaderboard-data',
            leaderboard: globalLeaderboard
          }));
          break;

        case 'quit-room': {
          handleDisconnect(clientState);
          break;
        }
      }
    } catch (e) {
      console.error('Error handling WebSocket message:', e);
    }
  });

  ws.on('close', () => {
    handleDisconnect(clientState);
    clients.delete(clientId);
  });
});

function handleDisconnect(client) {
  if (client.roomId) {
    const room = rooms.get(client.roomId);
    if (room) {
      const opponentId = room.p1 === client.id ? room.p2 : room.p1;
      if (opponentId) {
        const opponent = clients.get(opponentId);
        if (opponent && opponent.ws.readyState === WebSocket.OPEN) {
          opponent.ws.send(JSON.stringify({
            type: 'opponent-disconnected',
            message: 'Your opponent left the game.'
          }));
          opponent.roomId = null;
        }
      }
      rooms.delete(client.roomId);
    }
    client.roomId = null;
  }
  if (client.queueJoinedAt) {
    client.queueJoinedAt = null;
  }
}

// Start HTTP server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`BTD Battles 2 server running on port ${PORT}`);
});

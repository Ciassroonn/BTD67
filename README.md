# Balloons TD 6 — Co-op Edition Remake

An interactive, feature-rich remake of the classic tower defense game Balloons TD 6, designed to run directly in your browser. This version includes full singleplayer gameplay and real-time multiplayer co-op using PeerJS network connections.

## 🚀 Game Features

- **Four Game Difficulties**: Easy, Medium, Hard, and Impoppable—complete with custom balloon speeds, health modifiers, and starting lives/cash.
- **Unique Heroes**: Pick from five customizable heroes (Quincy, Gwen, Obyn, Churchill, and Benjamin), each with distinct active abilities and custom level-up progression systems.
- **Complete Monkey Arsenal**: Deploy towers across multiple categories (Primary, Military, Magic, Support).
- **Crosspath Upgrades**: Expand your towers through full 3-path upgrade trees adhering to authentic crosspath locking rules.
- **Consumable Power-Ups**: Activate strategic powers like Monkey Boost, Cash Drops, Glue Traps, and Exploding Pineapples to save tight situations.
- **Durable Progress**: Export and restore your game states using secure base64-encoded Save/Load strings.
- **P2P Multiplayer Co-op**: Connect with a teammate instantly in real-time, share resources, place towers together, and coordinate wave defenses.

## 📂 Project Architecture

The application is structured as a clean static full-stack Node.js application:

```text
├── css/
│   └── style.css            # Custom futuristic cyber-dark game UI styling
├── js/
│   ├── game-data.js         # Tower definitions, difficulties, and wave progression algorithms
│   └── game-engine.js       # Game loop, canvas render pipelines, input controls, and P2P co-op sync
├── index.html               # Main webpage entrance with gameplay grids and state overlays
├── package.json             # App scripts and dependency declarations (Express)
├── server.js                # Express static server binding on port 3000
└── metadata.json            # AI Studio app metadata and configurations
```

## 🎮 How to Play

1. Open the application in your AI Studio preview iframe.
2. Select **Singleplayer** to play offline, or choose **Host / Join Co-op** to start an online multiplayer room.
3. Choose your Hero unit and game Difficulty to deploy onto the grass arena.
4. Drag and place towers along the track, click on them to view stats or buy powerful upgrades, and trigger **Start Wave** to release the balloons!

```
Inis-Api
├─ jest.config.js
├─ package-lock.json
├─ package.json
├─ project-hierarchy.txt
├─ project_tree.txt
├─ README.md
├─ socket.d.ts
├─ src
│  ├─ controllers
│  │  └─ gameStateController.ts
│  ├─ core
│  │  ├─ cardOperations
│  │  │  ├─ cardAction.ts
│  │  │  ├─ cardActionInfo.ts
│  │  │  ├─ cardAdvantage.ts
│  │  │  ├─ cardEpos.ts
│  │  │  └─ cardMap.ts
│  │  ├─ constans
│  │  │  ├─ constant_3_players.ts
│  │  │  ├─ constant_action_cards.ts
│  │  │  ├─ constant_advantage_cards.ts
│  │  │  ├─ constant_all_cards.ts
│  │  │  ├─ constant_epos_cards.ts
│  │  │  ├─ constant_territories.ts
│  │  │  └─ constant_trixelConditions.ts
│  │  ├─ DeckManager.ts
│  │  ├─ fight
│  │  │  ├─ Fight.ts
│  │  │  └─ FightManager.ts
│  │  ├─ gameState
│  │  │  ├─ GameState.ts
│  │  │  └─ GameStateManager.ts
│  │  ├─ map
│  │  │  ├─ ClansController.ts
│  │  │  ├─ FieldsController.ts
│  │  │  ├─ HexagonField.ts
│  │  │  ├─ HexGrid.ts
│  │  │  └─ SetupController.ts
│  │  ├─ Player.ts
│  │  └─ TrixelManager.ts
│  ├─ server.ts
│  ├─ sockets
│  │  ├─ events
│  │  │  ├─ debugEvents.ts
│  │  │  ├─ gameLobbyEvents.ts
│  │  │  ├─ gameSetupEvents.ts
│  │  │  ├─ playerFightEvents.ts
│  │  │  └─ playerGameEvents.ts
│  │  ├─ middleware
│  │  └─ socket.ts
│  ├─ types
│  │  ├─ Enums.ts
│  │  ├─ Interfaces.ts
│  │  └─ Types.ts
│  └─ utils
│     ├─ debugTools.ts
│     ├─ gameStateUtils.ts
│     ├─ helperFunctions.ts
│     └─ HexGridUtils.ts
├─ tsconfig.json
└─ __tests__
   └─ helperFunctions.test.ts
```
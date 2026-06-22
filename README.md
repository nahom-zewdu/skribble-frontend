# skribble-frontend

## Overview

The frontend is a real-time multiplayer game client built with React.
It is responsible for:

* WebSocket-based game communication
* Real-time UI state management
* Rendering game rooms, canvas, chat, and player state
* Synchronizing server-driven events into a local store

The architecture is deliberately split into three layers:

1. Core (infrastructure + networking)
2. Store (state management)
3. Features (UI modules)

---

## Directory Structure

```
src/
  app/
    router.tsx
    App.tsx
```

Application bootstrap and routing configuration.

* `router.tsx`: Route definitions using React Router
* `App.tsx`: Root application shell

---

```
core/
  socket/
    websocket.ts
    protocol.ts
    messageHandler.ts
```

Real-time communication layer.

### websocket.ts

Encapsulates WebSocket connection lifecycle.

Responsibilities:

* Connect/disconnect from game server
* Send client messages
* Dispatch incoming messages to subscribers
* Separate handling for drawing vs general events

### protocol.ts

Defines the full WebSocket contract between client and server.

Includes:

* ClientMessage types
* ServerMessage types
* Game domain types (Player, GameSnapshot, etc.)

This is the single source of truth for runtime communication schema.

### messageHandler.ts

Maps incoming server events into state updates.

Responsibilities:

* Translate server events into store mutations
* Maintain UI consistency with server state
* Handle game lifecycle events (start, turn, end, chat, etc.)

---

```
store/
  gameStore.ts
```

Global application state (Zustand).

Holds:

* Players
* Game phase/state
* Room metadata
* Chat messages
* Drawing state
* Timer/turn information

This store is updated exclusively by `messageHandler.ts`.

No component should mutate game state directly.

---

```
features/
  lobby/
    JoinPage.tsx
```

Lobby entry point.

Responsibilities:

* Player name input
* Room creation / joining
* Mode selection (public/private)

This is the only non-game screen before entering a room.

---

```
features/game/
  GamePage.tsx
  CanvasBoard.tsx
  ChatBox.tsx
  PlayerList.tsx
  WordSelector.tsx
  Timer.tsx
```

Core gameplay UI.

### GamePage.tsx

Main orchestrator for a game session.

* Initializes socket handler
* Mounts all game subsystems
* Controls layout and phase switching

### CanvasBoard.tsx

Drawing surface.

* Handles pointer input
* Sends draw events via WebSocket
* Renders remote strokes from other players

### ChatBox.tsx

Real-time chat system.

* Sends/receives chat messages
* Displays system + game events

### PlayerList.tsx

Displays active players.

* Scores
* Turn indicators
* Active drawer state

### WordSelector.tsx

Used during word selection phase.

* Displays word options from server
* Sends selected word back to server

### Timer.tsx

Handles countdown visualization.

* Driven by server timestamps
* No internal timing logic beyond display

---

```
components/
  Button.tsx
  Input.tsx
```

Shared UI primitives.

* `Button`: Styled interactive button
* `Input`: Controlled input field

These components are stateless and reusable.

---

```
utils/
  time.ts
```

Time utilities.

* Formatting timestamps
* Duration helpers
* Deadline calculations (client-side display only)

---

## Architectural Rules

* All real-time state comes from WebSocket events
* Only `messageHandler.ts` may mutate `gameStore`
* UI components must remain stateless where possible
* Server is the source of truth for game state
* Client only renders and forwards user intent

---

## Data Flow

1. WebSocket receives message
2. `websocket.ts` dispatches it
3. `messageHandler.ts` interprets it
4. `gameStore.ts` is updated
5. React components re-render automatically

---

## Key Design Constraint

This is not a traditional REST frontend.

It is a real-time state projection of a game engine.

The correctness of the UI depends entirely on:

* event ordering
* message consistency
* store immutability rules

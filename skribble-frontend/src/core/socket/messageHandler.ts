// src/core/socket/messageHandler.ts
// This file defines the message handler for incoming WebSocket messages from the Skribble game server.
// It listens for messages and updates the Zustand game store accordingly based on the type of message received.
import { socket } from "./websocket"
import { useGameStore } from "../../store/gameStore"
import type { ServerMessage } from "./protocol"

export function initMessageHandler() {
  socket.onMessage((msg: ServerMessage) => {
    const store = useGameStore.getState()

    switch (msg.type) {
      case "game_snapshot":
        store.setState({
          state: msg.data.state,
          phase: msg.data.phase,
          selfID: msg.data.selfID,
          players: msg.data.players,
          maskedWord: msg.data.maskedWord,
          turnNumber: msg.data.turnNumber,
          drawerID: msg.data.drawerID,
          selectionDeadline: msg.data.selectionDeadline,
          playDeadline: msg.data.playDeadline,
          transitionDeadline: msg.data.transitionDeadline,
          restartDeadline: msg.data.restartDeadline,
        })
        break

      case "turn_started":
        store.setState({
          turnNumber: msg.data.turnNumber,
          drawerID: msg.data.drawerID,
        })
        break

      case "word_selection_started":
        store.setState({
          drawerID: msg.data.drawerID,
          selectionChoices: msg.data.choices,
          selectionDeadline: msg.data.deadline,
        })
        break

      case "drawing_started":
        // Drawer sees the actual word
        if (msg.data.word) {
          store.setState({
            word: msg.data.word,
            maskedWord: msg.data.word,
            drawerID: msg.data.drawerID,
            playDeadline: msg.data.deadline,
            selectionChoices: undefined,
          })
        } else {
          // Guessers see masked word only
          store.setState({
            maskedWord: msg.data.maskedWord,
            playDeadline: msg.data.deadline,
          })
        }
        break
        
        case "correct_guess":
        // Update score for player
        const playerIndex = store.players.findIndex(
          (p) => p.id === msg.data.playerID
        )
        if (playerIndex !== -1) {
          const updatedPlayers = [...store.players]
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            score: msg.data.score,
          }
          store.setState({ players: updatedPlayers })
        }
        break

      case "turn_ended":
        store.setState({
          players: msg.data.players,
          word: undefined,
          maskedWord: undefined,
          selectionChoices: [],
          drawerID: undefined,
        })
        break

      case "game_ended":
        store.setState({
          players: msg.data.players,
          state: "ended",
          drawerID: undefined,
          turnNumber: 0,
          word: undefined,
          maskedWord: undefined,
          selectionChoices: [],
        })
        break
        
      case "chat":
        store.setState({
          messages: [
            ...store.messages,
            {
              id: crypto.randomUUID(),
              sender: msg.data.sender,
              text: msg.data.text,
              type: "chat",
            },
          ],
        })
        break

      case "system":
        store.setState({
          messages: [
            ...store.messages,
            {
              id: crypto.randomUUID(),
              text: msg.data.text,
              type: "system",
            },
          ],
        })
        break
    }
  })
}

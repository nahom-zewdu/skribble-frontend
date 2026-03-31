// src/core/socket/messageHandler.ts
// This file defines the message handler for incoming WebSocket messages from the Skribble game server.
// It listens for messages and updates the Zustand game store accordingly based on the type of message received.
import { socket } from "./websocket"
import { useGameStore } from "../../store/gameStore"
import type { ServerMessage } from "./protocol"
  
let initialized = false
let unsubscribe: (() => void) | null = null

function mapPhase(phase: string): string {
  switch (phase) {
    case "selecting":
      return "word_selection"
    case "drawing":
      return "drawing"
    case "ended":
      return "turn_end"
    default:
      return "waiting"
  }
}

export function initMessageHandler() {
  if (initialized) return
  initialized = true

  unsubscribe = socket.onMessage((msg: ServerMessage) => {
    const store = useGameStore.getState()

    switch (msg.type) {
      case "game_snapshot":
        store.setState({
          selfID: msg.data.selfID,

          state: msg.data.state,
          phase: mapPhase(msg.data.phase),

          players: msg.data.players,

          drawerID: msg.data.drawerID,
          turnNumber: msg.data.turnNumber,

          maskedWord: msg.data.maskedWord,
          
          word: undefined,

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
          phase: "word_selection",
          selectionChoices: msg.data.choices,
          selectionDeadline: msg.data.deadline,
        })
        break

      case "drawing_started":
        store.setState({
          phase: "drawing",
          word: msg.data.word,
          maskedWord: msg.data.maskedWord,
          playDeadline: msg.data.deadline,
        })
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
            score: updatedPlayers[playerIndex].score + msg.data.score,
          }
          store.setState({ players: updatedPlayers })
        }
        break

      case "turn_ended":
        store.setState({
          phase: "turn_end",
          players: msg.data.players,
          word: undefined,
          maskedWord: undefined,
          selectionChoices: [],
          drawerID: undefined,
          nextTurnStartTime: msg.data.nextTurnStartTime,
        })
        break

      case "game_ended":
        store.setState({
          players: msg.data.players,
          state: "ended",
          phase: "game_end",
          drawerID: undefined,
          turnNumber: 0,
          word: undefined,
          maskedWord: undefined,
          selectionChoices: [],
          restartTime: msg.data.restartTime,
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


export function cleanupMessageHandler() {
  unsubscribe?.()
  initialized = false
}

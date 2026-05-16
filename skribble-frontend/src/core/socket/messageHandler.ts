// src/core/socket/messageHandler.ts
// This file defines the message handler for incoming WebSocket messages from the Skribble game server.
// It processes different types of messages (game state updates, chat messages, turn results, etc.) and updates the Zustand game store accordingly.

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

const MAX_MESSAGES = 120

export function initMessageHandler() {
  if (initialized) return

  initialized = true

  unsubscribe = socket.onMessage((msg: ServerMessage) => {
    switch (msg.type) {
      case "game_snapshot": {
        const store = useGameStore.getState()

        useGameStore.setState({
          selfID: msg.data.selfID,
          roomID: msg.data.roomID ?? store.roomID ?? "",

          state: msg.data.state,
          phase: mapPhase(msg.data.phase),

          players: msg.data.players ?? [],

          drawerID: msg.data.drawerID,
          turnNumber: msg.data.turnNumber,

          maskedWord: msg.data.maskedWord,
          wordLengthHint: msg.data.wordLengthHint,

          word: undefined,

          turnResult: undefined,
          gameResult: undefined,

          selectionDeadline: msg.data.selectionDeadline,
          playDeadline: msg.data.playDeadline,
          transitionDeadline: msg.data.transitionDeadline,
          restartDeadline: msg.data.restartDeadline,
        })

        break
      }

      case "turn_started":
        useGameStore.setState({
          turnNumber: msg.data.turnNumber,
          drawerID: msg.data.drawerID,
        })
        break

      case "word_selection_started":
        useGameStore.setState({
          phase: "word_selection",

          drawerID: msg.data.drawerID,

          selectionChoices: msg.data.choices,
          selectionDeadline: msg.data.deadline,
        })
        break

      case "drawing_started":
        useGameStore.setState({
          phase: "drawing",

          word: msg.data.word,
          maskedWord: msg.data.maskedWord,
          wordLengthHint: msg.data.wordLengthHint,

          playDeadline: msg.data.deadline,
        })
        break

      case "correct_guess": {
        const store = useGameStore.getState()

        const updatedPlayers = store.players.map((p) => {
          if (p.id === msg.data.playerID) {
            return {
              ...p,
              score: p.score + msg.data.score,
            }
          }

          if (p.id === msg.data.drawerID) {
            return {
              ...p,
              score: p.score + msg.data.drawerPoints,
            }
          }

          return p
        })

        useGameStore.setState({
          players: updatedPlayers,

          recentGuess: {
            id: crypto.randomUUID(),

            playerID: msg.data.playerID,
            score: msg.data.score,

            drawerID: msg.data.drawerID,
            drawerPoints: msg.data.drawerPoints,
          },
        })

        setTimeout(() => {
          const current = useGameStore.getState().recentGuess

          if (current?.playerID === msg.data.playerID) {
            useGameStore.setState({
              recentGuess: undefined,
            })
          }
        }, 1800)

        break
      }

      case "turn_ended":
        useGameStore.setState({
          phase: "turn_end",

          players: msg.data.players,

          turnResult: {
            word: msg.data.word,
            players: [...msg.data.players].sort(
              (a, b) => b.score - a.score
            ),
          },

          word: undefined,
          maskedWord: undefined,

          selectionChoices: [],

          drawerID: undefined,

          nextTurnStartTime: msg.data.nextTurnStartTime,
        })
        break

      case "game_ended": {
        const store = useGameStore.getState()

        useGameStore.setState({
          players: msg.data.players,

          state: "ended",
          phase: "game_end",

          gameResult: {
            players: [...msg.data.players].sort(
              (a, b) => b.score - a.score
            ),
          },

          drawerID: undefined,

          turnNumber: store.turnNumber,

          word: undefined,
          maskedWord: undefined,

          selectionChoices: [],

          restartTime: msg.data.restartTime,
        })

        break
      }

      case "chat": {
        const store = useGameStore.getState()

        useGameStore.setState({
          messages: [
            ...store.messages,
            {
              id: crypto.randomUUID(),
              sender: msg.data.sender,
              text: msg.data.text,
              type: "chat",
            },
          ].slice(-MAX_MESSAGES),
        })

        break
      }

      case "system": {
        const store = useGameStore.getState()

        useGameStore.setState({
          messages: [
            ...store.messages,
            {
              id: crypto.randomUUID(),
              text: msg.data.text,
              type: "system",
            },
          ].slice(-MAX_MESSAGES),
        })

        break
      }

      case "hint_revealed":
        useGameStore.setState({
          maskedWord: msg.data.maskedWord,
          wordLengthHint: msg.data.wordLengthHint,
        })
        break
    }
  })
}

export function cleanupMessageHandler() {
  unsubscribe?.()

  unsubscribe = null
  initialized = false
}

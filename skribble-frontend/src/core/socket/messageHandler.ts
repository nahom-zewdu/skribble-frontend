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
          players: msg.data.players,
          maskedWord: msg.data.maskedWord,
          turnNumber: msg.data.turnNumber,
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
          selectionChoices: msg.data.choices,
        })
        break

      case "drawing_started":
        store.setState({
          word: msg.data.word,
          maskedWord: msg.data.maskedWord,
        })
        break

      case "chat":
        store.setState({
          messages: [
            ...store.messages,
            {
              sender: msg.data.sender,
              text: msg.data.text,
            },
          ],
        })
        break

      case "correct_guess":
        break

      case "turn_ended":
        store.setState({
          players: msg.data.players,
        })
        break
    }
  })
}

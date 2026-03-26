// src/core/socket/websocket.ts
// This file implements the WebSocket client for the Skribble game.
// It defines a GameSocket class that manages the WebSocket connection and allows sending messages to the server and registering listeners for incoming messages.
import type { ClientMessage, ServerMessage } from "./protocol"

type Listener = (msg: ServerMessage) => void
type DrawListener = (msg: ServerMessage) => void

class GameSocket {
  private ws?: WebSocket
  private drawListeners: DrawListener[] = []
  private listeners: Listener[] = []

  connect(name: string, room: string) {
    const url = `ws://localhost:8080/ws?name=${name}&room=${room}`

    this.ws = new WebSocket(url)

    this.ws.onmessage = (event) => {
    const msg: ServerMessage = JSON.parse(event.data)

    // Drawing messages go separately
    if (
      msg.type === "draw_start" ||
      msg.type === "draw_move" ||
      msg.type === "draw_end" ||
      msg.type === "clear_canvas"
    ) {
      this.drawListeners.forEach((l) => l(msg))
      return
    }

    this.listeners.forEach((l) => l(msg))
  }
  }

  send(msg: ClientMessage) {
    this.ws?.send(JSON.stringify(msg))
  }

  onDraw(listener: DrawListener) {
    this.drawListeners.push(listener)
  }

  onMessage(listener: Listener) {
    this.listeners.push(listener)
  }
}

export const socket = new GameSocket()

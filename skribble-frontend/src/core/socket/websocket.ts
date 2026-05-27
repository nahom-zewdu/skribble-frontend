// src/core/socket/websocket.ts
// This file defines the GameSocket class, which manages the WebSocket connection to the Skribble game server.
// It provides methods to connect to the server, send messages, and register listeners for incoming messages, including separate handling for drawing-related messages.
import type { ClientMessage, ServerMessage } from "./protocol"

type Listener = (msg: ServerMessage) => void
type DrawListener = (msg: ServerMessage) => void

class GameSocket {
  private ws?: WebSocket
  private drawListeners: Set<DrawListener> = new Set()
  private listeners: Set<Listener> = new Set()

  connect(name: string,
          mode: "public" | "private_create" | "private_join",
          room?: string
    ) {

    // close previous socket
   this.ws?.close()
  
   const params = new URLSearchParams({
      name,
      mode,
    })

    if (room) {
      params.append("room", room)
    }

    const WS_BASE = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080"

    const url = `${WS_BASE}/ws?${params.toString()}`

    this.ws = new WebSocket(url)

    this.ws.onclose = () => {
      console.warn("WebSocket closed")
    }

    this.ws.onerror = (err) => {
      console.error("WebSocket error", err)
    }

    this.ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data)

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
    this.drawListeners.add(listener)
    return () => this.drawListeners.delete(listener)
  }

  onMessage(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const socket = new GameSocket()

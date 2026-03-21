// src/features/game/ChatBox.tsx
// This file defines the ChatBox component for the Skribble frontend application.
// The ChatBox allows players to send chat messages and guesses during the game.
// It displays a list of messages received from the server and provides an input field for sending new messages.

import { useState } from "react"
import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"

export default function ChatBox() {
  const [input, setInput] = useState("")
  const messages = useGameStore((s) => s.messages)

  function sendMessage() {
    if (!input.trim()) return

    socket.send({
      type: "chat",
      data: { text: input },
    })

    setInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {messages.map((m, i) => (
          <div key={i}>
            <span className="font-semibold">
              {m.sender === "system" ? "[System]" : m.sender}:
            </span>{" "}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a guess..."
        />

        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>

    </div>
  )
}

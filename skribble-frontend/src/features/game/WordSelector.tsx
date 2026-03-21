// src/features/game/ChatBox.tsx
// This file defines the ChatBox component for the Skribble frontend application.
// The ChatBox allows players to send chat messages and guesses during the game.
// It displays a list of messages received from the server and provides an input field for sending new messages.

import { useEffect, useRef, useState } from "react"
import { useGameStore } from "../../store/gameStore"
import { socket } from "../../core/socket/websocket"

export default function ChatBox() {
  const messages = useGameStore((s) => s.messages)
  const [input, setInput] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)

  function send() {
    if (!input.trim()) return

    socket.send({
      type: "chat",
      data: { text: input },
    })

    setInput("")
  }

  // ✅ Auto-scroll on new message
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-1"
      >
        {messages.map((m) => {
          if (m.type === "system") {
            return (
              <div
                key={m.id}
                className="text-xs text-gray-500 italic text-center"
              >
                {m.text}
              </div>
            )
          }

          return (
            <div key={m.id}>
              <span className="font-semibold">{m.sender}:</span>{" "}
              {m.text}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a guess..."
        />
        <button
          onClick={send}
          className="px-4 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}

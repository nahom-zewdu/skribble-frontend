// src/features/game/ChatBox.tsx
// This file defines the ChatBox component for the Skribble frontend application.
// The ChatBox allows players to send chat messages and guesses during the game.
// It displays a list of messages received from the server and provides an input field for sending new messages.

import { useEffect, useRef, useState } from "react"
import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"

export default function ChatBox() {
  const [input, setInput] = useState("")
  const messages = useGameStore((s) => s.messages)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => {
          const isSystem = m.type === "system"
          return (
            <div
              key={i}
              className={`
                px-3 py-2 rounded-2xl
                break-words
                animate-chat-pop

                ${
                  isSystem
                    ? "bg-slate-700/60 text-slate-300 text-sm italic"
                    : "bg-slate-700 text-white"
                }
              `}
            >

              {!isSystem && (
                <div className="font-bold text-blue-300 text-sm mb-1">
                  {m.sender}
                </div>
              )}

              <div className="text-sm">
                {m.text}
              </div>

            </div>
          )
        })}

        <div ref={bottomRef} />

      </div>

      <div className="p-2 border-t flex gap-2">
        <input
          className="
                flex-1
                bg-slate-700
                border border-slate-600
                rounded-lg
                px-3 py-2
                text-white
                placeholder:text-slate-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a guess..."
        />

        <button
          onClick={sendMessage}
          className="
            px-4
            rounded-lg
            bg-blue-500
            hover:bg-blue-400
            active:scale-95
            transition-all
            text-white
            font-semibold
          "
        >
          Send
        </button>
      </div>

    </div>
  )
}

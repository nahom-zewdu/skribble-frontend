// src/features/game/ChatBox.tsx
// This file defines the ChatBox component for the Skribble frontend application.
// The ChatBox allows players to send chat messages and guesses during the game.
// It displays a list of messages received from the server and provides an input field for sending new messages.

// src/features/game/ChatBox.tsx

import { useEffect, useMemo, useRef, useState } from "react"

import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"

export default function ChatBox() {
  const [input, setInput] = useState("")

  const selfID = useGameStore((s) => s.selfID)
  const players = useGameStore((s) => s.players)

  const messages = useGameStore((s) => s.messages)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  const playerMap = useMemo(() => {
    return new Map(
      players.map((p) => [p.name, p.id])
    )
  }, [players])

  function sendMessage() {
    const trimmed = input.trim()

    if (!trimmed) return

    socket.send({
      type: "chat",
      data: {
        text: trimmed,
      },
    })

    setInput("")
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => {
          const isSystem = m.type === "system"

          const senderID = playerMap.get(m.sender ?? "")

          const isSelf = senderID === selfID

          return (
            <div
              key={m.id}
              className={`
                px-3 py-2 rounded-2xl
                break-words
                animate-chat-pop

                ${
                  isSystem
                    ? "bg-slate-700/60 text-slate-300 text-sm italic"
                    : isSelf
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }
              `}
            >
              {!isSystem && (
                <div className="font-bold text-sm mb-1 opacity-90">
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

      <div className="p-2 border-t border-slate-700 flex gap-2">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type a guess..."
          maxLength={120}
          className="
            flex-1
            bg-slate-700
            border border-slate-600
            rounded-xl
            px-3 py-2
            text-white
            placeholder:text-slate-400
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="
            px-4
            rounded-xl
            bg-blue-500
            hover:bg-blue-400
            disabled:opacity-50
            disabled:cursor-not-allowed
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

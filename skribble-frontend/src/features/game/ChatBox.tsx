// src/features/game/ChatBox.tsx
// This file defines the ChatBox component for the Skribble frontend application.
// The ChatBox allows players to send chat messages and guesses during the game.
// It displays a list of messages received from the server and provides an input field for sending new messages.

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"

export default function ChatBox() {
  const [input, setInput] = useState("")

  const selfID = useGameStore((s) => s.selfID)
  const players = useGameStore((s) => s.players)

  const messages = useGameStore((s) => s.messages)

  const bottomRef =
    useRef<HTMLDivElement | null>(null)

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
    <div
      className="
        relative
        flex h-full flex-col
        overflow-hidden
        bg-[#1f1f1f]
      "
    >

      {/* top stripe */}
      <div
        className="
          h-3
          border-b-4 border-black
          bg-[repeating-linear-gradient(45deg,#60a5fa_0px,#60a5fa_16px,#18181b_16px,#18181b_32px)]
        "
      />

      {/* pattern */}
      <div
        className="
          absolute inset-0
          opacity-[0.04]
          pointer-events-none
          [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
          [background-size:24px_24px]
        "
      />

      {/* header */}
      <div
        className="
          relative z-10

          flex items-center justify-between

          px-3 pt-3 pb-2

          border-b-4 border-black
        "
      >

        <div>

          <div
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.25em]
              text-zinc-500
            "
          >
            live chat
          </div>

          <h2
            className="
              text-xl
              sm:text-2xl
              font-black
              tracking-tight
              text-white
            "
          >
            Messages
          </h2>

        </div>

        <div
          className="
            rounded-full
            border-4 border-black
            bg-[#60a5fa]

            px-3 py-1

            text-xs
            font-black
            text-black

            shadow-[0_4px_0_#000]
          "
        >
          {messages.length}
        </div>

      </div>

      {/* messages */}
      <div
        className="
          relative z-10

          flex-1
          overflow-y-auto

          px-2 py-2
        "
      >

        <div
          className="
            flex flex-col
            gap-2
          "
        >

          {messages.map((m, index) => {
            const isSystem =
              m.type === "system"

            const senderID = playerMap.get(
              m.sender ?? ""
            )

            const isSelf =
              senderID === selfID

            return (
              <div
                key={m.id ?? index}
                className={`
                  animate-chat-pop

                  ${
                    isSystem
                      ? "flex justify-center"
                      : isSelf
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                `}
              >

                {/* SYSTEM */}
                {isSystem ? (
                  <div
                    className="
                      max-w-[95%]

                      rounded-full
                      border-2 border-black

                      bg-[#27272a]

                      px-3 py-1.5

                      text-center

                      text-[11px]
                      sm:text-xs

                      font-black
                      tracking-wide
                      text-zinc-300

                      shadow-[0_3px_0_#000]
                    "
                  >
                    {m.text}
                  </div>
                ) : (
                  <div
                    className={`
                      relative

                      max-w-[90%]

                      border-4 border-black

                      px-3 py-2

                      shadow-[0_5px_0_#000]

                      ${
                        isSelf
                          ? `
                            rounded-t-[20px]
                            rounded-bl-[20px]
                            rounded-br-[6px]

                            bg-[#4ade80]
                            text-black
                          `
                          : `
                            rounded-t-[20px]
                            rounded-br-[20px]
                            rounded-bl-[6px]

                            bg-[#3f3f46]
                            text-white
                          `
                      }
                    `}
                  >

                    {/* sender */}
                    <div
                      className={`
                        mb-1

                        text-[10px]
                        sm:text-xs

                        font-black
                        uppercase
                        tracking-wide

                        ${
                          isSelf
                            ? "text-black/60"
                            : "text-zinc-300"
                        }
                      `}
                    >
                      {m.sender}
                    </div>

                    {/* text */}
                    <div
                      className="
                        break-words

                        text-[12px]
                        sm:text-sm

                        font-bold
                        leading-snug
                      "
                    >
                      {m.text}
                    </div>

                  </div>
                )}

              </div>
            )
          })}

        </div>

        <div ref={bottomRef} />

      </div>

      {/* input */}
      <div
        className="
          relative z-10

          border-t-4 border-black

          bg-[#27272a]

          p-2
        "
      >

        <div
          className="
            flex items-center
            gap-2
          "
        >

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type your guess..."
            maxLength={120}
            className="
              flex-1

              rounded-[18px]
              border-4 border-black

              bg-[#f4f4f5]

              px-4 py-3

              text-sm
              font-bold
              text-black

              outline-none

              placeholder:text-zinc-500

              shadow-[0_5px_0_#000]

              focus:translate-y-[2px]
              focus:shadow-[0_3px_0_#000]

              transition-all
            "
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="
              shrink-0

              rounded-[18px]
              border-4 border-black

              bg-[#60a5fa]

              px-4 py-3

              text-sm
              sm:text-base

              font-black
              uppercase
              text-black

              shadow-[0_5px_0_#000]

              transition-all

              hover:translate-y-[2px]
              hover:shadow-[0_3px_0_#000]

              active:translate-y-[4px]
              active:shadow-[0_1px_0_#000]

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            SEND
          </button>

        </div>

      </div>

    </div>
  )
}

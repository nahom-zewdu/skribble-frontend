// src/features/game/WordSelector.tsx
// This file defines the WordSelector component for the Skribble frontend application.
// The WordSelector is responsible for allowing the drawer to select a word at the beginning of their turn. 
// It retrieves the available word choices, selection deadline, and player information from the game store, and sends the selected word back to the server when the drawer makes a choice. 
// The component also handles displaying different views for the drawer and other players while the word selection is in progress.

import { useState, useMemo } from "react"
import { useGameStore } from "../../store/gameStore"
import { socket } from "../../core/socket/websocket"

function isExpired(deadline?: string) {
  if (!deadline) return true
  return new Date(deadline).getTime() < Date.now()
}

export default function WordSelector({
  isDrawer,
}: {
  isDrawer: boolean
}) {
  const choices = useGameStore((s) => s.selectionChoices)
  const deadline = useGameStore((s) => s.selectionDeadline)
  const players = useGameStore((s) => s.players)
  const drawerID = useGameStore((s) => s.drawerID)

  const [selected, setSelected] = useState<string | null>(null)

  const expired = useMemo(() => isExpired(deadline), [deadline])

  const drawer = players.find((p) => p.id === drawerID)

  function select(word: string) {
    if (selected || expired) return

    setSelected(word)

    socket.send({
      type: "select_word",
      data: { word },
    })
  }

  if (expired) return null

  return (
    <div
      className="
        absolute inset-0
        z-20
        flex items-center justify-center
        bg-black/60
        backdrop-blur-md
        px-3
      "
    >
      {/* DRAWER VIEW */}
      {isDrawer && (choices?.length ?? 0) > 0 && (
        <div
          className="
            w-full max-w-lg

            rounded-[28px]
            border-4 border-black

            bg-[#1f1f1f]
            shadow-[0_14px_0_#000]

            overflow-hidden
            animate-fade-in
          "
        >
          {/* stripe */}
          <div
            className="
              h-3
              bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_18px,#111827_18px,#111827_36px)]
              border-b-4 border-black
            "
          />

          <div className="p-5 sm:p-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Pick your word
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Choose carefully others will guess it
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {choices?.map((word) => {
                const isPicked = selected === word

                return (
                  <button
                    key={word}
                    onClick={() => select(word)}
                    disabled={!!selected}
                    className={`
                      relative

                      px-4 py-5

                      rounded-[18px]
                      border-4 border-black

                      font-black
                      text-sm sm:text-base
                      uppercase tracking-wide

                      transition-all

                      shadow-[0_6px_0_#000]

                      hover:translate-y-[2px]
                      hover:shadow-[0_4px_0_#000]

                      active:translate-y-[5px]
                      active:shadow-[0_1px_0_#000]

                      ${
                        isPicked
                          ? "bg-[#ffd166] text-black"
                          : "bg-[#3f3f46] text-white hover:bg-[#52525b]"
                      }

                      disabled:opacity-60 disabled:cursor-not-allowed
                    `}
                  >
                    {word}

                    {isPicked && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse rounded-[14px]" />
                    )}
                  </button>
                )
              })}
            </div>

            {selected && (
              <div className="mt-5 text-xs text-zinc-400 font-semibold">
                Waiting for others...
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEWER */}
      {!isDrawer && (
        <div
          className="
            w-full max-w-md

            rounded-[28px]
            border-4 border-black

            bg-[#1f1f1f]
            shadow-[0_14px_0_#000]

            overflow-hidden
            text-center
            animate-fade-in
          "
        >
          <div
            className="
              h-3
              bg-[repeating-linear-gradient(45deg,#60a5fa_0px,#60a5fa_18px,#111827_18px,#111827_36px)]
              border-b-4 border-black
            "
          />

          <div className="p-6">
            <div className="text-xl font-black text-white">
              ✏️ {drawer?.name || "Someone"} is choosing a word
            </div>

            <div className="text-sm text-zinc-400 mt-2">
              Get ready guessing starts soon
            </div>

            <div className="mt-4 flex justify-center">
              <div className="w-10 h-10 border-4 border-t-transparent border-black rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

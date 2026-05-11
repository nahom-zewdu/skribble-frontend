// src/features/game/WordSelector.tsx
// This file defines the WordSelector component for the Skribble frontend application.
// The WordSelector is displayed to the drawer during the word selection phase, allowing them to choose a word from a list of options provided by the server.
// It checks if the selection deadline has passed and prevents multiple selections. When a word is selected, it sends a message to the server with the chosen word.

import { useState, useMemo } from "react"
import { useGameStore } from "../../store/gameStore"
import { socket } from "../../core/socket/websocket"

function isExpired(deadline?: string) {
  if (!deadline) return true
  return new Date(deadline).getTime() < Date.now()
}

export default function WordSelector({ isDrawer }: { isDrawer: boolean }) {
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
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">

      {/* Drawer UI */}
      {isDrawer && choices && choices.length > 0 && (
        <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-2xl flex gap-6 animate-fade-in">

          {choices.map((word) => (
            <button
              key={word}
              onClick={() => select(word)}
              disabled={!!selected}
              className="
                px-8 py-4 text-lg rounded-xl bg-slate-700
                hover:bg-blue-500 transition-all
                transform hover:scale-105
                disabled:opacity-50
              "
            >
              {word}
            </button>
          ))}

        </div>
      )}

      {/* Viewer UI */}
      {!isDrawer && (
        <div className="bg-slate-800 text-white px-10 py-6 rounded-2xl shadow-xl text-center animate-pulse">

          <div className="text-lg font-semibold">
            ✏️ {drawer?.name || "Player"} is choosing a word...
          </div>

          <div className="text-sm opacity-70 mt-2">
            Get ready to guess!
          </div>

        </div>
      )}

    </div>
  )
}

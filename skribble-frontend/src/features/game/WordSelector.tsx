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

export default function WordSelector() {
  const choices = useGameStore((s) => s.selectionChoices)
  const deadline = useGameStore((s) => s.selectionDeadline)

  const [selected, setSelected] = useState<string | null>(null)

  const expired = useMemo(() => isExpired(deadline), [deadline])

  function select(word: string) {
    if (selected) return // prevent double click
    if (expired) return

    setSelected(word)

    socket.send({
      type: "select_word",
      data: { word },
    })
  }

  if (!choices || choices.length === 0){
    console.log("No Choices Yet")
    return null
  }
  if (expired) {
    console.log("Expired")
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm">
      <div className="bg-slate-800 text-white p-8 rounded-xl shadow-xl flex gap-6">

        {choices.map((word) => (
          <button
            key={word}
            onClick={() => select(word)}
            className="
              px-8 py-4 text-lg rounded-lg bg-slate-700 hover:bg-blue-500
              transition-all transform hover:scale-105
            "
          >
            {word}
          </button>
        ))}

      </div>
    </div>
  )
}

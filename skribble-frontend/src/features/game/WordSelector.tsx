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

  if (!choices || choices.length === 0) return null
  if (expired) return null

  return (
    <div className="flex gap-4 mb-4">
      {choices.map((word) => {
        const isChosen = selected === word

        return (
          <button
            key={word}
            onClick={() => select(word)}
            disabled={!!selected}
            className={`
              px-4 py-2 border rounded
              ${isChosen ? "bg-green-500 text-white" : "bg-white"}
              ${selected ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {word}
          </button>
        )
      })}
    </div>
  )
}

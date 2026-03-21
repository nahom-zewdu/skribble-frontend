// src/features/game/WordSelector.tsx
// This file defines the WordSelector component for the Skribble frontend application.
// The WordSelector is displayed to the drawer during the word selection phase, allowing them to choose a word from a list of options provided by the server.
// When a word is selected, it sends a message to the server indicating the chosen word.

import { useGameStore } from "../../store/gameStore"
import { socket } from "../../core/socket/websocket"

export default function WordSelector() {
  const choices = useGameStore((s) => s.selectionChoices)

  if (!choices || choices.length === 0) return null

  function selectWord(word: string) {
    socket.send({
      type: "select_word",
      data: { word },
    })
  }

  return (
    <div className="flex gap-4 mb-4">
      {choices.map((word) => (
        <button
          key={word}
          onClick={() => selectWord(word)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {word}
        </button>
      ))}
    </div>
  )
}
// src/features/game/TurnResultModal.tsx
// This file defines the TurnResultModal component for the Skribble frontend application.
// The TurnResultModal is displayed at the end of each turn to show the correct word and the players' scores. 
// It retrieves the turn result and game phase from the game store and conditionally renders the modal when appropriate.

import { useMemo } from "react"
import { useGameStore } from "../../store/gameStore"

export default function TurnResultModal() {

  const turnResult = useGameStore((s) => s.turnResult)
  const phase = useGameStore((s) => s.phase)

  const players = useMemo(() => {
    if (!turnResult) return []

    return [...turnResult.players]
      .sort((a, b) => b.score - a.score)
  }, [turnResult])

  if (phase !== "turn_end" || !turnResult) {
    return null
  }

  return (
    <div
      className="
        absolute inset-0
        bg-black/70
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          w-full max-w-md
          bg-slate-900
          rounded-3xl
          p-6
          border border-slate-700
        "
      >

        <div className="text-center mb-6">

          <p className="text-slate-400 text-sm">
            The word was
          </p>

          <h2 className="text-4xl font-black text-white mt-2">
            {turnResult.word}
          </h2>

        </div>

        <div className="space-y-3">

          {players.map((player, index) => (
            <div
              key={player.id}
              className="
                flex items-center justify-between
                bg-slate-800
                rounded-2xl
                px-4 py-3
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-8 h-8
                    rounded-full
                    bg-slate-700
                    flex items-center justify-center
                    text-sm font-bold
                  "
                >
                  {index + 1}
                </div>

                <span className="font-medium text-white">
                  {player.name}
                </span>

              </div>

              <span
                className="
                  text-emerald-400
                  font-bold
                "
              >
                {player.score}
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

// src/features/game/TurnResultModal.tsx
// This file defines the TurnResultModal component for the Skribble frontend application.
// The TurnResultModal is displayed at the end of each turn to show the word that was drawn and the points scored by each player during that turn.
// It retrieves the turn result and game phase from the game store and conditionally renders the modal when appropriate.

import { useMemo } from "react"
import { useGameStore } from "../../store/gameStore"

export default function TurnResultModal() {
  const turnResult = useGameStore((s) => s.turnResult)
  const phase = useGameStore((s) => s.phase)

  const players = useMemo(() => {
    if (!turnResult) return []
    return [...turnResult.players].sort((a, b) => b.score - a.score)
  }, [turnResult])

  if (phase !== "turn_end" || !turnResult) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
      
      <div
        className="
          w-full max-w-lg
          rounded-[28px]
          border-4 border-black
          bg-[#1f1f1f]
          shadow-[0_14px_0_#000]
          overflow-hidden
        "
      >
        {/* Header stripe */}
        <div
          className="
            h-3
            bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_18px,#111827_18px,#111827_36px)]
            border-b-4 border-black
          "
        />

        <div className="p-5 sm:p-6">
          
          {/* WORD SECTION */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-zinc-400">
              The word was
            </p>

            <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white tracking-tight break-words">
              {turnResult.word}
            </h2>
          </div>

          {/* LEADERBOARD */}
          <div className="space-y-3">
            {players.map((player, index) => {
              const isTop = index === 0
              const isSecond = index === 1

              return (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between

                    px-3 py-3 sm:px-4 sm:py-3

                    rounded-[18px]
                    border-4 border-black

                    shadow-[0_5px_0_#000]

                    transition-all

                    ${
                      isTop
                        ? "bg-[#ffd166] text-black"
                        : isSecond
                        ? "bg-[#60a5fa] text-black"
                        : "bg-[#3f3f46] text-white"
                    }
                  `}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3 min-w-0">
                    
                    <div
                      className="
                        w-7 h-7 sm:w-8 sm:h-8
                        flex items-center justify-center
                        rounded-full
                        border-2 border-black
                        bg-black/10
                        text-[10px] sm:text-xs
                        font-black
                        shrink-0
                      "
                    >
                      #{index + 1}
                    </div>

                    <span
                      className="
                        font-black
                        text-sm sm:text-base
                        truncate
                        max-w-[160px] sm:max-w-[240px]
                      "
                    >
                      {player.name}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm font-black opacity-70">
                      score
                    </span>

                    <span className="text-base sm:text-xl font-black">
                      {player.score}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer hint */}
          <div className="mt-6 text-center text-[10px] sm:text-xs text-zinc-500 font-semibold">
            Next round starting soon...
          </div>
        </div>
      </div>
    </div>
  )
}

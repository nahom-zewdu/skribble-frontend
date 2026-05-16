// src/features/game/GameResultModal.tsx
// This file defines the GameResultModal component for the Skribble frontend application.
// The GameResultModal is displayed at the end of each game to show the winner and a leaderboard of all players based on their scores.
// It retrieves the game result and game phase from the game store and conditionally renders the modal when appropriate.

import { useMemo } from "react"
import { useGameStore } from "../../store/gameStore"

export default function GameResultModal() {
  const gameResult = useGameStore((s) => s.gameResult)
  const phase = useGameStore((s) => s.phase)

  const players = useMemo(() => {
    if (!gameResult) return []
    return [...gameResult.players].sort((a, b) => b.score - a.score)
  }, [gameResult])

  if (phase !== "game_end" || !gameResult) return null

  const winner = players[0]

  return (
    <div
      className="
        absolute inset-0 z-50
        flex items-center justify-center
        bg-black/80
        px-3
      "
    >
      <div
        className="
          w-full max-w-lg

          rounded-[28px]
          border-4 border-black

          bg-[#1f1f1f]
          shadow-[0_18px_0_#000]

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

        <div className="p-6 sm:p-8">

          {/* WINNER SECTION */}
          <div className="text-center mb-8">

            <div className="text-5xl sm:text-6xl mb-3 animate-bounce">
              👑
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {winner?.name}
            </h1>

            <p className="mt-2 text-sm sm:text-base font-semibold text-zinc-400">
              takes the victory
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border-4 border-black bg-[#ffd166] text-black font-black shadow-[0_5px_0_#000]">
              🏆 {winner?.score} points
            </div>

          </div>

          {/* LEADERBOARD */}
          <div className="space-y-3">
            {players.map((player, index) => {
              const isWinner = index === 0
              const isSecond = index === 1
              const isThird = index === 2

              return (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between

                    px-4 py-3

                    rounded-[18px]
                    border-4 border-black

                    shadow-[0_5px_0_#000]

                    transition-all

                    ${
                      isWinner
                        ? "bg-[#ffd166] text-black"
                        : isSecond
                        ? "bg-[#60a5fa] text-black"
                        : isThird
                        ? "bg-[#f472b6] text-black"
                        : "bg-[#3f3f46] text-white"
                    }
                  `}
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        w-8 h-8
                        flex items-center justify-center
                        rounded-full
                        border-2 border-black
                        bg-black/10
                        text-xs font-black
                        shrink-0
                      "
                    >
                      #{index + 1}
                    </div>

                    <span className="font-black text-sm sm:text-base truncate max-w-[200px]">
                      {player.name}
                    </span>

                    {isWinner && (
                      <span className="text-sm animate-bounce">
                        👑
                      </span>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="text-lg sm:text-xl font-black shrink-0">
                    {player.score}
                  </div>

                </div>
              )
            })}
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-center text-xs text-zinc-500 font-semibold">
            GG thanks for playing
          </div>

        </div>
      </div>
    </div>
  )
}

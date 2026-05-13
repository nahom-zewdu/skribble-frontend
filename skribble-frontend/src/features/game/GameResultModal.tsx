// src/features/game/GameResultModal.tsx
// This file defines the GameResultModal component for the Skribble frontend application.
// The GameResultModal is displayed at the end of the game to show the final standings of all players. 
// It retrieves the game result and game phase from the game store and conditionally renders the modal when appropriate.
import { useMemo } from "react"
import { useGameStore } from "../../store/gameStore"

export default function GameResultModal() {

  const gameResult = useGameStore((s) => s.gameResult)
  const phase = useGameStore((s) => s.phase)

  const players = useMemo(() => {

    if (!gameResult) return []

    return [...gameResult.players]
      .sort((a, b) => b.score - a.score)

  }, [gameResult])

  if (phase !== "game_end" || !gameResult) {
    return null
  }

  const winner = players[0]

  return (
    <div
      className="
        absolute inset-0
        bg-black/80
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          w-full max-w-lg
          bg-slate-900
          rounded-3xl
          p-8
          border border-slate-700
        "
      >

        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            👑
          </div>

          <h1 className="text-4xl font-black text-white">
            {winner?.name} Wins!
          </h1>

          <p className="text-slate-400 mt-3">
            Final Standings
          </p>

        </div>

        <div className="space-y-3">

          {players.map((player, index) => (
            <div
              key={player.id}
              className="
                flex items-center justify-between
                bg-slate-800
                rounded-2xl
                px-5 py-4
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-10 h-10
                    rounded-full
                    bg-slate-700
                    flex items-center justify-center
                    font-bold
                  "
                >
                  {index + 1}
                </div>

                <div>

                  <div className="text-white font-semibold">
                    {player.name}
                  </div>

                </div>

              </div>

              <div
                className="
                  text-2xl
                  font-black
                  text-emerald-400
                "
              >
                {player.score}
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

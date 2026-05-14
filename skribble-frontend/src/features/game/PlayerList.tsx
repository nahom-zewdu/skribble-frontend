// src/features/game/PlayerList.tsx
// This file defines the PlayerList component for the Skribble frontend application.
// The PlayerList displays the list of players currently in the game, along with their scores and indicates who the current drawer is.

import type { Player } from "../../core/socket/protocol"
import { useGameStore } from "../../store/gameStore"

type Props = {
  players: Player[]
}

export default function PlayerList({ players }: Props) {
  const drawerID = useGameStore((s) => s.drawerID)
  const roomID = useGameStore((s) => s.roomID)
  const recentGuess = useGameStore((s) => s.recentGuess)

  if (!players || players.length === 0) {
    return <div className="p-4">No players</div>
  }

  // Sort players by score (highest first)
  const sorted = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="p-4">
    <h2 className="font-bold mb-4 text-slate-300">Leaderboard</h2>

    <div className="flex flex-col gap-2">
      {sorted.map((p, i) => {
        const isDrawer = p.id === drawerID
        const isRecentGuesser = recentGuess?.playerID === p.id

        return (
          <div
            key={p.id}
            className={`
              relative overflow-hidden
              flex justify-between items-center
              p-3 rounded-2xl
              transition-all duration-500
              transition-transform duration-500

              ${
                isDrawer
                  ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-black shadow-lg"
                  : "bg-slate-700"
              }

              ${
                isRecentGuesser
                  ? "scale-[1.03] ring-2 ring-green-400 shadow-lg shadow-green-500/30"
                  : ""
              }
            `}
          >
            <div className="flex gap-2 items-center min-w-0">
              <span className="text-sm opacity-60">
                #{i + 1}
              </span>
              <span className="truncate font-semibold">
                {p.name}
              </span>
              {isDrawer && (
                <span className="animate-bounce">
                  ✏️
                </span>
              )}
            </div>

            <div className="relative">
              <span className="font-mono font-bold">
                {p.score}
              </span>
              {isRecentGuesser && (
                <div
                  className="
                    absolute
                    -top-5
                    left-1/2
                    -translate-x-1/2
                    text-green-400
                    font-black
                    text-sm
                    animate-score-pop
                    pointer-events-none
                  "
                >
                  +{recentGuess.score}
                </div>
              )}

            </div>
          </div>
        )
      })}
    </div>
    <button
      onClick={() => {
        const url = `${window.location.origin}/join/${roomID}`
        navigator.clipboard.writeText(url)
      }}
      className="
        mt-6 w-full
        px-4 py-3 rounded-lg
        bg-slate-700 hover:bg-slate-600
        text-sm transition
      ">
      📋 Invite Friends
    </button>
  </div>
  )
}

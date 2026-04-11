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

        return (
          <div
            key={p.id}
            className={`
              flex justify-between items-center p-3 rounded-lg transition-all
              ${isDrawer ? "bg-yellow-400 text-black" : "bg-slate-700"}
            `}
          >
            <div className="flex gap-2 items-center">
              <span className="text-sm opacity-60">#{i + 1}</span>
              <span>{p.name}</span>
              {isDrawer && " ✏️"}
            </div>

            <span className="font-mono">{p.score}</span>
          </div>
        )
      })}
    </div>
  </div>
  )
}

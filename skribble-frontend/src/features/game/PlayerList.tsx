// src/features/game/PlayerList.tsx
// This file defines the PlayerList component for the Skribble frontend application.
// The PlayerList displays the list of players currently in the game, along with their scores and indicates who the current drawer is.

import { useEffect, useState } from "react"

import type { Player } from "../../core/socket/protocol"
import { useGameStore } from "../../store/gameStore"

type Props = {
  players: Player[]
}

export default function PlayerList({ players }: Props) {
  const drawerID = useGameStore((s) => s.drawerID)
  const roomID = useGameStore((s) => s.roomID)
  const recentGuess = useGameStore((s) => s.recentGuess)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 1600)

    return () => clearTimeout(timeout)
  }, [copied])

  if (!players?.length) {
    return (
      <div className="p-4 text-slate-400">
        No players
      </div>
    )
  }

  const sorted = [...players].sort(
    (a, b) => b.score - a.score
  )

  return (
    <div className="relative p-4">

      {/* Floating Score Overlay */}
      {recentGuess && (
        <div
          key={recentGuess.id}
          className="
            pointer-events-none
            absolute
            left-1/2
            bottom-6
            z-30
            -translate-x-1/2
            animate-leaderboard-float
          "
        >
          <div
            className="
              rounded-2xl
              bg-slate-900/90
              backdrop-blur
              px-4 py-2
              shadow-2xl
              border border-slate-700
              text-center
            "
          >
            <div className="text-green-400 font-black text-xl">
              +{recentGuess.score}
            </div>

            {recentGuess.drawerPoints > 0 && (
              <div className="text-yellow-300 text-xs font-bold">
                Drawer +{recentGuess.drawerPoints}
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="font-bold mb-4 text-slate-300">
        Leaderboard
      </h2>

      <div className="flex flex-col gap-2">
        {sorted.map((p, i) => {
          const isDrawer = p.id === drawerID

          return (
            <div
              key={p.id}
              className={`
                flex justify-between items-center
                p-3 rounded-2xl
                transition-all duration-500

                ${
                  isDrawer
                    ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-black shadow-lg"
                    : "bg-slate-700"
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

              <span className="font-mono font-bold">
                {p.score}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => {
          const url = `${window.location.origin}/join/${roomID}`

          navigator.clipboard.writeText(url)

          setCopied(true)
        }}
        className="
          mt-6
          w-full
          px-4 py-3
          rounded-xl
          bg-slate-700
          hover:bg-slate-600
          active:scale-[0.98]
          transition-all
          font-semibold
        "
      >
        {copied
          ? "✅ Invite Link Copied"
          : "📋 Invite Friends"}
      </button>
    </div>
  )
}

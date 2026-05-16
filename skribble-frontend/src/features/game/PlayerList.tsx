// src/features/game/PlayerList.tsx
// This file defines the PlayerList component for the Skribble frontend application.
// The PlayerList displays the list of players currently in the game,
// along with their scores and indicates who the current drawer is.

import { useEffect, useMemo, useState } from "react"

import type { Player } from "../../core/socket/protocol"
import { useGameStore } from "../../store/gameStore"

type Props = {
  players: Player[]
}

type FloatingBubble = {
  id: string
  playerID: string
  score: number
  drawerPoints: number
}

export default function PlayerList({ players }: Props) {
  const drawerID = useGameStore((s) => s.drawerID)
  const roomID = useGameStore((s) => s.roomID)
  const recentGuess = useGameStore((s) => s.recentGuess)

  const [copied, setCopied] = useState(false)

  const [bubbles, setBubbles] = useState<FloatingBubble[]>([])

  // -----------------------------------
  // Floating leaderboard score bubbles
  // -----------------------------------
  useEffect(() => {
    if (!recentGuess) return

    const bubble: FloatingBubble = {
      id: crypto.randomUUID(),
      playerID: recentGuess.playerID,
      score: recentGuess.score,
      drawerPoints: recentGuess.drawerPoints ?? 0,
    }

    setBubbles((prev) => [...prev, bubble])

    const timeout = setTimeout(() => {
      setBubbles((prev) =>
        prev.filter((b) => b.id !== bubble.id)
      )
    }, 2400)

    return () => clearTimeout(timeout)
  }, [recentGuess])

  // -----------------------------------
  // Invite copied state
  // -----------------------------------
  useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 1600)

    return () => clearTimeout(timeout)
  }, [copied])

  // -----------------------------------
  // Sorted players with stable memo
  // -----------------------------------
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (b.score === a.score) {
        return a.name.localeCompare(b.name)
      }

      return b.score - a.score
    })
  }, [players])

  if (!players?.length) {
    return (
      <div className="p-4 text-slate-400">
        No players
      </div>
    )
  }

  return (
    <div className="relative p-4 overflow-hidden">

      {/* -------------------------------- */}
      {/* Floating Score Layer */}
      {/* -------------------------------- */}
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">

        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="
              absolute
              left-1/2
              bottom-4
              -translate-x-1/2
              animate-score-bubble-rise
            "
          >

            <div
              className="
                flex flex-col items-center
                gap-1
              "
            >

              {/* Main score */}
              <div
                className="
                  px-5 py-3
                  rounded-full
                  bg-green-500/20
                  border border-green-400/40
                  backdrop-blur-md
                  shadow-[0_0_40px_rgba(34,197,94,0.35)]
                "
              >
                <div
                  className="
                    text-3xl
                    font-black
                    text-green-300
                    tracking-wide
                  "
                >
                  +{bubble.score}
                </div>
              </div>

              {/* Drawer bonus */}
              {bubble.drawerPoints > 0 && (
                <div
                  className="
                    px-3 py-1
                    rounded-full
                    bg-yellow-400/10
                    border border-yellow-300/20
                    text-yellow-200
                    text-xs
                    font-bold
                    tracking-wide
                  "
                >
                  Drawer +{bubble.drawerPoints}
                </div>
              )}

            </div>

          </div>
        ))}

      </div>

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}
      <h2 className="font-bold mb-4 text-slate-300">
        Leaderboard
      </h2>

      {/* -------------------------------- */}
      {/* Players */}
      {/* -------------------------------- */}
      <div className="flex flex-col gap-2">

        {sortedPlayers.map((p, i) => {
          const isDrawer = p.id === drawerID
          const isScored =
            recentGuess?.playerID === p.id

          return (
            <div
              key={p.id}
              className={`
                relative
                overflow-hidden

                flex justify-between items-center

                p-3 rounded-2xl

                transition-all
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]

                transform-gpu

                ${
                  isDrawer
                    ? `
                      bg-gradient-to-r
                      from-yellow-300
                      to-amber-400
                      text-black
                      shadow-lg
                    `
                    : `
                      bg-slate-700
                      text-white
                    `
                }

                ${
                  isScored
                    ? `
                      scale-[1.03]
                      ring-2
                      ring-green-400/70
                      shadow-[0_0_30px_rgba(34,197,94,0.25)]
                    `
                    : ""
                }
              `}
              style={{
                transitionProperty:
                  "transform, background-color, box-shadow",
              }}
            >

              {/* Animated glow */}
              {isScored && (
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-green-400/10
                    via-green-300/20
                    to-green-400/10
                    animate-pulse
                  "
                />
              )}

              {/* Left */}
              <div className="relative flex gap-2 items-center min-w-0">

                <div
                  className="
                    w-7 h-7
                    rounded-full
                    flex items-center justify-center
                    text-xs font-black
                    bg-black/10
                  "
                >
                  #{i + 1}
                </div>

                <span className="truncate font-semibold">
                  {p.name}
                </span>

                {isDrawer && (
                  <span
                    className="
                      animate-bounce
                      text-lg
                    "
                  >
                    ✏️
                  </span>
                )}

              </div>

              {/* Right */}
              <div className="relative flex items-center">

                <span
                  className="
                    font-mono
                    font-black
                    text-lg
                    tracking-wide
                  "
                >
                  {p.score}
                </span>

              </div>

            </div>
          )
        })}

      </div>

      {/* -------------------------------- */}
      {/* Invite */}
      {/* -------------------------------- */}
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

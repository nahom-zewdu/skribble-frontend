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

  const [bubbles, setBubbles] = useState<
    FloatingBubble[]
  >([])

  // -----------------------------------
  // Floating score bubbles
  // -----------------------------------
  useEffect(() => {
    if (!recentGuess) return

    const bubble: FloatingBubble = {
      id: crypto.randomUUID(),
      playerID: recentGuess.playerID,
      score: recentGuess.score,
      drawerPoints:
        recentGuess.drawerPoints ?? 0,
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
    }, 1700)

    return () => clearTimeout(timeout)
  }, [copied])

  // -----------------------------------
  // Stable sorting
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
      <div className="p-4 text-zinc-400">
        No players
      </div>
    )
  }

  return (
    <div
      className="
        relative
        h-full
        overflow-hidden
        bg-[#1f1f1f]
      "
    >

      {/* Top decorative stripe */}
      <div
        className="
          h-3
          border-b-4 border-black
          bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_16px,#18181b_16px,#18181b_32px)]
        "
      />

      {/* Background pattern */}
      <div
        className="
          absolute inset-0
          opacity-[0.04]
          pointer-events-none
          [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
          [background-size:24px_24px]
        "
      />

      {/* Floating bubbles */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          z-40
          overflow-hidden
        "
      >
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="
              absolute
              left-1/2
              bottom-5
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

              {/* Score */}
              <div
                className="
                  rounded-full
                  border-4 border-black
                  bg-[#4ade80]
                  px-4 py-2
                  shadow-[0_5px_0_#000]
                "
              >
                <div
                  className="
                    text-lg sm:text-2xl
                    font-black
                    text-black
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
                    rounded-full
                    border-2 border-black
                    bg-[#ffd166]
                    px-3 py-1
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wide
                    text-black
                    shadow-[0_3px_0_#000]
                  "
                >
                  drawer +
                  {bubble.drawerPoints}
                </div>
              )}

            </div>

          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className="
          relative z-10
          flex h-full flex-col
          min-w-0
        "
      >

        {/* Header */}
        <div
          className="
            px-3 pt-3 pb-2
            flex items-center justify-between
            gap-2
          "
        >

          <div>

            <div
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]
                text-zinc-500
              "
            >
              live ranking
            </div>

            <h2
              className="
                text-xl
                sm:text-2xl
                font-black
                tracking-tight
                text-white
              "
            >
              Leaderboard
            </h2>

          </div>

          <div
            className="
              rounded-full
              border-4 border-black
              bg-[#ffd166]
              px-3 py-1
              text-xs
              font-black
              text-black
              shadow-[0_4px_0_#000]
              shrink-0
            "
          >
            {players.length}
            P
          </div>

        </div>

        {/* Players */}
        <div
          className="
            flex-1
            overflow-y-auto
          "
        >

          <div className="flex flex-col">

            {sortedPlayers.map((p, i) => {
              const isDrawer =
                p.id === drawerID

              const isScored =
                recentGuess?.playerID === p.id

              return (
                <div
                  key={p.id}
                  className={`
                    relative
                    overflow-hidden

                    flex items-center

                    min-w-0

                    border-b-2 border-black

                    px-1.5 py-1

                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    ${
                      isDrawer
                        ? `
                          bg-[#ffd166]
                          text-black
                        `
                        : i === 0
                        ? `
                          bg-[#60a5fa]
                          text-black
                        `
                        : i === 1
                        ? `
                          bg-[#f472b6]
                          text-black
                        `
                        : `
                          bg-[#3f3f46]
                          text-white
                        `
                    }

                    ${
                      isScored
                        ? `
                          scale-[1.01]
                        `
                        : ""
                    }
                  `}
                >

                  {/* score flash */}
                  {isScored && (
                    <div
                      className="
                        absolute inset-0
                        bg-white/10
                        animate-pulse
                      "
                    />
                  )}

                  {/* Rank */}
                  <div
                    className="
                      relative
                      shrink-0

                      w-[26px]

                      text-center

                      text-[10px]
                      sm:text-[11px]

                      font-black
                      opacity-80
                    "
                  >
                    #{i + 1}
                  </div>

                  {/* Name */}
                  <div
                    className="
                      relative

                      flex-1
                      min-w-0

                      flex items-center
                      gap-1
                    "
                  >

                    <span
                      className="
                        block

                        min-w-0

                        overflow-hidden
                        text-ellipsis
                        whitespace-nowrap

                        text-[11px]
                        sm:text-xs
                        lg:text-sm

                        font-black
                        leading-none
                      "
                    >
                      {p.name}
                    </span>

                    {isDrawer && (
                      <span
                        className="
                          shrink-0
                          text-[10px]
                          sm:text-xs
                        "
                      >
                        ✏️
                      </span>
                    )}

                  </div>

                  {/* Score */}
                  <div
                    className="
                      relative

                      shrink-0

                      ml-1

                      min-w-[34px]

                      text-right

                      text-[10px]
                      sm:text-xs

                      font-black
                      leading-none
                    "
                  >
                    {p.score}
                  </div>

                </div>
              )
            })}

          </div>

        </div>

        {/* Invite button */}
        <button
          onClick={() => {
            const url = `${window.location.origin}/join/${roomID}`

            navigator.clipboard.writeText(url)

            setCopied(true)
          }}
          className="
            mx-2 mb-2 mt-3

            rounded-[18px]
            border-4 border-black

            bg-[#4ade80]

            px-4 py-3

            text-sm
            sm:text-base
            font-black
            uppercase
            tracking-wide
            text-black

            shadow-[0_5px_0_#000]

            transition-all

            hover:translate-y-[2px]
            hover:shadow-[0_3px_0_#000]

            active:translate-y-[4px]
            active:shadow-[0_1px_0_#000]
          "
        >
          {copied
            ? "Invite Copied!"
            : "Invite Friends"}
        </button>

      </div>

    </div>
  )
}

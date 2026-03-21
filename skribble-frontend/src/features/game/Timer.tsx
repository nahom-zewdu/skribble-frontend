// src/features/game/Timer.tsx
// This file defines the Timer component for the Skribble frontend application.
// The Timer displays the remaining time for the current phase of the game (e.g., word selection, drawing, turn end, game end) based on deadlines provided by the server.
// It uses a useEffect hook to update the remaining time every 250 milliseconds and displays it in seconds. If there is no active phase or if the phase is "waiting", it returns null and does not render anything.

import { useEffect, useState } from "react"
import { useGameStore } from "../../store/gameStore"

function getRemaining(deadline?: string): number {
  if (!deadline) return 0
  const end = new Date(deadline).getTime()
  const now = Date.now()
  return Math.max(0, Math.floor((end - now) / 1000))
}

export default function Timer() {
  const phase = useGameStore((s) => s.phase)
  const selectionDeadline = useGameStore((s) => s.selectionDeadline)
  const playDeadline = useGameStore((s) => s.playDeadline)
  const nextTurnStartTime = useGameStore((s) => s.nextTurnStartTime)
  const restartTime = useGameStore((s) => s.restartTime)

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      let remaining = 0

      switch (phase) {
        case "word_selection":
          remaining = getRemaining(selectionDeadline)
          break
        case "drawing":
          remaining = getRemaining(playDeadline)
          break
        case "turn_end":
          remaining = getRemaining(nextTurnStartTime)
          break
        case "game_end":
          remaining = getRemaining(restartTime)
          break
        default:
          remaining = 0
      }

      setSeconds(remaining)
    }, 250)

    return () => clearInterval(interval)
  }, [phase, selectionDeadline, playDeadline, nextTurnStartTime, restartTime])

  if (!phase || phase === "waiting") return null

  return (
    <div className="text-xl font-bold mb-2">
      ⏱ {seconds}s
    </div>
  )
}

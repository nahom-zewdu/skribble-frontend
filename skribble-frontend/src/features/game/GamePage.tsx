// src/features/game/GamePage.tsx
// This file defines the GamePage component for the Skribble frontend application.
// The GamePage displays the game canvas and a sidebar with player information.
// It uses the Zustand game store to access the current game state and player list, and renders them accordingly.
import { useGameStore } from "../../store/gameStore"

export default function GamePage() {
  const players = useGameStore((s) => s.players)

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3 bg-gray-200">
        Canvas here
      </div>

      <div className="border-l p-4">
        <h2>Players</h2>

        {players.map((p) => (
          <div key={p.id}>
            {p.name} — {p.score}
          </div>
        ))}
      </div>
    </div>
  )
}

// src/features/game/GamePage.tsx
// This file defines the GamePage component for the Skribble frontend application.
// The GamePage is the main interface for the game, displaying the canvas, chat, player list, and other relevant information based on the current game phase.
// It initializes the message handler to listen for updates from the server and renders different components based on whether the user is the drawer or a guesser.
import { useGameStore } from "../../store/gameStore"

import CanvasBoard from "./CanvasBoard"
import ChatBox from "./ChatBox"
import PlayerList from "./PlayerList"
import WordSelector from "./WordSelector"
import Timer from "./Timer"

export default function GamePage() {
  const phase = useGameStore((s) => s.phase)
  const drawerID = useGameStore((s) => s.drawerID)
  const players = useGameStore((s) => s.players)
  const turnNumber = useGameStore((s) => s.turnNumber)

  const selfID = useGameStore((s) => s.selfID)
  const isDrawer = drawerID === selfID

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">

      {/* 🔝 TOP BAR */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-800 border-b border-slate-700">

        <div className="text-lg font-bold">
          Turn #{turnNumber}
        </div>

        <Timer />

        <div className="font-mono tracking-widest text-xl">
          {/* masked word goes here */}
        </div>
      </div>

      {/* 🔽 MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <PlayerList players={players ?? []} />
        </aside>

        {/* CENTER */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">

          {phase === "word_selection" && isDrawer && (
            <WordSelector key={turnNumber} />
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <CanvasBoard />
          </div>

        </main>

        {/* RIGHT */}
        <aside className="w-80 bg-slate-800 border-l border-slate-700">
          <ChatBox />
        </aside>

      </div>
    </div>
  )
}

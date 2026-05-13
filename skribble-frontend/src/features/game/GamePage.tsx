// src/features/game/GamePage.tsx
// This file defines the GamePage component for the Skribble frontend application.
// The GamePage is the main interface for the game, displaying the canvas, chat, player list, and other relevant information based on the current game phase.
// It initializes the message handler to listen for updates from the server and renders different components based on whether the user is the drawer or a guesser.
import { useGameStore } from "../../store/gameStore"

import TurnResultModal from "./TurnResultModal"
import GameResultModal from "./GameResultModal"
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

  const maskedWord = useGameStore((s) => s.maskedWord)
  const wordLengthHint = useGameStore((s) => s.wordLengthHint)
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">

      {/* 🔝 TOP BAR */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-800 border-b border-slate-700">

        {/* LEFT */}
        <div className="w-32 flex justify-start">
          <Timer />
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center px-8">

          <div
            className={
              `
              flex items-center gap-4
              px-5 py-2
              rounded-2xl
              bg-slate-800/80
              border border-slate-700
              shadow-lg
              backdrop-blur-sm
              min-w-[320px]
              justify-center
              transition-all duration-300
              ${phase === "drawing" ? "opacity-100" : "opacity-60"}
            `
            }
          >

            {/* MASKED WORD */}
            <div
              key={maskedWord}
              className="
                hint-reveal
                text-2xl font-black uppercase
                tracking-[0.25em]
                text-white
                transition-all duration-500
                select-none
              "
            >
              {maskedWord || ""}
            </div>

            {/* WORD LENGTH */}
            {wordLengthHint && (
              <div
                key={wordLengthHint}
                className="
                  hint-reveal
                  px-3 py-1
                  rounded-full
                  bg-slate-700
                  border border-slate-600
                  text-slate-300
                  text-sm
                  font-bold
                  tracking-wide
                  whitespace-nowrap
                  transition-all duration-300
                  select-none
                "
              >
                {wordLengthHint}
              </div>
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="w-32 flex justify-end">
          <div className="text-lg font-bold">
            Turn #{turnNumber}
          </div>
        </div>

      </div>

      {/* 🔽 MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <PlayerList players={players ?? []} />
        </aside>

        {/* CENTER */}
        <main className="flex-1 flex items-center justify-center p-4">

          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">

            <CanvasBoard />

            {phase === "word_selection" && (
              <WordSelector
                key={turnNumber}
                isDrawer={isDrawer}
              />
            )}

          </div>

        </main>

        {/* RIGHT */}
        <aside className="w-80 bg-slate-800 border-l border-slate-700">
          <ChatBox />
        </aside>

      </div>
      <TurnResultModal />
      <GameResultModal />
    </div>
  )
}

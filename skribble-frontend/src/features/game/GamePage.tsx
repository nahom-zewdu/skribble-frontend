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
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">

      {/* 🔝 TOP BAR */}
      <div
        className="
          h-16 shrink-0
          flex items-center justify-between
          px-3 sm:px-6
          bg-slate-800
          border-b border-slate-700
        "
      >

        {/* LEFT */}
        <div className="w-20 sm:w-32 flex justify-start">
          <Timer />
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center px-2 sm:px-8">

          <div
            className={`
              flex items-center gap-2 sm:gap-4
              px-3 sm:px-5
              py-2
              rounded-2xl
              bg-slate-800/80
              border border-slate-700
              shadow-lg
              backdrop-blur-sm
              max-w-full
              overflow-hidden
              transition-all duration-300
              ${phase === "drawing" ? "opacity-100" : "opacity-60"}
            `}
          >

            {/* MASKED WORD */}
            <div
              key={maskedWord}
              className="
                hint-reveal
                text-sm sm:text-2xl
                font-black uppercase
                tracking-[0.18em] sm:tracking-[0.25em]
                text-white
                whitespace-nowrap
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
                  px-2 sm:px-3
                  py-1
                  rounded-full
                  bg-slate-700
                  border border-slate-600
                  text-slate-300
                  text-[10px] sm:text-sm
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
        <div className="w-20 sm:w-32 flex justify-end">
          <div className="text-sm sm:text-lg font-bold whitespace-nowrap">
            Turn #{turnNumber}
          </div>
        </div>

      </div>

      {/* 🔽 MAIN AREA */}
      <div
        className="
          flex-1
          overflow-hidden

          flex flex-col
          lg:flex-row
        "
      >

        {/* CENTER CANVAS */}
        <main
          className="
            flex-1
            flex items-center justify-center
            p-2 sm:p-4
            min-h-0
          "
        >

          <div
            className="
              relative
              bg-white
              rounded-xl
              shadow-lg
              overflow-hidden

              w-full
              max-w-[1000px]
            "
          >

            <CanvasBoard />

            {phase === "word_selection" && (
              <WordSelector
                key={turnNumber}
                isDrawer={isDrawer}
              />
            )}

          </div>

        </main>

        {/* MOBILE BOTTOM SECTION */}
        <div
          className="
            lg:hidden

            h-[40vh]
            min-h-[320px]

            grid grid-cols-2
            border-t border-slate-700
          "
        >

          {/* LEADERBOARD */}
          <aside
            className="
              bg-slate-800
              border-r border-slate-700
              overflow-y-auto
            "
          >
            <PlayerList players={players ?? []} />
          </aside>

          {/* CHAT */}
          <aside
            className="
              bg-slate-800
              overflow-hidden
            "
          >
            <ChatBox />
          </aside>

        </div>

        {/* DESKTOP LEFT */}
        <aside
          className="
            hidden lg:block
            w-64
            bg-slate-800
            border-r border-slate-700
            overflow-y-auto
            order-first
          "
        >
          <PlayerList players={players ?? []} />
        </aside>

        {/* DESKTOP RIGHT */}
        <aside
          className="
            hidden lg:block
            w-80
            bg-slate-800
            border-l border-slate-700
            overflow-hidden
          "
        >
          <ChatBox />
        </aside>

      </div>

      <TurnResultModal />
      <GameResultModal />
    </div>
  )
}

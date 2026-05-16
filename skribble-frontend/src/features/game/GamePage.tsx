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
    <div
      className="
        relative
        h-screen
        overflow-hidden
        bg-[#171717]
        text-white
      "
    >

      {/* Background */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_top,rgba(255,184,77,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.10),transparent_30%)]
        "
      />

      {/* Grid */}
      <div
        className="
          absolute inset-0
          opacity-[0.05]
          pointer-events-none
          [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]
          [background-size:34px_34px]
        "
      />

      {/* Glow */}
      <div
        className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[320px]
          rounded-full
          bg-yellow-300/10
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          relative z-10
          h-full
          flex flex-col
        "
      >

        {/* TOP BAR */}
        <header
          className="
            shrink-0
            px-3 py-3
            sm:px-5
          "
        >

          <div
            className="
              h-[82px]

              rounded-[28px]
              border-4 border-black

              bg-[#262626]

              shadow-[0_8px_0_#000]

              px-4 sm:px-6

              flex items-center justify-between
              gap-3
            "
          >

            {/* LEFT */}
            <div
              className="
                min-w-[90px]
                sm:min-w-[130px]
                flex justify-start
              "
            >
              <div
                className="
                  rounded-[18px]
                  border-4 border-black
                  bg-[#ffd166]
                  px-4 py-2
                  shadow-[0_4px_0_#000]
                "
              >
                <Timer />
              </div>
            </div>

            {/* CENTER */}
            <div
              className="
                flex-1
                flex justify-center
                min-w-0
              "
            >

              <div
                className={`
                  relative
                  overflow-hidden

                  flex items-center
                  gap-2 sm:gap-4

                  px-4 sm:px-6
                  py-3

                  rounded-[24px]
                  border-4 border-black

                  shadow-[0_6px_0_#000]

                  transition-all duration-300

                  ${
                    phase === "drawing"
                      ? "bg-[#f4f4f5]"
                      : "bg-[#3f3f46]"
                  }
                `}
              >

                {/* shine */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-white/0
                    via-white/10
                    to-white/0
                    translate-x-[-100%]
                    animate-[shine_5s_linear_infinite]
                  "
                />

                {/* WORD */}
                <div
                  key={maskedWord}
                  className={`
                    relative z-10
                    hint-reveal

                    font-black
                    uppercase

                    whitespace-nowrap

                    tracking-[0.18em]
                    sm:tracking-[0.28em]

                    text-sm
                    sm:text-2xl

                    ${
                      phase === "drawing"
                        ? "text-black"
                        : "text-zinc-200"
                    }
                  `}
                >
                  {maskedWord || "WAITING"}
                </div>

                {/* WORD LENGTH */}
                {wordLengthHint && (
                  <div
                    key={wordLengthHint}
                    className="
                      relative z-10

                      rounded-full
                      border-4 border-black

                      bg-[#ffd166]

                      px-3 py-1

                      text-[10px]
                      sm:text-sm

                      font-black
                      tracking-wide
                      text-black

                      shadow-[0_3px_0_#000]

                      whitespace-nowrap
                    "
                  >
                    {wordLengthHint}
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT */}
            <div
              className="
                min-w-[90px]
                sm:min-w-[130px]

                flex justify-end
              "
            >

              <div
                className="
                  rounded-[18px]
                  border-4 border-black
                  bg-[#60a5fa]

                  px-4 py-2

                  shadow-[0_4px_0_#000]

                  text-black
                  font-black
                  text-sm sm:text-base

                  whitespace-nowrap
                "
              >
                TURN #{turnNumber}
              </div>

            </div>

          </div>

        </header>

        {/* MAIN AREA */}
        <div
          className="
            flex-1
            min-h-0

            px-3 pb-3
            sm:px-5 sm:pb-5

            flex flex-col
            lg:flex-row

            gap-3
            sm:gap-5
          "
        >

          {/* LEFT PANEL */}
          <aside
            className="
              hidden lg:flex
              lg:flex-col

              w-[300px]
              xl:w-[320px]

              shrink-0
              min-h-0

              rounded-[28px]
              border-4 border-black

              bg-[#262626]

              shadow-[0_10px_0_#000]

              overflow-hidden min-w-0
            "
          >
            <PlayerList players={players ?? []} />
          </aside>

          {/* CENTER */}
          <main
            className="
              flex-1
              min-h-0

              flex flex-col
            "
          >

            <div
              key={`${turnNumber}-${phase}`}
              className="
                animate-canvas-enter

                relative

                flex-1
                min-h-0

                rounded-[34px]
                border-4 border-black

                bg-[#262626]

                shadow-[0_10px_0_#000]

                overflow-hidden
              "
            >

              {/* top stripe */}
              <div
                className="
                  h-3
                  bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_18px,#111827_18px,#111827_36px)]
                "
              />

              <div className="h-[calc(100%-12px)]">
                <CanvasBoard />
              </div>

              {phase === "word_selection" && (
                <WordSelector
                  key={turnNumber}
                  isDrawer={isDrawer}
                />
              )}

            </div>

          </main>

          {/* RIGHT PANEL */}
          <aside
            className="
              hidden lg:flex

              w-[340px]
              shrink-0

              rounded-[30px]
              border-4 border-black

              bg-[#262626]

              shadow-[0_10px_0_#000]

              overflow-hidden
            "
          >
            <ChatBox />
          </aside>

          {/* MOBILE PANELS */}
          <div
            className="
              lg:hidden

              grid
              grid-cols-2

              gap-3

              h-[38vh]
              min-h-[320px]
            "
          >

            {/* Mobile Leaderboard */}
            <div
              className="
                rounded-[24px]
                border-4 border-black

                bg-[#262626]

                shadow-[0_7px_0_#000]

                overflow-hidden
              "
            >
              <PlayerList players={players ?? []} />
            </div>

            {/* Mobile Chat */}
            <div
              className="
                rounded-[24px]
                border-4 border-black

                bg-[#262626]

                shadow-[0_7px_0_#000]

                overflow-hidden
              "
            >
              <ChatBox />
            </div>

          </div>

        </div>

      </div>

      <TurnResultModal />
      <GameResultModal />
    </div>
  )
}

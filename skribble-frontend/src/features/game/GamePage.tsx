// src/features/game/GamePage.tsx
// This file defines the GamePage component for the Skribble frontend application.
// The GamePage is the main interface for the game, displaying the canvas, chat, player list, and other relevant information based on the current game phase.
// It initializes the message handler to listen for updates from the server and renders different components based on whether the user is the drawer or a guesser.
import { useEffect } from "react"
import { socket } from "../../core/socket/websocket"
import { initMessageHandler } from "../../core/socket/messageHandler"

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

  const selfID = socket.clientID()

  useEffect(() => {
    initMessageHandler()
  }, [])

  const isDrawer = selfID && drawerID === selfID

  return (
    <div className="game-layout">

      <aside className="left-panel">
        <PlayerList players={players} />
      </aside>

      <main className="center-panel">

        <Timer />

        {phase === "word_selection" && isDrawer && <WordSelector />}

        <CanvasBoard />

      </main>

      <aside className="right-panel">
        <ChatBox />
      </aside>

    </div>
  )
}

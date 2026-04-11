// src/features/lobby/JoinPage.tsx
// This file defines the JoinPage component for the Skribble frontend application.
// The JoinPage allows users to enter their name and a room ID to join a game.
// Upon joining, it establishes a WebSocket connection to the server and initializes the message handler to listen for game updates.
import { useState } from "react"
import { socket } from "../../core/socket/websocket"
import { initMessageHandler } from "../../core/socket/messageHandler"
import { useNavigate } from "react-router-dom"

export default function JoinPage() {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const navigate = useNavigate()

  function join() {
    initMessageHandler()
    socket.connect(name, room)
    navigate("/game")
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white">

      <div className="bg-slate-800 p-8 rounded-xl shadow-lg flex flex-col gap-4 w-80">

        <h1 className="text-2xl font-bold text-center">🎨 Skribble</h1>

        <input
          className="p-3 rounded bg-slate-700 outline-none focus:ring-2 ring-blue-500"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="p-3 rounded bg-slate-700 outline-none focus:ring-2 ring-blue-500"
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 transition p-3 rounded font-bold"
          onClick={join}
        >
          Join Game
        </button>

      </div>
    </div>
  )
}

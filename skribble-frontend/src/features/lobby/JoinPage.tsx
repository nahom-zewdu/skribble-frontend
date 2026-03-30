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
    initMessageHandler()
    navigate("/game")
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <input
        className="border p-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2"
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={join}
      >
        Join Game
      </button>
    </div>
  )
}

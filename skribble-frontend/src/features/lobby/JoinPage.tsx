// src/features/lobby/JoinPage.tsx
// This file defines the JoinPage component, which is the landing page for the Skribble game. 
// It allows users to enter their name and optionally a room ID to join a private game. 
// Users can also choose to play in public matchmaking. 
// The component manages the connection to the game server via the GameSocket and initializes the message handler for incoming messages.

import { useState } from "react"
import { socket } from "../../core/socket/websocket"
import { initMessageHandler } from "../../core/socket/messageHandler"
import { useNavigate } from "react-router-dom"

export default function JoinPage() {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")

  const navigate = useNavigate()

  function connect(
    mode: "public" | "private_create" | "private_join"
  ) {
    const trimmedName = name.trim()
    const trimmedRoom = room.trim().toUpperCase()

    if (!trimmedName) return

    // joining private room requires room id
    if (mode === "private_join" && !trimmedRoom) {
      return
    }

    initMessageHandler()

    socket.connect(
      trimmedName,
      mode,
      trimmedRoom || undefined,
    )

    navigate("/game")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">

          <div className="text-6xl mb-4">
            🎨
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Skribble
          </h1>

          <p className="text-slate-400 mt-3">
            Draw. Guess. Win.
          </p>

        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl">

          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Your Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="
                  w-full p-4 rounded-xl
                  bg-slate-700
                  border border-slate-600
                  outline-none
                  focus:border-blue-500
                  transition
                "
              />
            </div>

            {/* Room ID */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Private Room ID
              </label>

              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Optional"
                className="
                  w-full p-4 rounded-xl
                  bg-slate-700
                  border border-slate-600
                  outline-none
                  focus:border-blue-500
                  transition
                "
              />

              <p className="text-xs text-slate-500 mt-2">
                Leave empty to join public matchmaking
              </p>
            </div>

          </div>

          {/* Public */}
          <button
            onClick={() => connect("public")}
            className="
              w-full mt-6
              bg-blue-500 hover:bg-blue-600
              transition
              rounded-2xl
              py-4
              font-bold
              text-lg
            "
          >
            Play Public
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">

            <div className="h-px bg-slate-700 flex-1" />

            <span className="text-slate-500 text-sm">
              PRIVATE
            </span>

            <div className="h-px bg-slate-700 flex-1" />

          </div>

          {/* Private Buttons */}
          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => connect("private_join")}
              className="
                bg-slate-700 hover:bg-slate-600
                transition
                rounded-2xl
                py-4
                font-semibold
              "
            >
              Join Room
            </button>

            <button
              onClick={() => connect("private_create")}
              className="
                bg-emerald-500 hover:bg-emerald-600
                transition
                rounded-2xl
                py-4
                font-semibold
              "
            >
              Create Room
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

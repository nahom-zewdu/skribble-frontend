// src/features/lobby/JoinPage.tsx
// This file defines the JoinPage component, which is the landing page for the Skribble game. 
// It allows users to enter their name and optionally a room ID to join a private game. 
// Users can also choose to play in public matchmaking. 
// The component manages the connection to the game server via the GameSocket and initializes the message handler for incoming messages.

import { useMemo, useState } from "react"
import { socket } from "../../core/socket/websocket"
import { initMessageHandler } from "../../core/socket/messageHandler"
import { useNavigate, useParams } from "react-router-dom"

export default function JoinPage() {
  const navigate = useNavigate()

  const { roomID } = useParams()

  // invite link room
  const inviteRoomID = useMemo(
    () => roomID?.trim().toUpperCase() ?? "",
    [roomID]
  )

  const isInviteJoin = !!inviteRoomID

  const [name, setName] = useState("")
  const [room, setRoom] = useState(inviteRoomID)

  function connect(
    mode: "public" | "private_create" | "private_join"
  ) {
    const trimmedName = name.trim()
    const trimmedRoom = room.trim().toUpperCase()

    if (!trimmedName) {
      return
    }

    // joining via room ID requires room
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

          {/* Invite Banner */}
          {isInviteJoin && (
            <div className="
              mb-5
              rounded-2xl
              border border-blue-500/30
              bg-blue-500/10
              p-4
            ">
              <p className="text-sm text-blue-300 font-medium">
                You were invited to join room:
              </p>

              <p className="mt-1 text-xl font-bold tracking-widest">
                {inviteRoomID}
              </p>
            </div>
          )}

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
                Room ID
              </label>

              <input
                value={room}
                onChange={(e) => setRoom(e.target.value.toUpperCase())}
                placeholder="Optional"
                disabled={isInviteJoin}
                className={`
                  w-full p-4 rounded-xl
                  border outline-none transition
                  ${
                    isInviteJoin
                      ? "bg-slate-600 border-slate-600 text-slate-300 cursor-not-allowed"
                      : "bg-slate-700 border-slate-600 focus:border-blue-500"
                  }
                `}
              />

              {!isInviteJoin && (
                <p className="text-xs text-slate-500 mt-2">
                  Leave empty to join public matchmaking
                </p>
              )}

            </div>

          </div>

          {/* Invite Join Flow */}
          {isInviteJoin ? (

            <button
              onClick={() => connect("private_join")}
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
              Join Room
            </button>

          ) : (

            <>
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
                  ROOM OPTIONS
                </span>

                <div className="h-px bg-slate-700 flex-1" />

              </div>

              {/* Room Buttons */}
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
                  Join by ID
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
            </>

          )}

        </div>

      </div>

    </div>
  )
}

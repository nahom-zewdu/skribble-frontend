// src/features/lobby/JoinPage.tsx
// This file defines the JoinPage component for the Skribble frontend application.
// The JoinPage allows users to enter their name and either join a public game, create a private room, or join an existing private room using a room ID.
// It also handles the initial connection to the WebSocket server and navigation to the game page.

import { useMemo, useState } from "react"
import { socket } from "../../core/socket/websocket"
import { initMessageHandler } from "../../core/socket/messageHandler"
import { useNavigate, useParams } from "react-router-dom"

export default function JoinPage() {
  const navigate = useNavigate()

  const { roomID } = useParams()

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
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#171717]
        text-white
      "
    >

      {/* Background */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,184,77,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_28%)]
        "
      />

      {/* Grid */}
      <div
        className="
          absolute inset-0 opacity-[0.06]
          [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]
          [background-size:34px_34px]
        "
      />

      {/* Floating blobs */}
      <div
        className="
          absolute
          top-20 left-10
          w-32 h-32
          rounded-full
          bg-yellow-300/10
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          absolute
          bottom-16 right-10
          w-40 h-40
          rounded-full
          bg-blue-400/10
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          relative z-10
          min-h-screen
          flex items-center justify-center
          px-5 py-10
        "
      >

        <div
          className="
            w-full
            max-w-xl
          "
        >

          {/* HERO */}
          <div className="text-center mb-8">

            {/* Logo */}
            <div
              className="
                inline-flex
                items-center gap-3
                px-5 py-3
                rounded-[28px]
                border-4 border-black
                bg-[#ffd166]
                shadow-[0_8px_0_#000]
                rotate-[-2deg]
                mb-7
              "
            >

              <div className="text-4xl">
                🎨
              </div>

              <div className="text-left leading-none">
                <div className="text-2xl font-black text-black tracking-tight">
                  SKRIBBLE
                </div>

                <div className="text-[11px] font-bold text-black/70 uppercase tracking-widest mt-1">
                  chaos multiplayer
                </div>
              </div>

            </div>

            <h1
              className="
                text-5xl sm:text-6xl
                font-black
                tracking-tight
                leading-none
              "
            >
              Draw fast.
              <br />
              Guess faster.
            </h1>

            <p
              className="
                mt-5
                text-lg
                text-zinc-400
                max-w-md
                mx-auto
                leading-relaxed
              "
            >
              Party-game energy with live drawing,
              hilarious guesses, leaderboard battles,
              and total chaos.
            </p>

          </div>

          {/* MAIN PANEL */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[36px]
              border-4 border-black
              bg-[#262626]
              shadow-[0_14px_0_#000]
            "
          >

            {/* Decorative stripe */}
            <div
              className="
                h-3
                bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_18px,#111827_18px,#111827_36px)]
              "
            />

            <div className="p-6 sm:p-8">

              {/* Invite Banner */}
              {isInviteJoin && (
                <div
                  className="
                    mb-6
                    rounded-[24px]
                    border-4 border-black
                    bg-[#60a5fa]
                    px-5 py-4
                    shadow-[0_6px_0_#000]
                    rotate-[-1deg]
                  "
                >

                  <div className="text-black/70 text-sm font-black uppercase tracking-wider">
                    invited room
                  </div>

                  <div
                    className="
                      mt-1
                      text-3xl
                      font-black
                      tracking-[0.25em]
                      text-black
                    "
                  >
                    {inviteRoomID}
                  </div>

                </div>
              )}

              {/* Inputs */}
              <div className="space-y-5">

                {/* Name */}
                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-sm
                      font-black
                      uppercase
                      tracking-wider
                      text-zinc-300
                    "
                  >
                    Your Name
                  </label>

                  <input
                    value={name}
                    maxLength={18}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="PixelLegend99"
                    className="
                      w-full
                      rounded-[22px]
                      border-4 border-black
                      bg-[#f4f4f5]
                      px-5 py-4
                      text-lg
                      font-bold
                      text-black
                      outline-none
                      transition-all
                      placeholder:text-zinc-500
                      focus:translate-y-[2px]
                      focus:shadow-none
                      shadow-[0_6px_0_#000]
                    "
                  />

                </div>

                {/* Room */}
                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-sm
                      font-black
                      uppercase
                      tracking-wider
                      text-zinc-300
                    "
                  >
                    Room ID
                  </label>

                  <input
                    value={room}
                    disabled={isInviteJoin}
                    maxLength={8}
                    onChange={(e) =>
                      setRoom(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="OPTIONAL"
                    className={`
                      w-full
                      rounded-[22px]
                      border-4 border-black
                      px-5 py-4
                      text-lg
                      font-black
                      uppercase
                      tracking-[0.2em]
                      outline-none
                      transition-all
                      shadow-[0_6px_0_#000]

                      ${
                        isInviteJoin
                          ? `
                            bg-zinc-500
                            text-zinc-200
                            cursor-not-allowed
                          `
                          : `
                            bg-[#f4f4f5]
                            text-black
                            focus:translate-y-[2px]
                            focus:shadow-none
                          `
                      }
                    `}
                  />

                  {!isInviteJoin && (
                    <p
                      className="
                        mt-2
                        px-1
                        text-sm
                        text-zinc-500
                      "
                    >
                      Leave empty for public matchmaking
                    </p>
                  )}

                </div>

              </div>

              {/* Invite Flow */}
              {isInviteJoin ? (

                <button
                  onClick={() =>
                    connect("private_join")
                  }
                  className="
                    mt-7
                    w-full
                    rounded-[24px]
                    border-4 border-black
                    bg-[#ffd166]
                    py-4
                    text-xl
                    font-black
                    text-black
                    shadow-[0_8px_0_#000]
                    transition-all
                    hover:translate-y-[2px]
                    hover:shadow-[0_6px_0_#000]
                    active:translate-y-[6px]
                    active:shadow-[0_2px_0_#000]
                  "
                >
                  JOIN ROOM
                </button>

              ) : (

                <>
                  {/* Main CTA */}
                  <button
                    onClick={() =>
                      connect("public")
                    }
                    className="
                      mt-7
                      w-full
                      rounded-[24px]
                      border-4 border-black
                      bg-[#ffd166]
                      py-4
                      text-xl
                      font-black
                      text-black
                      shadow-[0_8px_0_#000]
                      transition-all
                      hover:translate-y-[2px]
                      hover:shadow-[0_6px_0_#000]
                      active:translate-y-[6px]
                      active:shadow-[0_2px_0_#000]
                    "
                  >
                    PLAY PUBLIC
                  </button>

                  {/* Divider */}
                  <div
                    className="
                      flex items-center
                      gap-4
                      my-7
                    "
                  >

                    <div className="flex-1 h-[3px] bg-zinc-700 rounded-full" />

                    <span
                      className="
                        text-xs
                        font-black
                        tracking-[0.2em]
                        text-zinc-500
                      "
                    >
                      PRIVATE ROOMS
                    </span>

                    <div className="flex-1 h-[3px] bg-zinc-700 rounded-full" />

                  </div>

                  {/* Room Buttons */}
                  <div className="grid grid-cols-2 gap-4">

                    <button
                      onClick={() =>
                        connect("private_join")
                      }
                      className="
                        rounded-[22px]
                        border-4 border-black
                        bg-[#3f3f46]
                        py-4
                        font-black
                        text-white
                        shadow-[0_6px_0_#000]
                        transition-all
                        hover:translate-y-[2px]
                        hover:shadow-[0_4px_0_#000]
                        active:translate-y-[5px]
                        active:shadow-[0_1px_0_#000]
                      "
                    >
                      JOIN ROOM
                    </button>

                    <button
                      onClick={() =>
                        connect("private_create")
                      }
                      className="
                        rounded-[22px]
                        border-4 border-black
                        bg-[#4ade80]
                        py-4
                        font-black
                        text-black
                        shadow-[0_6px_0_#000]
                        transition-all
                        hover:translate-y-[2px]
                        hover:shadow-[0_4px_0_#000]
                        active:translate-y-[5px]
                        active:shadow-[0_1px_0_#000]
                      "
                    >
                      CREATE
                    </button>

                  </div>
                </>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

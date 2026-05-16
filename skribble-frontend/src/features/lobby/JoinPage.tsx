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
        overflow-y-auto
        bg-[#171717]
        text-white
      "
    >

      {/* Background */}
      <div
        className="
          fixed inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_top,rgba(255,184,77,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.12),transparent_28%)]
        "
      />

      {/* Grid */}
      <div
        className="
          fixed inset-0
          pointer-events-none
          opacity-[0.05]
          [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)]
          [background-size:34px_34px]
        "
      />

      {/* Floating blobs */}
      <div
        className="
          fixed
          top-20 left-10
          w-40 h-40
          rounded-full
          bg-yellow-300/10
          blur-3xl
          animate-pulse
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          bottom-16 right-10
          w-48 h-48
          rounded-full
          bg-blue-400/10
          blur-3xl
          animate-pulse
          pointer-events-none
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
            max-w-6xl

            grid
            gap-10

            lg:grid-cols-[1fr_430px]
            lg:items-center
          "
        >

          {/* LEFT SIDE */}
          <div
            className="
              flex flex-col
              items-center lg:items-start
              text-center lg:text-left
            "
          >

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
                mb-8
              "
            >

              <div className="text-4xl">
                🎨
              </div>

              <div className="leading-none">
                <div className="text-2xl font-black text-black tracking-tight">
                  SKRIBBLE
                </div>

                <div className="text-[10px] font-black text-black/70 uppercase tracking-[0.25em] mt-1">
                  multiplayer chaos
                </div>
              </div>

            </div>

            {/* Headline */}
            <h1
              className="
                text-5xl
                sm:text-6xl
                lg:text-7xl
                font-black
                leading-[0.92]
                tracking-tight
                max-w-[700px]
              "
            >
              Draw fast.
              <br />
              Guess faster.
            </h1>

          </div>

          {/* RIGHT SIDE / FORM */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border-4 border-black
              bg-[#262626]
              shadow-[0_12px_0_#000]
            "
          >

            {/* Decorative stripe */}
            <div
              className="
                h-3
                bg-[repeating-linear-gradient(45deg,#ffd166_0px,#ffd166_18px,#111827_18px,#111827_36px)]
              "
            />

            <div className="p-5 sm:p-6">

              {/* Invite Banner */}
              {isInviteJoin && (
                <div
                  className="
                    mb-5
                    rounded-[22px]
                    border-4 border-black
                    bg-[#60a5fa]
                    px-4 py-3
                    shadow-[0_5px_0_#000]
                    rotate-[-1deg]
                  "
                >

                  <div className="text-black/70 text-xs font-black uppercase tracking-wider">
                    invited room
                  </div>

                  <div
                    className="
                      mt-1
                      text-2xl
                      font-black
                      tracking-[0.2em]
                      text-black
                    "
                  >
                    {inviteRoomID}
                  </div>

                </div>
              )}

              {/* Inputs */}
              <div className="space-y-4">

                {/* Name */}
                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-xs
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
                      rounded-[18px]
                      border-4 border-black
                      bg-[#f4f4f5]
                      px-4 py-3
                      text-base
                      font-bold
                      text-black
                      outline-none
                      transition-all
                      placeholder:text-zinc-500
                      focus:translate-y-[2px]
                      focus:shadow-none
                      shadow-[0_5px_0_#000]
                    "
                  />

                </div>

                {/* Room */}
                <div>

                  <label
                    className="
                      block
                      mb-2
                      text-xs
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
                      rounded-[18px]
                      border-4 border-black
                      px-4 py-3
                      text-base
                      font-black
                      uppercase
                      tracking-[0.2em]
                      outline-none
                      transition-all
                      shadow-[0_5px_0_#000]

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

                </div>

              </div>

              {/* Invite Flow */}
              {isInviteJoin ? (

                <button
                  onClick={() =>
                    connect("private_join")
                  }
                  className="
                    mt-6
                    w-full
                    rounded-[20px]
                    border-4 border-black
                    bg-[#ffd166]
                    py-3
                    text-lg
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
                  JOIN ROOM
                </button>

              ) : (

                <>
                  {/* Public */}
                  <button
                    onClick={() =>
                      connect("public")
                    }
                    className="
                      mt-6
                      w-full
                      rounded-[20px]
                      border-4 border-black
                      bg-[#ffd166]
                      py-3
                      text-lg
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
                    PLAY PUBLIC
                  </button>

                  {/* Divider */}
                  <div
                    className="
                      flex items-center
                      gap-4
                      my-5
                    "
                  >

                    <div className="flex-1 h-[3px] bg-zinc-700 rounded-full" />

                    <span
                      className="
                        text-[10px]
                        font-black
                        tracking-[0.2em]
                        text-zinc-500
                      "
                    >
                      PRIVATE
                    </span>

                    <div className="flex-1 h-[3px] bg-zinc-700 rounded-full" />

                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        connect("private_join")
                      }
                      className="
                        rounded-[18px]
                        border-4 border-black
                        bg-[#3f3f46]
                        py-3
                        text-sm
                        font-black
                        text-white
                        shadow-[0_5px_0_#000]
                        transition-all
                        hover:translate-y-[2px]
                        hover:shadow-[0_3px_0_#000]
                        active:translate-y-[4px]
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
                        rounded-[18px]
                        border-4 border-black
                        bg-[#4ade80]
                        py-3
                        text-sm
                        font-black
                        text-black
                        shadow-[0_5px_0_#000]
                        transition-all
                        hover:translate-y-[2px]
                        hover:shadow-[0_3px_0_#000]
                        active:translate-y-[4px]
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


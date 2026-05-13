// src/features/game/CanvasBoard.tsx
// This component renders the canvas where the drawing takes place. 
// It handles user interactions for drawing (pointer events) and communicates with the server via WebSocket to send drawing data and receive updates from other players' drawings. 
// It also includes a toolbar for selecting colors, brush size, and tools (brush/eraser).

import { useEffect, useRef, useState } from "react"
import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"

import type {
  DrawMoveMessage,
  DrawStartMessage,
  DrawingTool,
  Point,
  ServerMessage,
} from "../../core/socket/protocol"

const COLORS = [
  "#111111",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
  "#ffffff",
]

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const drawingRef = useRef(false)
  const bufferRef = useRef<Point[]>([])

  const phase = useGameStore((s) => s.phase)
  const drawerID = useGameStore((s) => s.drawerID)
  const selfID = useGameStore((s) => s.selfID)

  const isDrawer = drawerID === selfID

  const [color, setColor] = useState("#111111")
  const [thickness, setThickness] = useState(5)
  const [tool, setTool] = useState<DrawingTool>("brush")

  // -----------------------------
  // Canvas setup
  // -----------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr

    ctx.scale(dpr, dpr)

    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctxRef.current = ctx
  }, [])

  // -----------------------------
  // Draw helper
  // -----------------------------
  function drawLine(
    from: Point,
    to: Point,
    options: {
      color: string
      thickness: number
      tool: DrawingTool
    }
  ) {
    const ctx = ctxRef.current
    if (!ctx) return

    ctx.beginPath()

    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.lineWidth = options.thickness

    if (options.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = options.color
    }

    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)

    ctx.stroke()
  }

  // -----------------------------
  // Pointer Down
  // -----------------------------
  function handlePointerDown(e: React.PointerEvent) {
    if (!isDrawer || phase !== "drawing") {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    drawingRef.current = true
    bufferRef.current = [point]

    const payload: DrawStartMessage = {
      point,
      color,
      thickness,
      tool,
    }

    socket.send({
      type: "draw_start",
      data: payload,
    })
  }

  // -----------------------------
  // Pointer Move
  // -----------------------------
  function handlePointerMove(e: React.PointerEvent) {
    if (!drawingRef.current || !isDrawer) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    const buffer = bufferRef.current
    const last = buffer[buffer.length - 1]

    if (last) {
      drawLine(last, point, {
        color,
        thickness,
        tool,
      })
    }

    buffer.push(point)
  }

  // -----------------------------
  // Flush buffer
  // -----------------------------
  function flushBuffer() {
    const buffer = bufferRef.current

    if (buffer.length <= 1) {
      return
    }

    const payload: DrawMoveMessage = {
      stroke: {
        points: buffer,
        color,
        thickness,
        tool,
      },
    }

    socket.send({
      type: "draw_move",
      data: payload,
    })

    const lastPoint = buffer[buffer.length - 1]

    bufferRef.current = lastPoint ? [lastPoint] : []
  }

  // -----------------------------
  // Pointer Up
  // -----------------------------
  function handlePointerUp() {
    if (!drawingRef.current || !isDrawer) {
      return
    }

    drawingRef.current = false

    flushBuffer()

    socket.send({
      type: "draw_end",
    })

    bufferRef.current = []
  }

  // -----------------------------
  // Batch sender
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDrawer || !drawingRef.current) {
        return
      }

      flushBuffer()
    }, 30)

    return () => clearInterval(interval)
  }, [isDrawer, color, thickness, tool])

  // -----------------------------
  // Receive draw events
  // -----------------------------
  useEffect(() => {
    function handleDraw(msg: ServerMessage) {
      const ctx = ctxRef.current

      if (!ctx) {
        return
      }

      switch (msg.type) {
        case "draw_move": {
          const stroke = msg.data.stroke

          for (let i = 1; i < stroke.points.length; i++) {
            drawLine(
              stroke.points[i - 1],
              stroke.points[i],
              {
                color: stroke.color,
                thickness: stroke.thickness,
                tool: stroke.tool,
              }
            )
          }

          break
        }

        case "clear_canvas":
          ctx.clearRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height,
          )
          break
      }
    }

    const unsubscribe = socket.onDraw(handleDraw)

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      
      {/* Toolbar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center gap-4">

        {/* Colors */}
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setTool("brush")
                setColor(c)
              }}
              className={`
                w-8 h-8 rounded-full border-2 transition
                ${color === c ? "border-white scale-110" : "border-slate-600"}
              `}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Thickness */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">
            Size
          </span>

          <input
            type="range"
            min={2}
            max={24}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
          />
        </div>

        {/* Brush */}
        <button
          onClick={() => setTool("brush")}
          className={`
            px-4 py-2 rounded-xl font-medium transition
            ${
              tool === "brush"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }
          `}
        >
          Brush
        </button>

        {/* Eraser */}
        <button
          onClick={() => setTool("eraser")}
          className={`
            px-4 py-2 rounded-xl font-medium transition
            ${
              tool === "eraser"
                ? "bg-red-500 text-white"
                : "bg-slate-700 text-slate-300"
            }
          `}
        >
          Eraser
        </button>

        {/* Clear */}
        {isDrawer && (
          <button
            onClick={() => {
              const ctx = ctxRef.current

              if (!ctx) return

              ctx.clearRect(
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height,
              )

              socket.send({
                type: "clear_canvas",
              })
            }}
            className="
              ml-auto
              px-4 py-2
              rounded-xl
              bg-slate-700 hover:bg-slate-600
              transition
            "
          >
            Clear
          </button>
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="
          w-[800px]
          h-[500px]
          bg-white
          rounded-2xl
          shadow-inner
          touch-none
        "
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          cursor: isDrawer ? "crosshair" : "not-allowed",
        }}
      />
    </div>
  )
}

// src/features/game/CanvasBoard.tsx
// This file defines the CanvasBoard component for the Skribble frontend application.
// The CanvasBoard is responsible for rendering the drawing canvas and handling all drawing-related interactions.

import { useEffect, useRef } from "react"
import { socket } from "../../core/socket/websocket"
import { useGameStore } from "../../store/gameStore"
import type { ServerMessage, Point } from "../../core/socket/protocol"

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const drawingRef = useRef(false)
  const bufferRef = useRef<Point[]>([])

  const phase = useGameStore((s) => s.phase)
  const drawerID = useGameStore((s) => s.drawerID)

  const selfID = useGameStore((s) => s.selfID)
  const isDrawer = drawerID === selfID

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
    ctx.lineWidth = 4
    ctx.strokeStyle = "#000"

    ctxRef.current = ctx
  }, [])

  // -----------------------------
  // Draw helpers
  // -----------------------------
  function drawLine(from: Point, to: Point) {
    const ctx = ctxRef.current
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  // -----------------------------
  // Pointer events (drawer only)
  // -----------------------------
  function handlePointerDown(e: React.PointerEvent) {
    if (!isDrawer || phase !== "drawing") return

    const rect = e.currentTarget.getBoundingClientRect()
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    drawingRef.current = true
    bufferRef.current = [point]

    socket.send({ type: "draw_start", data: point })
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drawingRef.current || !isDrawer) return

    const rect = e.currentTarget.getBoundingClientRect()
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    const buffer = bufferRef.current
    const last = buffer[buffer.length - 1]

    if (last) drawLine(last, point)

    buffer.push(point)
  }

  function handlePointerUp() {
    if (!drawingRef.current || !isDrawer) return

    drawingRef.current = false

    const buffer = bufferRef.current
    if (buffer.length > 1) {
      socket.send({
        type: "draw_move",
        data: { points: buffer },
      })
    }

    bufferRef.current = []
  }

  // -----------------------------
  // Batching (every 30ms)
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDrawer) return

      const buffer = bufferRef.current

      if (buffer.length > 1) {
        socket.send({
          type: "draw_move",
          data: { points: buffer },
        })

        bufferRef.current = []
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isDrawer])

  // -----------------------------
  // Receive drawing events
  // -----------------------------
  useEffect(() => {
    function handleDraw(msg: ServerMessage) {
      const ctx = ctxRef.current
      if (!ctx) return

      switch (msg.type) {
        case "draw_start":
          // nothing special needed
          break

        case "draw_move": {
          const points = msg.data.points

          for (let i = 1; i < points.length; i++) {
            drawLine(points[i - 1], points[i])
          }
          break
        }

        case "draw_end":
          break

        case "clear_canvas":
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          break
      }
    }

    const unsubscribe = socket.onDraw(handleDraw)

    return () => { unsubscribe() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-[800px] h-[500px] bg-white rounded-xl shadow-inner cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDrawer ? "crosshair" : "not-allowed" }}
    />
  )
}

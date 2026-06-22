// src/features/dashboard/DashboardPage.tsx
// This file defines the DashboardPage component for the Skribble frontend application.
// The DashboardPage is a simple page that fetches and displays system metrics from the Skribble game server.
// It retrieves metrics such as active connections, peak load, total messages, and latency statistics, and updates the display every 5 seconds.
import { useEffect, useState } from "react"

type MetricsResponse = {
  activeConnections: number
  peakConnections: number
  activeRooms: number
  peakRooms: number
  totalMessages: number
  totalBytes: number
  drawMessages: number
  chatMessages: number
}

type Latency = {
  min: number
  p50: number
  p95: number
  p99: number
  max: number
}

type Response = {
  metrics: MetricsResponse
  latency: Latency
}

function Card({
  title,
  value,
  sub,
}: {
  title: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="game-panel p-5 flex flex-col gap-2">
      <div className="text-xs uppercase tracking-widest text-gray-400">
        {title}
      </div>

      <div className="text-3xl font-bold text-white">
        {value}
      </div>

      {sub && (
        <div className="text-xs text-[var(--text-soft)]">
          {sub}
        </div>
      )}
    </div>
  )
}

function LatencyCard({ latency }: { latency: Latency }) {
  const band =
    latency.p95 < 50
      ? "good"
      : latency.p95 < 120
      ? "ok"
      : "bad"

  const color =
    band === "good"
      ? "text-green-400"
      : band === "ok"
      ? "text-yellow-400"
      : "text-red-400"

  return (
    <div className="game-panel p-5 col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs uppercase tracking-widest text-gray-400">
          Latency (ms)
        </div>

        <div className={`text-xs font-bold ${color}`}>
          {band.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 text-center">
        <div>
          <div className="text-xs text-gray-400">min</div>
          <div className="font-bold">{latency.min}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">p50</div>
          <div className="font-bold">{latency.p50}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400">p95</div>
          <div className="font-bold text-yellow-300">
            {latency.p95}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">p99</div>
          <div className="font-bold text-orange-300">
            {latency.p99}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">max</div>
          <div className="font-bold text-red-300">
            {latency.max}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const API_BASE =
      import.meta.env.VITE_API_URL ??
      "http://localhost:8080"

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/metrics`)
        const json = await res.json()

        setData(json)
        setError(null)
      } catch (e) {
        setError("Failed to load metrics")
      }
    }

    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [])

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Error: {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-300">
        Loading metrics...
      </div>
    )
  }

  const m = data.metrics
  const l = data.latency

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="game-title text-4xl">
          System Dashboard
        </h1>
        <p className="game-subtitle mt-2">
          live infrastructure signals
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          title="Active Connections"
          value={m.activeConnections}
        />
        <Card
          title="Peak Connections"
          value={m.peakConnections}
        />
        <Card
          title="Active Rooms"
          value={m.activeRooms}
        />
        <Card
          title="Total Messages"
          value={m.totalMessages}
        />
        <Card
          title="Total Bytes"
          value={`${(m.totalBytes / 1024).toFixed(1)} KB`}
        />
        <Card
          title="Draw Messages"
          value={m.drawMessages}
        />
        <Card
          title="Chat Messages"
          value={m.chatMessages}
        />
        <Card
          title="Peak Rooms"
          value={m.peakRooms}
        />
      </div>

      {/* Latency */}
      <LatencyCard latency={l} />
    </div>
  )
}

// src/features/dashboard/DashboardPage.tsx
// This file defines the DashboardPage component for the Skribble frontend application.
// The DashboardPage is a simple page that fetches and displays system metrics from the Skribble game server.
// It retrieves metrics such as active connections, peak load, total messages, and latency statistics, and updates the display every 5 seconds.
import { useEffect, useState } from "react"

type MetricsResponse = {
  metrics: {
    ActiveConnections: number
    PeakConnections: number
    ActiveRooms: number
    PeakRooms: number
    TotalMessages: number
    TotalBytes: number
    DrawMessages: number
    ChatMessages: number
  }
  latency: {
    min: number
    p50: number
    p95: number
    p99: number
    max: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<MetricsResponse | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/metrics`
      )
      const json = await res.json()
      setData(json)
    }

    load()
    const interval = setInterval(load, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!data) return <div>Loading metrics...</div>

  const { metrics, latency } = data

  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h2>System Metrics</h2>

      <pre>{JSON.stringify(metrics, null, 2)}</pre>

      <h2>Latency (ms)</h2>
      <pre>{JSON.stringify(latency, null, 2)}</pre>

      <div style={{ marginTop: 20 }}>
        <b>Quick interpretation:</b>
        <ul>
          <li>Peak load = {metrics.PeakConnections}</li>
          <li>Total events = {metrics.TotalMessages}</li>
          <li>Network load = {metrics.TotalBytes} bytes</li>
          <li>p95 latency = {latency.p95} ms</li>
        </ul>
      </div>
    </div>
  )
}
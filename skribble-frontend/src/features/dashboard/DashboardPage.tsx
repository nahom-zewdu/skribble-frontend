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
  const [data, setData] =
    useState<MetricsResponse | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {

    const API_BASE =
      import.meta.env.VITE_API_URL ??
      "http://localhost:8080"

    const load = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/metrics`
        )

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          )
        }

        const contentType =
          response.headers.get(
            "content-type"
          )

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "Response is not JSON"
          )
        }

        const json =
          await response.json()

        setData(json)
        setError(null)

      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load metrics"
        )
      }
    }

    load()

    const interval =
      setInterval(load, 5000)

    return () =>
      clearInterval(interval)

  }, [])

  if (error) {
    return (
      <div style={{padding:20}}>
        Error loading metrics:
        <pre>{error}</pre>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{padding:20}}>
        Loading metrics...
      </div>
    )
  }

  return (
    <div style={{padding:20}}>
      <h2>System Metrics</h2>

      <pre>
        {JSON.stringify(
          data.metrics,
          null,
          2
        )}
      </pre>

      <h2>Latency</h2>

      <pre>
        {JSON.stringify(
          data.latency,
          null,
          2
        )}
      </pre>
    </div>
  )
}
// src/app/router.tsx

import { createBrowserRouter } from "react-router-dom"
import JoinPage from "../features/lobby/JoinPage"
import GamePage from "../features/game/GamePage"
import DashboardPage from "../features/dashboard/DashboardPage"

export const router = createBrowserRouter([
  { path: "/", element: <JoinPage /> },
  { path: "/join/:roomID", element: <JoinPage /> },
  { path: "/game", element: <GamePage /> },
  { path: "/dashboard", element: <DashboardPage /> },
])

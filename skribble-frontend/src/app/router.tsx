// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom"
import JoinPage from "../features/lobby/JoinPage"
import GamePage from "../features/game/GamePage"

export const router = createBrowserRouter([
  { path: "/", element: <JoinPage /> },
  { path: "/game", element: <GamePage /> },
])
// src/store/gameStore.ts
// This file defines a Zustand store for managing the game state in the Skribble frontend application.
// The store holds information about the current game state, players, turn number, and chat messages, and provides a method to update the state based on incoming data from the server.
import { create } from "zustand"
import type { Player } from "../core/socket/protocol"

type GameState = {
  state: string
  phase: string

  players: Player[]

  drawerID?: string
  turnNumber: number

  word?: string
  maskedWord?: string

  selectionChoices?: string[]

  messages: { sender: string; text: string }[]

  setState: (data: Partial<GameState>) => void
}

export const useGameStore = create<GameState>((set) => ({
  state: "waiting",
  phase: "waiting",
  players: [],
  turnNumber: 0,
  messages: [],

  setState: (data) =>
    set((s) => ({
      ...s,
      ...data,
    })),
}))

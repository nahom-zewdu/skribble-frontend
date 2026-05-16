// src/store/gameStore.ts
// This file defines a Zustand store for managing the game state in the Skribble frontend application.
// The store holds information about the current game state, players, turn number, and chat messages, and provides a method to update the state based on incoming data from the server.
import { create } from "zustand"
import type { Player } from "../core/socket/protocol"

type Message = {
  id: string
  sender?: string
  text: string
  type: "chat" | "system"
}

type TurnResult = {
  word: string
  players: Player[]
}

type GameResult = {
  players: Player[]
}

type GameState = {
  state: string
  phase: string
  selfID?: string
  roomID: string

  players: Player[]

  drawerID?: string
  turnNumber: number

  word?: string
  maskedWord?: string
  wordLengthHint?: string

  selectionChoices?: string[]
  selectionDeadline?: string

  playDeadline?: string
  transitionDeadline?: string
  restartDeadline?: string
  nextTurnStartTime?: string
  restartTime?: string

  turnResult?: TurnResult
  gameResult?: GameResult
  
  messages: Message[]

  recentGuess?: {
    id: string
    playerID: string
    score: number
    drawerID: string
    drawerPoints: number
  }

  setState: (data: Partial<GameState>) => void
}

export const useGameStore = create<GameState>((set) => ({
  state: "waiting",
  phase: "waiting",
  players: [],
  turnNumber: 0,
  messages: [],
  roomID: "",
  turnResult: undefined,
  gameResult: undefined,
  wordLengthHint: undefined,

  setState: (data) =>
    set((s) => ({
      ...s,
      ...data,
      players: data.players ?? s.players ?? [],
      roomID: data.roomID ?? s.roomID ?? "",
    })),
}))

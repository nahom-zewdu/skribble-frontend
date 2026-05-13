// src/core/socket/protocol.ts
// This file defines the TypeScript types for the WebSocket communication protocol used in the Skribble game.
// It includes the structure of messages sent from the server to the client and from the client to the server,
// as well as related types such as Player, GameSnapshot, and drawing-related types.

export type DrawingTool = "brush" | "eraser"

export type Point = {
  x: number
  y: number
}

export type Stroke = {
  points: Point[]

  color: string
  thickness: number

  tool: DrawingTool
}

export type DrawStartMessage = {
  point: Point

  color: string
  thickness: number

  tool: DrawingTool
}

export type DrawMoveMessage = {
  stroke: Stroke
}

export type ServerMessage =
  | { type: "game_snapshot"; data: GameSnapshot }
  | { type: "turn_started"; data: TurnStarted }
  | { type: "word_selection_started"; data: WordSelectionStarted }
  | { type: "drawing_started"; data: DrawingStarted }
  | { type: "chat"; data: ChatMessage }
  | { type: "correct_guess"; data: CorrectGuess }
  | { type: "turn_ended"; data: TurnEnded }
  | { type: "game_ended"; data: GameEnded }
  | { type: "system"; data: { text: string } }
  | { type: "draw_start"; data: DrawStartMessage }
  | { type: "draw_move"; data: DrawMoveMessage }
  | { type: "draw_end" }
  | { type: "clear_canvas" }

export type ClientMessage =
  | { type: "chat"; data: { text: string } }
  | { type: "select_word"; data: { word: string } }
  | { type: "draw_start"; data: DrawStartMessage }
  | { type: "draw_move"; data: DrawMoveMessage }
  | { type: "draw_end" }
  | { type: "clear_canvas" }

export type Player = {
  id: string
  name: string
  score: number
}

export type GameSnapshot = {
  state: string
  roomID: string
  turnNumber: number
  maxTurns: number

  selfID?: string

  drawerID: string
  phase: string

  players: Player[]

  maskedWord: string
  wordLengthHint?: string

  selectionDeadline?: string
  playDeadline?: string
  transitionDeadline?: string
  restartDeadline?: string
}

export type TurnStarted = {
  turnNumber: number
  drawerID: string
}

export type WordSelectionStarted = {
  drawerID: string
  choices: string[]
  deadline: string
}

export type DrawingStarted = {
  drawerID?: string
  word?: string
  maskedWord?: string
  wordLengthHint?: string
  deadline: string
}

export type ChatMessage = {
  sender: string
  text: string
}

export type CorrectGuess = {
  playerID: string
  score: number
}

export type TurnEnded = {
  turnNumber: number
  word: string
  players: Player[]
  nextTurnStartTime: string
}

export type GameEnded = {
  players: Player[]
  restartTime: string
}

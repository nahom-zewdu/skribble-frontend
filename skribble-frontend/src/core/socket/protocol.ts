// src/core/socket/protocol.ts

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

export type ClientMessage =
  | { type: "chat"; data: { text: string } }
  | { type: "select_word"; data: { word: string } }
  | { type: "draw_start"; data: Point }
  | { type: "draw_move"; data: { points: Point[] } }
  | { type: "draw_end" }
  | { type: "clear_canvas" }

export type Point = {
  x: number
  y: number
}

export type Player = {
  id: string
  name: string
  score: number
}

export type GameSnapshot = {
  state: string
  turnNumber: number
  maxTurns: number
  selfID?: string
  drawerID: string
  phase: string
  players: Player[]

  maskedWord: string

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

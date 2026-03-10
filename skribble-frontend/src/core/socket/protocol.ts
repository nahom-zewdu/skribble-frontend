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
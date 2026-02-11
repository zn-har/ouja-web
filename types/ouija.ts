export interface Position {
  x: number;
  y: number;
}

export interface OuijaElement {
  char: string;
  position: Position;
  rotation?: number;
}

export interface Message {
  question: string;
  answer: string;
  timestamp: number;
}

export interface SessionState {
  isAsking: boolean;
  currentChar: string | null;
  messages: Message[];
}

export interface ControlPositions {
  yes: Position;
  no: Position;
  goodbye: Position;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

export interface HintCard {
  id: string;
  text: string;
  type:
    | 'GREATER_THAN'
    | 'LESS_THAN'
    | 'EVEN'
    | 'ODD'
    | 'PRIME'
    | 'COMPOSITE'
    | 'ADJACENT'
    | 'RELATIVE_POSITION'
    | 'DIVISIBLE'
    | 'RANGE'
    | 'SUM_ADJACENT';
  value?: number;
  slot?: 'A' | 'B' | 'C' | 'D' | 'E';
  isFlipped: boolean;
}

export interface Game {
  id: string;
  host: string;
  players: Player[];
  roundNumber: number;
  numberSet: number[];
  hintBoard: HintCard[];
  playerSubmissions: Record<string, HintCard[]>;
  flippedHints: HintCard[];
  gameState: 'waiting' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  playerHands: Record<string, HintCard[]>;
  currentRound: {
    endTime: Date;
    submissions: Record<string, HintSubmission>;
  };
  guesses: NumberGuess[];
  slots: Record<'A' | 'B' | 'C' | 'D' | 'E', SlotState>;
}

export interface HintSubmission {
  playerId: string;
  hints: {
    slot: 'A' | 'B' | 'C' | 'D' | 'E';
    hint: HintCard;
  }[];
}

export interface NumberGuess {
  playerId: string;
  sequence: number[];
  timestamp: Date;
  isCorrect: boolean;
}

export interface SlotState {
  submittedHints: HintSubmission[];
  isRevealed: boolean;
}

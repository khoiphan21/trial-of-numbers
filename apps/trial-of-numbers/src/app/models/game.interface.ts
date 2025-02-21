export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

export interface HintCard {
  id: string;
  text: string;
  type: 'GREATER_THAN' | 'LESS_THAN' | 'EVEN' | 'ODD' | 'PRIME' | 'COMPOSITE';
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
}

import { HintCard, HintSubmission, SlotState } from './hint';
import { Player } from './player';
import { ValidSlot } from './slot';

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
  slots: Record<ValidSlot, SlotState>;
}

export interface NumberGuess {
  playerId: string;
  sequence: number[];
  timestamp: string;
  isCorrect: boolean;
}

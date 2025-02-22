import { AppEntity } from './app-entity';
import { HintCard, HintSubmission, SlotState } from './hint';
import { Player } from './player';
import { ValidSlot } from './slot';

export interface Game extends AppEntity {
  host: string;
  players: Player[];
  roundNumber: number;
  numberSet: number[];
  hintBoard: HintCard[];
  playerSubmissions: Record<string, HintCard[]>;
  flippedHints: HintCard[];
  gameState: 'waiting' | 'in_progress' | 'completed';
  playerHands: Record<string, HintCard[]>;
  currentRound: {
    endTime: string;
    submissions: Record<string, HintSubmission>;
  };
  guesses: NumberGuess[];
  slots: Record<ValidSlot, SlotState>;
}

export interface NumberGuess extends AppEntity {
  playerId: string;
  sequence: number[];
  isCorrect: boolean;
}

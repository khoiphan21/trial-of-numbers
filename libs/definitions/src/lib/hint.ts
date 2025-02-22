import { ValidSlot } from './slot';

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
  slot?: ValidSlot;
  isFlipped: boolean;
}

export interface HintSubmission {
  playerId: string;
  hints: {
    slot: ValidSlot;
    hint: HintCard;
  }[];
}

export interface SlotState {
  submittedHints: HintSubmission[];
  isRevealed: boolean;
}

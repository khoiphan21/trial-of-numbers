import { HintSubmission } from '../core-game';

export interface HintBoard {
  readonly id: string;
  readonly sortedColumns: HintBoardColumn[];
}

export interface HintBoardColumn {
  readonly hints: HintSubmission[];
  readonly slotIndex: number;
  readonly slotValue: number;
}

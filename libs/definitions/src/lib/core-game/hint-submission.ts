import { GameSessionId, PlayerId } from '../aliases';

export interface HintSubmission {
  playerId: PlayerId;
  gameSessionId: GameSessionId;
  hintTypeId: string;
  submittedAt: Date;
  isCorrect: boolean;
}

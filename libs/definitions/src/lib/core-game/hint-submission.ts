import { GameSessionId, PlayerId, TimestampInMilliseconds } from '../aliases';
import { AppEntity } from '../app-entity';

export interface HintSubmission extends AppEntity {
  readonly playerId: PlayerId;
  readonly gameSessionId: GameSessionId;
  readonly hintTypeId: string;
  readonly submittedAt: TimestampInMilliseconds;
  readonly isCorrect: boolean;
}

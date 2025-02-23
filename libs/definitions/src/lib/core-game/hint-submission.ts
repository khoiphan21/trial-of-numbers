import {
  GameSessionId,
  HintTypeId,
  PlayerId,
  TimestampInMilliseconds,
} from '../aliases';
import { AppEntity } from '../app-entity';

export interface HintSubmission extends AppEntity {
  readonly playerId: PlayerId;
  readonly gameSessionId: GameSessionId;
  readonly hintTypeId: HintTypeId;
  readonly submittedAt: TimestampInMilliseconds;
  readonly isCorrect: boolean;
  readonly slotIndex: number;
}

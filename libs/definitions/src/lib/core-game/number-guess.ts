import { GameSessionId, TimestampInMilliseconds } from '../aliases';
import { PlayerId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface NumberGuess extends AppEntity {
  readonly gameSessionId: GameSessionId;
  readonly playerId: PlayerId;
  readonly numbers: number[];
  readonly isCorrect: boolean;
  readonly submittedAt: TimestampInMilliseconds;
}

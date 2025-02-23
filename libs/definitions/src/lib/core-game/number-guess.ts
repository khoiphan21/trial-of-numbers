import { GameSessionId, TimestampInMilliseconds } from '../aliases';
import { PlayerId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface NumberGuess extends AppEntity {
  gameSessionId: GameSessionId;
  playerId: PlayerId;
  numbers: number[];
  isCorrect: boolean;
  submittedAt: TimestampInMilliseconds;
}

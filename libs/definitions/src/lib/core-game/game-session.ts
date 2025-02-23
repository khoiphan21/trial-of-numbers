import { LobbySessionId } from '../aliases';
import { AppEntity } from '../app-entity';
import { GameSessionState } from './game-state';

export interface GameSession extends AppEntity {
  readonly lobbySessionId: LobbySessionId;
  readonly roundNumber: number;
  readonly numberSet: number[];
  readonly gameSessionState: GameSessionState;
}

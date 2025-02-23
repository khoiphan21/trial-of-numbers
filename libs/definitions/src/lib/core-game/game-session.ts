import { LobbySessionId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface GameSession extends AppEntity {
  readonly lobbySessionId: LobbySessionId;
  readonly roundNumber: number;
  readonly numberSet: number[];
}

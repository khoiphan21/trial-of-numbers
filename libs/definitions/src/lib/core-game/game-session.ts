import { LobbySessionId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface GameSession extends AppEntity {
  lobbySessionId: LobbySessionId;
  roundNumber: number;
  numberSet: number[];
}

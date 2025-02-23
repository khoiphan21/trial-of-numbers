import { LobbySessionId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface Player extends AppEntity {
  name: string;
  score: number;
  lobbySessionId: LobbySessionId;
}

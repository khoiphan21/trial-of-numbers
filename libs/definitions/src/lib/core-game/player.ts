import { LobbySessionId } from '../aliases';
import { AppEntity } from '../app-entity';

export interface Player extends AppEntity {
  readonly name: string;
  readonly score: number;
  readonly lobbySessionId: LobbySessionId;
}

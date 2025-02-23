import { PlayerId } from '../aliases';
import { AppEntity } from '../app-entity';
import { GameState } from './game-state';

export interface LobbySession extends AppEntity {
  readonly hostId: PlayerId;
  readonly joinCode: string;
  readonly gameState: GameState;
}

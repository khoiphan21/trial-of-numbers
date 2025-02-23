import { PlayerId } from '../aliases';
import { AppEntity } from '../app-entity';
import { GameState } from './game-state';

export interface LobbySession extends AppEntity {
  hostId: PlayerId;
  joinCode: string;
  gameState: GameState;
}

import { GameId } from '@luna/definitions';

export interface UIState {
  // add more here for more ui states
  activeGame: GameId | undefined;
}

import { GameId } from '@luna-academy-trial-of-numbers/definitions';

export interface UIState {
  // add more here for more ui states
  activeGame: GameId | undefined;
}

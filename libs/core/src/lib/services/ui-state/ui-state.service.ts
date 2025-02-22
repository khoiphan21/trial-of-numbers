import { GameId } from '@luna-academy-trial-of-numbers/definitions';
import { updateState } from './ui-state.store';

export class UIStateService {
  static setActiveGame(activeGame: GameId) {
    updateState({ activeGame });
  }
}

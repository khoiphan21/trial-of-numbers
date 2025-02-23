import { GameId } from '@luna/definitions';
import { updateState } from './ui-state.store';

export class UIStateService {
  static setActiveGame(activeGame: GameId) {
    updateState({ activeGame });
  }
}

import { GameSession } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectGameSession } from './select.queries';

export const getGameSession = makeEntityGetFromSelect<GameSession>(
  'GameSession',
  selectGameSession
);

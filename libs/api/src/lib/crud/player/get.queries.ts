import { Player } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectPlayer } from './select.queries';

export const getPlayer = makeEntityGetFromSelect<Player>(
  'Player',
  selectPlayer
);

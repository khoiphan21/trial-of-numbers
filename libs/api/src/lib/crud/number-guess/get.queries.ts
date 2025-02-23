import { NumberGuess } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectNumberGuess } from './select.queries';

export const getNumberGuess = makeEntityGetFromSelect<NumberGuess>(
  'NumberGuess',
  selectNumberGuess
);

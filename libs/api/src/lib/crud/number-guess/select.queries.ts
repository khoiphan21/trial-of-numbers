import { NumberGuess } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectNumberGuess =
  makeEntitySelectFunction<NumberGuess>('NumberGuess');

export const selectAllNumberGuesss = () =>
  selectDocs<NumberGuess>(
    'NumberGuess',
    orderByFieldOf<NumberGuess>('_createdAt', 'desc')
  );

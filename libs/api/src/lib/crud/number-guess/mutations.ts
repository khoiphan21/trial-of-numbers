import { NumberGuess } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addNumberGuess = makeAddFunction<NumberGuess>();

export const addNumberGuesss = (...entities: NumberGuess[]) =>
  Promise.all(entities.map((NumberGuess) => addNumberGuess(NumberGuess)));

export const deleteNumberGuess = makeDeleteFunction('NumberGuess');

export const updateNumberGuess = makeUpdateFunction<NumberGuess>('NumberGuess');

export const hardDeleteNumberGuess = makeHardDeleteFunction('NumberGuess');

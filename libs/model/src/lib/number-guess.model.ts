import { NumberGuess } from '@luna-academy-trial-of-numbers/definitions';
import { createMakeFunction } from './util';
import { makeAppEntity } from './app-entity.model';

export const makeNumberGuess = createMakeFunction<NumberGuess>(
  (): NumberGuess => ({
    ...makeAppEntity(),
    _type: 'NumberGuess',
    playerId: '',
    sequence: [],
    isCorrect: false,
    submittedAt: '',
  })
);

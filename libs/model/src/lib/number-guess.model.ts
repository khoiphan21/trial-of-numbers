import { createMakeFunction } from './util';
import { makeAppEntity } from './app-entity.model';

import { NumberGuess } from '@luna/definitions';

export const makeNumberGuess = createMakeFunction<NumberGuess>(
  (): NumberGuess => ({
    ...makeAppEntity(),
    _type: 'NumberGuess',
    playerId: '',
    gameSessionId: '',
    numbers: [],
    isCorrect: false,
    submittedAt: new Date().getTime(),
  })
);

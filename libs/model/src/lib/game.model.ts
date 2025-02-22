import { Game } from '@luna-academy-trial-of-numbers/definitions';
import { createMakeFunction } from './util';
import { makeAppEntity } from './app-entity.model';

export const makeGame = createMakeFunction<Game>(
  (): Game => ({
    ...makeAppEntity(),
    _type: 'Game',
    host: '',
    players: [],
    roundNumber: 0,
    numberSet: [],
    hintBoard: [],
    playerSubmissions: {},
    flippedHints: [],
    gameState: 'waiting',
    playerHands: {},
    currentRound: {
      endTime: '',
      submissions: {},
    },
    guesses: [],
    slots: {
      A: { submittedHints: [], isRevealed: false },
      B: { submittedHints: [], isRevealed: false },
      C: { submittedHints: [], isRevealed: false },
      D: { submittedHints: [], isRevealed: false },
    },  
  })
);

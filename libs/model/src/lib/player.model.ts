import { Player } from '@luna/definitions';
import { makeAppEntity } from './app-entity.model';
import { createMakeFunction } from './util';

export const makePlayer = createMakeFunction<Player>(
  (): Player => ({
    ...makeAppEntity(),
    _type: 'Player',
    name: '',
    score: 0,
    lobbySessionId: '',
  })
);

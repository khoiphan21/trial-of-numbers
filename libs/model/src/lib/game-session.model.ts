import { GameSession } from '@luna/definitions';
import { makeAppEntity } from './app-entity.model';
import { createMakeFunction } from './util';

export const makeGameSession = createMakeFunction<GameSession>(
  (): GameSession => ({
    ...makeAppEntity(),
    _type: 'GameSession',
    lobbySessionId: '',
    roundNumber: 1,
    numberSet: [],
    gameSessionState: 'in_progress',
  })
);

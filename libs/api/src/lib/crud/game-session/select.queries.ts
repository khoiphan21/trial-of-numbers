import { GameSession } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectGameSession =
  makeEntitySelectFunction<GameSession>('GameSession');

export const selectAllGameSessions = () =>
  selectDocs<GameSession>(
    'GameSession',
    orderByFieldOf<GameSession>('_createdAt', 'desc')
  );

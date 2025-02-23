import { LobbySession } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectLobbySession =
  makeEntitySelectFunction<LobbySession>('LobbySession');

export const selectAllLobbySessions = () =>
  selectDocs<LobbySession>(
    'LobbySession',
    orderByFieldOf<LobbySession>('_createdAt', 'desc')
  );

import { LobbySession } from '@luna/definitions';
import { orderByFieldOf, selectDocs, whereFieldOf } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';
import { distinctUntilChanged } from 'rxjs';
import { map } from 'rxjs';

export const selectLobbySession =
  makeEntitySelectFunction<LobbySession>('LobbySession');

export const selectLobbySessionByCode = (code: string) =>
  selectDocs<LobbySession>(
    'LobbySession',
    whereFieldOf<LobbySession, string>('joinCode', '==', code)
  ).pipe(
    // assume there is only one lobby session with a given code
    map((docs) => docs[0]),
    distinctUntilChanged()
  );

export const selectAllLobbySessions = () =>
  selectDocs<LobbySession>(
    'LobbySession',
    orderByFieldOf<LobbySession>('_createdAt', 'desc')
  );

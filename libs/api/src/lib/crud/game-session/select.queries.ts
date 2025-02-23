import { GameSession, LobbySessionId } from '@luna/definitions';
import { orderByFieldOf, selectDocs, whereFieldOf } from '@luna/firebase';
import { Observable } from 'rxjs';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectGameSession =
  makeEntitySelectFunction<GameSession>('GameSession');

export const selectAllGameSessions = () =>
  selectDocs<GameSession>(
    'GameSession',
    orderByFieldOf<GameSession>('_createdAt', 'desc')
  );

export const selectGameSessionsForLobby = (
  lobbySessionId: LobbySessionId
): Observable<GameSession[]> =>
  selectDocs<GameSession>(
    'GameSession',
    whereFieldOf<GameSession, LobbySessionId>(
      'lobbySessionId',
      '==',
      lobbySessionId
    )
  );

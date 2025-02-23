import { Player } from '@luna/definitions';
import { orderByFieldOf, selectDocs, whereFieldOf } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectPlayer = makeEntitySelectFunction<Player>('Player');

export const selectPlayersByLobbySessionId = (lobbySessionId: string) =>
  selectDocs<Player>(
    'Player',
    whereFieldOf<Player, string>('lobbySessionId', '==', lobbySessionId)
  );

export const selectAllPlayers = () =>
  selectDocs<Player>('Player', orderByFieldOf<Player>('_createdAt', 'desc'));

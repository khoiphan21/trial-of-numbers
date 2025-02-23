import { Player } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectPlayer = makeEntitySelectFunction<Player>('Player');

export const selectAllPlayers = () =>
  selectDocs<Player>('Player', orderByFieldOf<Player>('_createdAt', 'desc'));

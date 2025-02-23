import { Player } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addPlayer = makeAddFunction<Player>();

export const addPlayers = (...entities: Player[]) =>
  Promise.all(entities.map((Player) => addPlayer(Player)));

export const deletePlayer = makeDeleteFunction('Player');

export const updatePlayer = makeUpdateFunction<Player>('Player');

export const hardDeletePlayer = makeHardDeleteFunction('Player');

import { GameSession } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addGameSession = makeAddFunction<GameSession>();

export const addGameSessions = (...entities: GameSession[]) =>
  Promise.all(entities.map((GameSession) => addGameSession(GameSession)));

export const deleteGameSession = makeDeleteFunction('GameSession');

export const updateGameSession = makeUpdateFunction<GameSession>('GameSession');

export const hardDeleteGameSession = makeHardDeleteFunction('GameSession');

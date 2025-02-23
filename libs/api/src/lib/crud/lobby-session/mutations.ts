import { LobbySession } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addLobbySession = makeAddFunction<LobbySession>();

export const addLobbySessions = (...entities: LobbySession[]) =>
  Promise.all(entities.map((lobbySession) => addLobbySession(lobbySession)));

export const deleteLobbySession = makeDeleteFunction('LobbySession');

export const updateLobbySession =
  makeUpdateFunction<LobbySession>('LobbySession');

export const hardDeleteLobbySession = makeHardDeleteFunction('LobbySession');

import { LobbySession } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectLobbySession } from './select.queries';

export const getLobbySession = makeEntityGetFromSelect<LobbySession>(
  'LobbySession',
  selectLobbySession
);

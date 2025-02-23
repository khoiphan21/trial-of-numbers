import { LobbySession } from '@luna/definitions';
import { makeAppEntity } from './app-entity.model';
import { createMakeFunction } from './util';

export const makeLobbySession = createMakeFunction<LobbySession>(
  (): LobbySession => ({
    ...makeAppEntity(),
    _type: 'LobbySession',
    hostId: '',
    joinCode: generateJoinCode(),
    gameState: 'waiting',
  })
);

function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

import { DigitCount, LobbySession } from '@luna/definitions';
import { makeGameSession } from '@luna/model';
import { addGameSession } from '../crud/game-session/mutations';
import { updateLobbySession } from '../crud/lobby-session/mutations';

interface StartNewGameSessionInput {
  lobby: LobbySession;
  digitCount: DigitCount;
}

export async function startNewGameSession(input: StartNewGameSessionInput) {
  const { lobby, digitCount } = input;

  const numberSet = generateNumberSet(digitCount);

  const gameSession = makeGameSession({
    lobbySessionId: input.lobby.id,
    numberSet,
  });

  await addGameSession(gameSession);

  await updateLobbySession(lobby.id, {
    replace: {
      gameState: 'in_progress',
    },
  });
}

/**
 * Generates a set of numbers with the given digit count.
 * For example, if digitCount is 3, the returned set will be a set of 3 numbers,
 * each with 3 digits. Such as [1, 4, 9].
 *
 * @param digitCount The number of digits in the set.
 * @returns A set of numbers with the given digit count.
 *
 */
function generateNumberSet(digitCount: DigitCount): number[] {
  return Array.from({ length: digitCount }, () =>
    Math.floor(Math.random() * 10)
  );
}

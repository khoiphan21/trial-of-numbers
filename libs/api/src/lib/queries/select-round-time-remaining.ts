import { GameSession } from '@luna/definitions';
import { map, Observable, timer } from 'rxjs';

/**
 * Selects the time remaining for the current round of the game session, in milliseconds.
 * @param gameSession The game session to select the time remaining for.
 * @returns The time remaining for the current round of the game session.
 */
export function selectRoundTimeRemaining(
  gameSession: GameSession
): Observable<number> {
  return timer(0, 100).pipe(
    map(() => {
      const startTime = gameSession._createdAt;
      const currentTime = new Date();
      const timeElapsed = currentTime.getTime() - startTime;
      const timeRemaining = 10000 - timeElapsed;
      return timeRemaining;
    })
  );
}

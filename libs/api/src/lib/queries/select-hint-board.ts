import { filterUndefinedValues } from '@luna/core';
import {
  GameSession,
  HintBoard,
  HintBoardColumn,
  HintSubmission,
} from '@luna/definitions';
import { combineLatest, map, Observable } from 'rxjs';
import { selectGameSession } from '../crud/game-session';
import { selectHintSubmissionsForGameSession } from '../crud/hint-submission/select.queries';

export function selectHintBoard(gameSessionId: string): Observable<HintBoard> {
  const gameSession$ = selectGameSession(gameSessionId).pipe(
    filterUndefinedValues()
  );
  const hintSubmissions$ = selectHintSubmissionsForGameSession(gameSessionId);

  return combineLatest([gameSession$, hintSubmissions$]).pipe(
    filterUndefinedValues(),
    map(([gameSession, hintSubmissions]) =>
      makeHintBoard(gameSession, hintSubmissions)
    )
  );
}

function makeHintBoard(
  gameSession: GameSession,
  hintSubmissions: HintSubmission[]
): HintBoard {
  const hintMap = gameSession.numberSet.reduce((acc, _, index) => {
    acc[index] = {
      hints: [],
      slotIndex: index,
      slotValue: gameSession.numberSet[index],
    };
    return acc;
  }, {} as Record<number, HintBoardColumn>);

  hintSubmissions.forEach((hintSubmission) => {
    const slotIndex = hintSubmission.slotIndex;
    const column = hintMap[slotIndex] ?? {
      hints: [],
      slotIndex,
    };
    column.hints.push(hintSubmission);
    hintMap[slotIndex] = column;
  });

  const hintBoard: HintBoard = {
    id: gameSession.id,
    sortedColumns: Object.values(hintMap)
      .map((column) => ({
        ...column,
        hints: sortHints(column.hints),
      }))
      .sort((a, b) => a.slotIndex - b.slotIndex),
  };

  return hintBoard;
}

function sortHints(hints: HintSubmission[]): HintSubmission[] {
  // first split the hints into correct and incorrect
  const correctHints = hints
    .filter((hint) => hint.isCorrect)
    .sort((a, b) => a.submittedAt - b.submittedAt);
  const incorrectHints = hints
    .filter((hint) => !hint.isCorrect)
    .sort((a, b) => a.submittedAt - b.submittedAt);

  // then combine the sorted hints
  return [...correctHints, ...incorrectHints];
}

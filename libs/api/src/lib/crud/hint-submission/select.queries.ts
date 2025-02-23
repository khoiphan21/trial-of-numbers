import { GameSessionId, HintSubmission } from '@luna/definitions';
import { orderByFieldOf, selectDocs, whereFieldOf } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';
import { map } from 'rxjs';
import { Observable } from 'rxjs';

export const selectHintSubmission =
  makeEntitySelectFunction<HintSubmission>('HintSubmission');

export function selectHintSubmissionsForGameSession(
  gameSessionId: string
): Observable<HintSubmission[]> {
  return selectDocs<HintSubmission>(
    'HintSubmission',
    whereFieldOf<HintSubmission, GameSessionId>(
      'gameSessionId',
      '==',
      gameSessionId
    ),
    orderByFieldOf<HintSubmission>('_createdAt', 'desc')
  );
}

export const selectAllHintSubmissions = () =>
  selectDocs<HintSubmission>(
    'HintSubmission',
    orderByFieldOf<HintSubmission>('_createdAt', 'desc')
  );

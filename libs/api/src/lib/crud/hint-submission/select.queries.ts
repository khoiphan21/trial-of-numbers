import { HintSubmission } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectHintSubmission =
  makeEntitySelectFunction<HintSubmission>('HintSubmission');

export const selectAllHintSubmissions = () =>
  selectDocs<HintSubmission>(
    'HintSubmission',
    orderByFieldOf<HintSubmission>('_createdAt', 'desc')
  );

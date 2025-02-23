import { HintType } from '@luna/definitions';
import { orderByFieldOf, selectDocs } from '@luna/firebase';
import { makeEntitySelectFunction } from '../util/make-select-function';

export const selectHintType = makeEntitySelectFunction<HintType>('HintType');

export const selectAllHintTypes = () =>
  selectDocs<HintType>(
    'HintType',
    orderByFieldOf<HintType>('_createdAt', 'desc')
  );

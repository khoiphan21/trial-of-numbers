import { HintType } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectHintType } from './select.queries';

export const getHintType = makeEntityGetFromSelect<HintType>(
  'HintType',
  selectHintType
);

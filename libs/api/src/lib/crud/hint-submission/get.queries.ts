import { HintSubmission } from '@luna/definitions';
import { makeEntityGetFromSelect } from '../util/make-entity-get-from-select';
import { selectHintSubmission } from './select.queries';

export const getHintSubmission = makeEntityGetFromSelect<HintSubmission>(
  'HintSubmission',
  selectHintSubmission
);

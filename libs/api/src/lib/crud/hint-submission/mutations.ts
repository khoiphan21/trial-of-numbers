import { HintSubmission } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addHintSubmission = makeAddFunction<HintSubmission>();

export const addHintSubmissions = (...entities: HintSubmission[]) =>
  Promise.all(
    entities.map((HintSubmission) => addHintSubmission(HintSubmission))
  );

export const deleteHintSubmission = makeDeleteFunction('HintSubmission');

export const updateHintSubmission =
  makeUpdateFunction<HintSubmission>('HintSubmission');

export const hardDeleteHintSubmission =
  makeHardDeleteFunction('HintSubmission');

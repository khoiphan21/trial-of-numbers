import { HintType } from '@luna/definitions';
import { makeAddFunction } from '../util/make-add-function';
import {
  makeDeleteFunction,
  makeHardDeleteFunction,
} from '../util/make-delete-function';
import { makeUpdateFunction } from '../util/make-update-function';

export const addHintType = makeAddFunction<HintType>();

export const addHintTypes = (...entities: HintType[]) =>
  Promise.all(entities.map((HintType) => addHintType(HintType)));

export const deleteHintType = makeDeleteFunction('HintType');

export const updateHintType = makeUpdateFunction<HintType>('HintType');

export const hardDeleteHintType = makeHardDeleteFunction('HintType');

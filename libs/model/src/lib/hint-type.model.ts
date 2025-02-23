import { HintType } from '@luna/definitions';
import { createMakeFunction } from './util';
import { makeAppEntity } from './app-entity.model';

export const makeHintType = createMakeFunction<HintType>(
  (): HintType => ({
    ...makeAppEntity(),
    _type: 'HintType',
    name: '',
    description: '',
    validationRule: '',
  })
);

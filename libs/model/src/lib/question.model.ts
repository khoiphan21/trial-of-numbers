import { Question } from '@luna-academy-trial-of-numbers/definitions';
import { createMakeFunction } from './util';
import { makeAppEntity } from './app-entity.model';

export const makeQuestion = createMakeFunction<Question>(
  (): Question => ({
    ...makeAppEntity(),
    _type: 'Question',
  })
);

import { HintSubmission } from '@luna/definitions';
import { makeAppEntity } from './app-entity.model';
import { createMakeFunction } from './util';

export const makeHintSubmission = createMakeFunction<HintSubmission>(
  (): HintSubmission => ({
    ...makeAppEntity(),
    _type: 'HintSubmission',
    playerId: '',
    gameSessionId: '',
    hintTypeId: '',
    submittedAt: Date.now(),
    isCorrect: false,
  })
);

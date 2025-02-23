/* eslint-disable @typescript-eslint/no-empty-function */
import { BehaviorSubject } from 'rxjs';
import { UploadTask } from './definition';

export function createMockUploadTask(): UploadTask {
  return {
    percentageChanges$: new BehaviorSubject(100),
    resume: () => {},
    pause: () => {},
    cancel: () => {},
    complete: async () => `download-url`,
  };
}

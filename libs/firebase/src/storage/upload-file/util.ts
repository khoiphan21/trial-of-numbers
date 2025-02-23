import { getFirstValue } from '@luna/core';
import {
  UploadTask as FirebaseUploadTask,
  getDownloadURL,
} from 'firebase/storage';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { SEVEN_DAYS, UploadTask } from './definition';

export function makeUploadTask(task: FirebaseUploadTask): UploadTask {
  const percentageChanges$ = new BehaviorSubject<number>(0);

  const result$ = new ReplaySubject<string>(1);

  task.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      percentageChanges$.next(roundProgress(progress) || 0);
    },
    (error) => {
      console.error('Failed to upload: ', error);
    },
    async () => {
      try {
        const url = await getDownloadURL(task.snapshot.ref);
        result$.next(url);
        result$.complete();
      } catch (error) {
        const errorMessage =
          `Failed to get download URL for uploaded file: ` + error;
        console.error(errorMessage);
        result$.error(errorMessage);
      }
    }
  );

  return {
    percentageChanges$,
    resume: task.resume,
    pause: task.pause,
    cancel: task.cancel,
    complete: () =>
      getFirstValue({
        observable: result$,
        name: 'final URL after upload',
        timeout: SEVEN_DAYS, // if it takes longer than 7 days to upload... GG
      }),
  };
}

export function roundProgress(
  progress: number | undefined
): number | undefined {
  if (!progress) {
    return progress;
  }

  return Math.floor(progress);
}

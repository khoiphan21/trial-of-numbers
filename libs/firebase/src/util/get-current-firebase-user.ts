import { getAuth } from 'firebase/auth';
import { shouldMock } from '../testing';
import { FirebaseUser } from '../types';
import { createMockFirebaseUser } from './create-mock-firebase-user';

export async function getCurrentFirebaseUser(): Promise<
  FirebaseUser | undefined
> {
  if (shouldMock()) {
    return createMockFirebaseUser();
  }

  return new Promise((resolve, reject) => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        resolve(undefined);
      }

      resolve(user as FirebaseUser);
    }, reject);
  });
}

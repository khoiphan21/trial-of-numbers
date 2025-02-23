import { resetFirestoreMock } from './firestore-mock';

let shouldMockFirebase = false;

export function mockFirebase(status = true) {
  shouldMockFirebase = status;

  if (shouldMockFirebase) {
    resetFirestoreMock();
  }
}

export function shouldMock(): boolean {
  return shouldMockFirebase;
}

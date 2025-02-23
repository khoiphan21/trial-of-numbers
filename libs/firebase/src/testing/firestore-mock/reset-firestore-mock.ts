import { getFirestoreMockCollectionMap } from './util';

export function resetFirestoreMock() {
  getFirestoreMockCollectionMap().clear();
}

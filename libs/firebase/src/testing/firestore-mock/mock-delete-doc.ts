import { CollectionType, UUID } from '@luna/definitions';
import {
  EntitySubject,
  getFirestoreMockCollectionMap,
  getMapSafe,
} from './util';

export function mockDeleteDoc(type: CollectionType, entityId: UUID) {
  const entityMap = getMapSafe(
    getFirestoreMockCollectionMap(),
    type,
    () => new Map<string, EntitySubject>()
  );

  const entitySubject = entityMap?.get(entityId);

  if (!entitySubject?.value) {
    throw Error(
      `FirestoreMock Error: entity "${entityId}" does not exist for delete operation`
    );
  }

  entitySubject.next(undefined);
}

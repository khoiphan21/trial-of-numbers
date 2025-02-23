import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import {
  EntitySubject,
  getFirestoreMockCollectionMap,
  getMapSafe,
} from './util';

export function mockGetDoc<T extends AppEntity>(
  collection: CollectionType,
  id: UUID
): T | undefined {
  const entityMap = getMapSafe(
    getFirestoreMockCollectionMap(),
    collection,
    () => new Map<string, EntitySubject>()
  );

  const subject = entityMap?.get(id);

  return subject?.value as T | undefined;
}

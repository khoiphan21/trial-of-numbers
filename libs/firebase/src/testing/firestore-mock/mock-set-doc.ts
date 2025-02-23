import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { BehaviorSubject } from 'rxjs';
import {
  EntitySubject,
  getFirestoreMockCollectionMap,
  getMapSafe,
} from './util';

export function mockSetDoc<T extends AppEntity>(
  type: CollectionType,
  entityId: UUID,
  props: T
) {
  const entityMap = getMapSafe(
    getFirestoreMockCollectionMap(),
    type,
    () => new Map<string, EntitySubject>()
  );

  entityMap?.set(entityId, new BehaviorSubject<AppEntity | undefined>(props));
}

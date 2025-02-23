import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import {
  EntitySubject,
  getFirestoreMockCollectionMap,
  getMapSafe,
} from './util';

export function mockUpdateDoc<T extends AppEntity>(
  type: CollectionType,
  entityId: UUID,
  props: Partial<T>
) {
  const entityMap = getMapSafe(
    getFirestoreMockCollectionMap(),
    type,
    () => new Map<string, EntitySubject>()
  );

  const entitySubject = entityMap?.get(entityId);

  if (!entitySubject?.value) {
    throw Error(
      `FirestoreMock Error: entity "${entityId}" does not exist for update operation`
    );
  }

  /**
   * Remove all field with value {"_methodName": "deleteField"} from the
   * given object
   *
   * This value is from deleteFirestoreField()
   *
   * @param object the object to remove "deleted" fields for
   */
  function filterDeletedFields(object: any) {
    const keys = Object.keys(object);

    return keys.reduce((currentObj, key) => {
      if (object[key] && object[key]?._methodName === 'deleteField') {
        return currentObj;
      }

      return { ...currentObj, [key]: object[key] };
    }, {});
  }

  const newEntity = filterDeletedFields({ ...entitySubject.value, ...props });

  entitySubject.next(newEntity as T);
}

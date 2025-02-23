import { AppEntity, CollectionType } from '@luna/definitions';
import { combineLatest, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  EntitySubject,
  getFirestoreMockCollectionMap,
  getMapSafe,
} from './util';

export function mockSelectAllDocs<T extends AppEntity>(
  collection: CollectionType
): Observable<T[]> {
  const subjectMap = getMapSafe(
    getFirestoreMockCollectionMap(),
    collection,
    () => new Map<string, EntitySubject>()
  );

  const subjects = Array.from(subjectMap.values());

  const entitiesStream = combineLatest(subjects) as Observable<T[]>;

  return subjects.length ? entitiesStream : entitiesStream.pipe(startWith([]));
}

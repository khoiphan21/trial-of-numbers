import { AppEntity, CollectionType } from '@luna/definitions';
import { Observable } from 'rxjs';
import { QueryConstraint } from '../../make-query-constraints';
import { addConstraintsToCollectionRef } from './add-constraints-to-collection-ref';
import { CollectionRefMock } from './collection-ref-mock-class';

export function mockSelectEntities<T extends AppEntity>(
  collectionType: CollectionType,
  ...conditions: QueryConstraint[]
): Observable<T[]> {
  const collectionRef = new CollectionRefMock(collectionType);

  addConstraintsToCollectionRef(conditions, collectionRef);

  return collectionRef.getEntitySubjects() as Observable<T[]>;
}

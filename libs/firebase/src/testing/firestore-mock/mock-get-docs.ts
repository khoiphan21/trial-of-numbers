import { AppEntity, CollectionType } from '@luna/definitions';
import { QueryConstraint } from '../../make-query-constraints';
import { addConstraintsToCollectionRef } from './add-constraints-to-collection-ref';
import { CollectionRefMock } from './collection-ref-mock-class';

export function mockGetDocs<T extends AppEntity>(
  collectionType: CollectionType,
  ...conditions: QueryConstraint[]
): T[] {
  const collectionRef = new CollectionRefMock(collectionType);

  addConstraintsToCollectionRef(conditions, collectionRef);

  return collectionRef.getEntities() as T[];
}

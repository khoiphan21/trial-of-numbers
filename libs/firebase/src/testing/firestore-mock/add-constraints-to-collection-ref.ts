import { QueryConstraint } from '../../make-query-constraints';
import { CollectionRefMock } from './collection-ref-mock-class';

export function addConstraintsToCollectionRef(
  conditions: QueryConstraint[],
  collectionRef: CollectionRefMock
) {
  conditions.forEach((condition) => {
    switch (condition.type) {
      case 'where':
        if (!condition.field || !condition.condition) {
          return;
        }

        collectionRef.where(
          condition.field,
          condition.condition,
          condition.value
        );
        break;

      case 'orderBy':
        collectionRef.orderBy(
          String(condition.field),
          condition.direction || 'asc'
        );
        break;
      case 'limit':
        collectionRef.limit(condition.limit);
        break;
    }
  });
}

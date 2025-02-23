import { makeWith } from '@luna/core';
import { AppEntity, CollectionType } from '@luna/definitions';
import {
  FirebaseSortDirection,
  QueryConstraint,
  whereFieldOf,
} from '@luna/firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { byCreatedAt, SortFunction } from '../sort-functions';
import { selectDocsFromCollection } from './select-docs-from-collection';

interface SelectOrderedEntitiesInput<Entity extends AppEntity> {
  constraints: QueryConstraint<Entity, any>[];
  sortFn: SortFunction;
  direction: FirebaseSortDirection;
  validEntitiesOnly: boolean;
}

const createDefault = (): SelectOrderedEntitiesInput<any> => ({
  constraints: [],
  sortFn: byCreatedAt,
  direction: 'asc',
  validEntitiesOnly: true,
});

/**
 * Retrieve entities with the given inputs, such as constraints, sort direction
 * etc.
 *
 * Note: to query only deleted entities, set `validEntitiesOnly` to `false`, and
 * use an additional constraint where `_deleted` is `true`
 *
 * @param collectionType which collection to get from
 * @param given the input for the query
 *
 * @returns the list of entities matching the query
 */
export function selectOrderedEntities<Entity extends AppEntity>(
  collectionType: CollectionType,
  given: Partial<SelectOrderedEntitiesInput<Entity>> = {}
): Observable<Entity[]> {
  const { constraints, sortFn, direction, validEntitiesOnly } =
    makeWith(createDefault)(given);

  if (validEntitiesOnly) {
    constraints.push(whereFieldOf<AppEntity, boolean>('_deleted', '==', false));
  }

  return selectDocsFromCollection<Entity>(collectionType, ...constraints).pipe(
    map((entities) => entities.sort(sortFn(direction)))
  );
}

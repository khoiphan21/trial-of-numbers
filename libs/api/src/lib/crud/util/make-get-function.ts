import { makeWith, onlyTruthyValues } from '@luna/core';
import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import {
  FirebaseSortDirection,
  getDoc,
  getDocs,
  QueryConstraint,
  whereFieldOf,
} from '@luna/firebase';
import { byCreatedAt, SortFunction } from './sort-functions';

export const makeEntityGetFunction =
  <T extends AppEntity>(collectionType: CollectionType) =>
  async (id: UUID): Promise<T | undefined> => {
    return getDoc<T>(collectionType, id);
  };

export const getDocsFromCollection = getDocs;

interface GetOrderedEntitiesInput {
  constraints: QueryConstraint[];
  sortFn: SortFunction;
  direction: FirebaseSortDirection;
  validEntitiesOnly: boolean;
}

const createDefault = (): GetOrderedEntitiesInput => ({
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
export async function getOrderedEntities<Entity extends AppEntity>(
  collectionType: CollectionType,
  given: Partial<GetOrderedEntitiesInput> = {}
): Promise<Entity[]> {
  const { constraints, sortFn, direction, validEntitiesOnly } =
    makeWith(createDefault)(given);

  if (validEntitiesOnly) {
    constraints.push(whereFieldOf<AppEntity, boolean>('_deleted', '==', false));
  }

  const entities = await getDocsFromCollection<Entity>(
    collectionType,
    ...constraints.filter(onlyTruthyValues)
  );

  return entities.sort(sortFn(direction));
}

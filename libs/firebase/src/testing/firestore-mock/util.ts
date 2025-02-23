import { notNullOrUndefined } from '@luna/core';
import { AppEntity, CollectionType } from '@luna/definitions';
import { BehaviorSubject } from 'rxjs';
import {
  LimitQueryConstraint,
  OrderByQueryConstraint,
  QueryConstraint,
} from '../../make-query-constraints';

export type EntitySubject = BehaviorSubject<AppEntity | undefined>;

export type EntitySubjectMap = Map<string, EntitySubject>;

export type CollectionMap = Map<CollectionType, EntitySubjectMap>;

const collectionMap: CollectionMap = new Map<
  CollectionType,
  EntitySubjectMap
>();

export function getFirestoreMockCollectionMap() {
  return collectionMap;
}

export function getMapSafe<Key, Value>(
  givenMap: Map<Key, Value>,
  key: any,
  createDefault: () => Value
) {
  if (!givenMap.has(key)) {
    givenMap.set(key, createDefault());
  }

  return givenMap.get(key) as Value;
}

export function getEntitiesMapSafe(type: CollectionType) {
  const collectionMap = getFirestoreMockCollectionMap();

  const entitiesMap = collectionMap.get(type);

  if (!entitiesMap) {
    collectionMap.set(type, new Map());
  }

  return collectionMap.get(type);
}

export function filterOrderAndLimit<T>(
  allEntities: T[],
  constraints: QueryConstraint[]
): T[] {
  const filteredEntities = filterByWhereConstrains<T>(allEntities, constraints);

  const orderByConstraint = constraints.find(
    (c) => c.type === 'orderBy'
  ) as OrderByQueryConstraint<T>;

  const orderedEntities = orderEntitiesByConstraint<T>(
    filteredEntities,
    orderByConstraint
  );

  const limitConstraint = constraints.find(
    (c) => c.type === 'limit'
  ) as LimitQueryConstraint;

  return limitResultAmount(orderedEntities, limitConstraint);
}

function filterByWhereConstrains<T>(
  allEntities: T[],
  constraints: QueryConstraint[]
) {
  return constraints
    .filter((c) => c.type === 'where')
    .reduce((entities, constraint) => {
      return (
        entities
          .filter(notNullOrUndefined)
          // filter `where` constraints
          .filter((entity) => {
            const { field, condition, value } = constraint;

            switch (condition) {
              case '==':
                return (entity as any)[String(field)] === value;
              default:
                throw Error(
                  `FirestoreMock does not support condition "${condition}"`
                );
            }
          })
      );
    }, allEntities);
}

function orderEntitiesByConstraint<T>(
  filteredEntities: T[],
  orderByConstraint: OrderByQueryConstraint<T> | undefined
) {
  if (!orderByConstraint) {
    return filteredEntities;
  }

  return filteredEntities.sort((a: any, b: any) => {
    const field = String(orderByConstraint.field);

    if (orderByConstraint.direction === 'desc') {
      return b[field] > a[field] ? 1 : -1;
    }

    return b[field] > a[field] ? -1 : 1;
  });
}

function limitResultAmount<T>(
  entities: T[],
  limitConstraint: LimitQueryConstraint | undefined
) {
  if (!limitConstraint) {
    return entities;
  }

  return entities.filter((_, index) => {
    return index < limitConstraint.limit;
  });
}

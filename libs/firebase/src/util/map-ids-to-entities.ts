import {
  combineStreamsSafe,
  onlyTruthyValues,
  onlyValidEntities,
} from '@luna/core';
import { ArrayOrList, UUID } from '@luna/definitions';
import { List } from 'immutable';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseSortDirection } from '../types';

export const mapIdsToEntities = <T>(
  ids: ArrayOrList<UUID | undefined>,
  selectFn: (id: UUID, direction?: FirebaseSortDirection) => Observable<T>,
  direction: FirebaseSortDirection = 'asc'
): Observable<Array<T>> => {
  if (!ids) {
    return new BehaviorSubject([]);
  }

  const filteredIds = List(ids)
    .toArray()
    .filter(onlyTruthyValues) as Array<UUID>;

  return combineStreamsSafe(
    filteredIds.map((id) => selectFn(id, direction))
  ).pipe(map((array) => array.filter(onlyValidEntities)));
};

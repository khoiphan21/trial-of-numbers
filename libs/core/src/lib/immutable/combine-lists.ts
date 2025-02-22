import { List, Set } from 'immutable';

export function combineLists<T>(lists: List<T>[]): List<T> {
  const sets = lists.map(list => list.toSet());
  const mergedSets = Set.union<T>(sets);

  return mergedSets.toList().sort();
}

import { List } from 'immutable';

export function removeItems<T>(toRemove: List<T>) {
  return {
    fromList: (baseList: List<T>): List<T> => {
      return baseList.filter(item => !toRemove.contains(item));
    },
  };
}

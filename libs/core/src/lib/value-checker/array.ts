import { ArrayOrList } from '@luna-academy-trial-of-numbers/definitions';
import { List } from 'immutable';
import { pipe } from 'ramda';
import { valueIsTruthy } from './all';

export const uniqueValues = <T>(array: Array<T>): Array<T> =>
  Array.from(new Set(array));

export const noFalsyValueInArrayUnsafe = (array: Array<any>) =>
  array.every(valueIsTruthy);

export const checkArrayValid =
  (messagePrefix: string) =>
  <T>(array: T[] | undefined | null) => {
    const errorMessage = `${messagePrefix}: Given array must not be `;

    if (array === null) {
      throw Error(errorMessage + 'null');
    }

    if (array === undefined) {
      throw Error(errorMessage + 'undefined');
    }

    // When control reaches here, the array is safe
    return array;
  };

/**
 * Check if there is any 'falsy' values in the array. 'Falsy' values are those
 * that `!value` will return `False`
 *
 * @param array The array whose values are to be checked
 *
 * @return true if there are no falsy values in the array, false if there is
 *         at least one
 */
export const noFalsyValueInArray: <T>(
  array: Array<T> | undefined | null
) => boolean = pipe(
  checkArrayValid('noFalsyValueInArray() failed'),
  noFalsyValueInArrayUnsafe
);

export const noFalsyValueInList = <T>(list: ArrayOrList<T>) =>
  noFalsyValueInArray(List(list).toArray());

export const filterFalsyValues = <T>(list: List<T>): List<T> => {
  return list.filter((item) => !!item);
};

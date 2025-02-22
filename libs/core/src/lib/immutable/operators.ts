import { ArrayOrList } from '@luna-academy-trial-of-numbers/definitions';
import { List } from 'immutable';

export const getAtIndex =
  (index: number) =>
  <T>(list: ArrayOrList<T>): T | undefined =>
    List(list).get(index);

export const firstOf = getAtIndex(0);
export const secondOf = getAtIndex(1);
export const thirdOf = getAtIndex(2);
export const fourthOf = getAtIndex(3);
export const fifthOf = getAtIndex(4);
export const sixthOf = getAtIndex(5);
export const seventhOf = getAtIndex(6);
export const eighthOf = getAtIndex(7);
export const ninthOf = getAtIndex(8);
export const tenthOf = getAtIndex(9);

export const lastOf = <T>(list: ArrayOrList<T>): T | undefined =>
  List(list).last(undefined);

/**
 * General type for the order function
 */
export type OrderFunction = <T>(list: List<T>) => T | undefined;

/**
 * Identifier to be used with `getOrderFn()`
 */
export type OrderFunctionIdentifier =
  | 'first'
  | 'second'
  | 'third'
  | 'fourth'
  | 'fifth'
  | 'sixth'
  | 'seventh'
  | 'eighth'
  | 'ninth'
  | 'tenth';

/**
 * Get the order function (to retrieve items from lists) based on an identifier
 *
 * @param identifier what order function to be returned;
 * @returns the order function associated with the identifier
 */
export function getOrderFunction(
  identifier: OrderFunctionIdentifier
): OrderFunction {
  switch (identifier) {
    case 'first':
      return firstOf;
    case 'second':
      return secondOf;
    case 'third':
      return thirdOf;
    case 'fourth':
      return fourthOf;
    case 'fifth':
      return fifthOf;
    case 'sixth':
      return sixthOf;
    case 'seventh':
      return seventhOf;
    case 'eighth':
      return eighthOf;
    case 'ninth':
      return ninthOf;
    case 'tenth':
      return tenthOf;
    default:
      throw Error(`No order function found for dentifier ${identifier}.`);
  }
}

import { filterObject } from '../filter-object';

/**
 * Used to create a 'make' function that takes a partial object and
 * return a full object of a given type, with all missing values filled
 * in with the default values returned by the `defaultFn` argument.
 *
 * Note that any extra parameters not in the default object created
 * will be filtered out. This is to prevent accidentally sending extra
 * properties to the GraphQL backend, causing an unexpected error.
 *
 * @param defaultFn The function used to create the Default Object
 *
 * @returns a function that takes one argument: a partial of the type
 *          of object to be created
 */
export function makeWith<T>(defaultFn: () => T) {
  return (params?: Partial<T>): T => {
    const defaultObj = defaultFn();
    return Object.freeze({
      ...defaultObj,
      ...filterObject(params, defaultObj),
    });
  };
}

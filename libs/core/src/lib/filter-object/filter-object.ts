import { notNullOrUndefined } from '../value-checker';

/**
 * Return a new object with only the properties defined in `byObject`, but
 * values retrieved from `target` if exist, otherwise retrieve from `byObject`
 * @param target - The source object to filter
 * @param byObject - The object whose properties define the shape
 */
export function filterObject<T extends Record<string, unknown>>(
  target: T | null | undefined,
  byObject: T
): T {
  if (target === null || target === undefined) {
    return byObject;
  }

  return Object.keys(byObject).reduce<T>((obj, key) => {
    const targetValue = target[key];
    const defaultValue = byObject[key];

    let finalValue: unknown;
    if (typeof targetValue === 'string') {
      // only store non-empty strings, otherwise use the default value
      finalValue = targetValue ? targetValue : defaultValue;
    } else {
      finalValue = notNullOrUndefined(targetValue) ? targetValue : defaultValue;
    }

    return {
      ...obj,
      [key]: finalValue,
    };
  }, {} as T);
}

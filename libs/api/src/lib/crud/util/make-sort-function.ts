import { FirebaseSortDirection } from '@luna/firebase';

export const makeSortFunction =
  <T>(sortDirection: FirebaseSortDirection, givenProp?: keyof T) =>
  (a: T, b: T) => {
    const prop = `${String(givenProp) || 'order'}`;

    return sortDirection === 'asc'
      ? (a as any)[prop] - (b as any)[prop]
      : (b as any)[prop] - (a as any)[prop];
  };

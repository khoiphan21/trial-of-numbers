import { deleteField } from 'firebase/firestore';

export function deleteFirestoreField() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return deleteField() as any;
}

export function replaceUndefinedFields<T>(object: T | undefined): T {
  if (!object) return {} as T;

  return Object.keys(object).reduce((finalObject, key) => {
    const value = (object as any)[key];

    return {
      ...finalObject,
      [key]: value === undefined ? deleteFirestoreField() : value,
    };
  }, {} as T);
}

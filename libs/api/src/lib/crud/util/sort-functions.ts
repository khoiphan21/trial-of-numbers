import { AppEntity } from '@luna/definitions';
import { FirebaseSortDirection } from '@luna/firebase';

export type SortFunction = (
  direction: FirebaseSortDirection
) => (a: AppEntity, b: AppEntity) => number;

const makeSortFunctionBy = (
  key: keyof Pick<AppEntity, '_createdAt' | '_updatedAt' | 'order'>
): SortFunction => {
  return (direction: FirebaseSortDirection) =>
    (a: AppEntity, b: AppEntity): number => {
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    };
};

export const byCreatedAt = makeSortFunctionBy('_createdAt');

export const byUpdatedAt = makeSortFunctionBy('_updatedAt');

export const byOrder = makeSortFunctionBy('order');

import { ArrayOrList } from '@luna-academy-trial-of-numbers/definitions';
import { List } from 'immutable';

interface SoftDeletableEntity {
  isDeleted?: boolean;
}

export function filterDeletedEntity<T extends SoftDeletableEntity>(
  entities: ArrayOrList<T>
): List<T> {
  return List(entities).filter((entity) => !entity.isDeleted);
}

export const filterDeletedForms = filterDeletedEntity;

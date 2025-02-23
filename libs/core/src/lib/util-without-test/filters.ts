import { EntityWithId, ArrayOrList } from '@luna/definitions';
import { List } from 'immutable';
import { notNullOrUndefined } from '../value-checker';

export function getId(entity: EntityWithId): string {
  return entity.id;
}

export const idsOf = <T extends EntityWithId>(
  entities: ArrayOrList<T | undefined>
): Array<string> => {
  const filteredEntities = List(entities).filter(notNullOrUndefined) as List<T>;

  return filteredEntities.map(getId).toArray();
};

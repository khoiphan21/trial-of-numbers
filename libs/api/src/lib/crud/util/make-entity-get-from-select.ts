import { getFirstValue } from '@luna/core';
import { CollectionType, UUID } from '@luna/definitions';
import { Observable } from 'rxjs';

export function makeEntityGetFromSelect<Entity>(
  collection: CollectionType,
  selectFn: (id: UUID) => Observable<Entity | undefined>
) {
  return (id: UUID) =>
    getFirstValue({
      observable: selectFn(id),
      truthyOnly: false,
      name: `Observable for ${collection}: ${id}`,
    });
}

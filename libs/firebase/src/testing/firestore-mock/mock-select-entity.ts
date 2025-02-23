import { firstOf } from '@luna/core';
import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mockSelectAllDocs } from './mock-select-all-docs';
import { filterOrderAndLimit } from './util';

export function mockSelectEntity<T extends AppEntity>(
  type: CollectionType,
  entityId: UUID
): Observable<T | undefined> {
  return mockSelectAllDocs<T>(type).pipe(
    map((entities) =>
      filterOrderAndLimit(entities, [
        {
          type: 'where',
          field: 'id',
          condition: '==',
          value: entityId,
        },
      ])
    ),
    map((entities) => firstOf(entities))
  );
}

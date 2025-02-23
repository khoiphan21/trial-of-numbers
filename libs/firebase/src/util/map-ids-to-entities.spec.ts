import { nanoid } from '@luna/core';
import { firstValueFrom, of, timeout } from 'rxjs';
import { mapIdsToEntities } from './map-ids-to-entities';

interface Entity {
  id: string;
  value: string;
}

const makeEntity = (): Entity => ({
  id: nanoid(),
  value: nanoid(),
});

describe('mapIdsToEntities()', () => {
  it('should filter out falsy values from the id list', async () => {
    const entity1 = makeEntity();
    const entity2 = makeEntity();
    const ids = [entity1.id, '', undefined, entity2.id];

    const selectFn = (id: string | null | undefined) => {
      if (!id) {
        throw Error('trying to select an invalid ID');
      }
      return id === entity1.id ? of(entity1) : of(entity2);
    };

    const result = await firstValueFrom(
      mapIdsToEntities(ids, selectFn).pipe(timeout(100))
    );

    expect(result).toEqual([entity1, entity2]);
  });
});

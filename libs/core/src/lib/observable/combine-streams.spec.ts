import { filter, firstValueFrom, of } from 'rxjs';
import { firstOf, secondOf, sleepUntil } from '..';
import { nanoid } from '../util-without-test';
import { combineStreamsSafe } from './combine-streams';

interface Entity {
  id: string;
  value: string;
}

const makeEntity = (): Entity => ({
  id: nanoid(),
  value: nanoid(),
});

describe(combineStreamsSafe.name, () => {
  it('should return an observable with empty array values when no ids given', async () => {
    const observable = combineStreamsSafe([]);

    const firstGet = await firstValueFrom(observable);
    expect(firstGet).toEqual([]);

    // Check that the observable can return every time it's called
    const secondGet = await firstValueFrom(observable);

    expect(secondGet).toEqual([]);
  });

  it('should return the latest values of the given streams', async () => {
    const entity1 = makeEntity();
    const entity2 = makeEntity();

    const stream1 = of(entity1);
    const stream2 = of(undefined, entity2);

    const observable = combineStreamsSafe([stream1, stream2]).pipe(
      filter(([value1, value2]) => {
        return value1?.id === entity1.id && value2?.id === entity2.id;
      })
    );

    await sleepUntil(
      'both entities retrieved',
      async () => {
        const result = await firstValueFrom(observable);

        return (
          firstOf(result)?.id === entity1.id &&
          secondOf(result)?.id === entity2.id
        );
      },
      10,
      500
    );
  });
});

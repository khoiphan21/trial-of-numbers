import { List } from 'immutable';
import { nanoid } from '../util-without-test';
import { removeItems } from './filter-list';

const makeMockEntity = () => ({
  id: nanoid(),
});

describe('usingEqualityFunction()', () => {
  it('should remove objects correctly', () => {
    const entity1 = makeMockEntity();
    const entity2 = makeMockEntity();
    const entity3 = makeMockEntity();

    const toRemove = List([entity2, entity3]);

    const base = List([entity1, entity2, entity3]);

    const expected = List([entity1]);

    const result = removeItems(toRemove).fromList(base);

    expect(result.equals(expected)).toBe(true);
  });
});

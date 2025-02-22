import { List } from 'immutable';
import { combineLists } from './combine-lists';

describe('combineLists() ', () => {
  it('should return an empty list if given none', () => {
    expect(combineLists([])).toEqual(List());
  });

  it('should combine two basic lists', () => {
    const combined = combineLists([List([1, 2]), List([3, 4])]);
    expect(combined).toEqual(List([1, 2, 3, 4]));
  });

  describe('replacing duplicates', () => {
    it('should replace number duplicates', () => {
      const combined = combineLists([List([1, 2]), List([2, 3])]);
      expect(combined).toEqual(List([1, 2, 3]));
    });

    it('should replace string duplicates', () => {
      const list1 = List(['a', 'b']);
      const list2 = List(['b', 'c']);
      const combined = combineLists([list1, list2]);
      expect(combined).toEqual(List(['a', 'b', 'c']));
    });
  });
});

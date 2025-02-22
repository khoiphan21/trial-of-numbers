import { List } from 'immutable';
import { firstOf, getAtIndex, lastOf } from './operators';

describe('Operators', () => {
  const list = List([0, 1, 2]);

  describe('getAtIndex()', () => {
    it('getAtIndex() should return object at the given index', () => {
      expect(getAtIndex(0)(list)).toEqual(0);
      expect(getAtIndex(1)(list)).toEqual(1);
      expect(getAtIndex(2)(list)).toEqual(2);
    });
    it('getAtIndex() should work for arrays', () => {
      expect(getAtIndex(0)(list.toArray())).toEqual(0);
      expect(getAtIndex(1)(list.toArray())).toEqual(1);
      expect(getAtIndex(2)(list.toArray())).toEqual(2);
    });
  });

  describe('firstOf()', () => {
    it('firstOf() should return the first item', () => {
      expect(firstOf(list)).toEqual(0);
    });

    it('firstOf() should return for an array', () => {
      expect(firstOf(list.toArray())).toEqual(0);
    });
  });

  describe('lastOf()', () => {
    const lastItem = 3;
    const sampleList = List([1, 2, lastItem]);

    it('should return undefined for an empty list', () => {
      expect(lastOf(List())).toBeUndefined();
    });

    it('should return undefined for an empty array', () => {
      expect(lastOf([])).toBeUndefined();
    });

    it('should return the last item correctly', () => {
      expect(lastOf(sampleList)).toEqual(lastItem);
    });

    it('should work for an array', () => {
      expect(lastOf(sampleList.toArray())).toEqual(lastItem);
    });
  });
});

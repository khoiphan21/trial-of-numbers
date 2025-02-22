import { noFalsyValueInArray, uniqueValues } from './array';

describe('Array Values Checker', () => {
  describe('uniqueValues()', () => {
    it('should return array of unique elements', async () => {
      const original = ['a', 1, 2, 'a', 'b', '1', 2];
      const expected = ['a', 1, 2, 'b', '1'];

      expect(uniqueValues(original)).toEqual(expected);
    });
  });

  describe('noFalsyValueExistInArray()', () => {
    describe('special cases', () => {
      it('should throw an error if the given array is null', () => {
        const message =
          'noFalsyValueInArray() failed: Given array must not be null';
        expect(() => noFalsyValueInArray(null)).toThrowError(message);
      });
      it('should throw an error if the given array is undefined', () => {
        const message =
          'noFalsyValueInArray() failed: Given array must not be undefined';
        expect(() => noFalsyValueInArray<string>(undefined)).toThrowError(
          message
        );
      });

      it('should return true for an empty array', () => {
        expect(noFalsyValueInArray([])).toBe(true);
      });
    });

    describe('when there are multiple values in the array', () => {
      describe('should return false if', () => {
        it('there is a `null` value in the array', () => {
          expect(noFalsyValueInArray([1, null, 2])).toBe(false);
        });

        it('there is an `undefined` value in the array', () => {
          expect(noFalsyValueInArray([1, undefined, 2])).toBe(false);
        });

        it('there is a `0` in the array', () => {
          expect(noFalsyValueInArray([0, 1, 2])).toBe(false);
        });

        it('there is an empty string in the array', () => {
          expect(noFalsyValueInArray(['', 1, 2])).toBe(false);
        });

        it('there is a `false` in the array', () => {
          expect(noFalsyValueInArray([false, 1, 2])).toBe(false);
        });
      });

      describe('should return true if', () => {
        it('all values are truthy numbers', () => {
          expect(noFalsyValueInArray([1, 2, 3])).toBe(true);
        });

        it('all values are truthy strings', () => {
          expect(noFalsyValueInArray(['a', 'asdf', 'afasfsdf'])).toBe(true);
        });

        it('all values are objects', () => {
          expect(noFalsyValueInArray([{}, { foo: 'bar' }])).toBe(true);
        });

        it('all values are arrays', () => {
          expect(noFalsyValueInArray([[], [1]])).toBe(true);
        });
      });
    });
  });
});

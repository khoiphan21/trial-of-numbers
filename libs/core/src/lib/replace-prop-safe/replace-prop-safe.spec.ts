import { replacePropIn } from './replace-prop-safe';

describe('replacePropIn()', () => {
  it('should replace a given prop correctly', () => {
    const newValue = 'bar2';
    const original = { foo: 'bar' };
    const replacement = { foo: newValue };

    replacePropIn(original).withMatchingPropsIn(replacement, {});

    expect(original.foo).toEqual(newValue);
  });

  describe('for an array prop', () => {
    it('should replace an empty array with the matching prop in the default object', () => {
      const original = { foo: ['bar'] };
      const replacement = { foo: [] };
      const defaultObject = { foo: [''] };

      replacePropIn(original).withMatchingPropsIn(replacement, defaultObject);

      expect(original.foo).toEqual(defaultObject.foo);
    });

    it('should replace a non-empty array correctly', () => {
      const original = { foo: [] };
      const replacement = { foo: ['bar'] };

      replacePropIn(original).withMatchingPropsIn(replacement, {});

      expect(original.foo).toEqual(['bar']);
    });
  });
});

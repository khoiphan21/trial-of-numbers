import { filterUndefinedProps } from './filter-undefined-props';

describe(filterUndefinedProps.name, () => {
  it('should return an object with the same props if no undefined values', () => {
    const obj = { foo: 'bar', bar: 'baz' };

    expect(filterUndefinedProps(obj)).toEqual(obj);
  });

  it('should filter out undefined values', async () => {
    const obj = {
      foo: 'bar',
      bar: undefined,
      baz: undefined,
      bazzes: undefined,
    };

    const result = filterUndefinedProps(obj);
    expect(result).toEqual({ foo: 'bar' });
    expect(Object.keys(result).length).toEqual(1);
  });

  it('should not modify the original object', async () => {
    // freezing the object to prevent modification
    // any attempt to modify it will fail the test
    const obj = Object.freeze({
      foo: 'bar',
      bar: undefined,
      baz: undefined,
      bazzes: undefined,
    });

    filterUndefinedProps(obj);
  });
});

import { filterObject } from './filter-object';

describe('filterObject()', () => {
  it('should filter props that do not exist', () => {
    const target = {
      foo: 'bar',
      extra: 'baz',
    };
    const byObject = { foo: 'bar' };
    const result = filterObject(target as any, byObject);
    expect(result.extra).toBeUndefined();
  });

  it('should use default values for props in byObject', () => {
    const target = {};
    const byObject = { foo: 'bar' };
    const result = filterObject(target as any, byObject);

    expect(result.foo).toEqual('bar');
  });

  it('should just return byObject if target is null or undefined', () => {
    let result: any;
    const byObject = { foo: 'bar' };

    result = filterObject(null, byObject);
    expect(result.foo).toEqual('bar');

    result = filterObject(undefined, byObject);
    expect(result.foo).toEqual('bar');
  });
});

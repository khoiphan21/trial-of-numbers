import { getPropNames } from './get-prop-names';

describe(getPropNames.name, () => {
  it('should return empty array if no expression given', () => {
    expect(getPropNames('')).toEqual([]);
  });

  it('should return for a basic expression', () => {
    expect(getPropNames(`prop("foo")`)).toEqual(['foo']);
  });

  it('should handle single quotes', () => {
    expect(getPropNames(`prop('foo')`)).toEqual(['foo']);
  });

  it('should handle empty spaces in the formula', () => {
    expect(getPropNames(`prop(  'foo'  )`)).toEqual(['foo']);
  });

  it('should return multiple props, mixed with other stuff', () => {
    expect(getPropNames(`prop( 'foo' ) + " " + prop('bar' )`)).toEqual([
      'foo',
      'bar',
    ]);
  });
});

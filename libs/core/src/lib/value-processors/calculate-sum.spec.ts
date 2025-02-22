import { calculateSum } from './calculate-sum';

describe(calculateSum, () => {
  it('should return undefined if there are no valid values to sum', () => {
    expect(calculateSum(['a', '$', NaN])).toBeUndefined();
  });

  it('should sum 1 number', () => {
    expect(calculateSum([1])).toEqual(1);
  });

  it('should sum multiple number', () => {
    expect(calculateSum([1, 2, 3])).toEqual(6);
  });

  it('should sum a number as string', () => {
    expect(calculateSum(['1'])).toEqual(1);
  });

  it('should sum multiple numbers as string', () => {
    expect(calculateSum(['1', '2', '3'])).toEqual(6);
  });

  it('should sum a mixture of values', () => {
    expect(calculateSum(['1', 2, '3'])).toEqual(6);
  });

  it('should ignore undefined values', () => {
    expect(calculateSum(['1', 2, '3', undefined])).toEqual(6);
  });

  it('should handle negative values', () => {
    expect(calculateSum(['1', -2, '-3'])).toEqual(-4);
  });
});

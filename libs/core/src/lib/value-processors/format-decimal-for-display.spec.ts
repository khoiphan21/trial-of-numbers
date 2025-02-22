import { formatDecimalForDisplay } from './format-decimal-for-display';

describe(formatDecimalForDisplay, () => {
  it('should return an empty string if given undefined', () => {
    expect(formatDecimalForDisplay(undefined)).toEqual('');
  });

  it('should return a whole number if given one', () => {
    expect(formatDecimalForDisplay(3)).toEqual('3');
  });

  it('should convert a "safe" decimal number correctly', () => {
    expect(formatDecimalForDisplay(1.1)).toEqual('1.1');
  });

  it('should convert a "dangerous" decimal number correctly', () => {
    // doing this 1.1 + 2.2 calculation will result in 3.300000003 if
    // naively converted to string
    expect(formatDecimalForDisplay(1.1 + 2.2)).toEqual('3.3');
  });
});

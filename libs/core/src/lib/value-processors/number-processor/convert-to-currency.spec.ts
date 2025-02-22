import { convertToCurrency } from './convert-to-currency';

describe(convertToCurrency, () => {
  it('should return NaN if given value is NaN', () => {
    expect(convertToCurrency('4.a')).toEqual('NaN');
  });

  it('should handle a currency string', () => {
    expect(convertToCurrency('4.00')).toEqual('$4.00');
  });

  it('should handle a negative value string', () => {
    expect(convertToCurrency('-4.00')).toEqual('-$4.00');
  });

  it('should handle a decimal number', () => {
    expect(convertToCurrency(4.0)).toEqual('$4.00');
    expect(convertToCurrency(4.123)).toEqual('$4.12');
    expect(convertToCurrency(-4.0)).toEqual('-$4.00');
    expect(convertToCurrency(-4.123)).toEqual('-$4.12');
  });

  it('should round numbers with more than 3 decimal places correctly', () => {
    expect(convertToCurrency(-4.123)).toEqual('-$4.12');
    expect(convertToCurrency(-4.125)).toEqual('-$4.13');
  });

  it('should handle whole number values', () => {
    expect(convertToCurrency(-4.0)).toEqual('-$4.00');
    expect(convertToCurrency('-4.0')).toEqual('-$4.00');
  });

  it('should handle zeros', () => {
    expect(convertToCurrency('0')).toEqual('$0.00');
    expect(convertToCurrency('-0')).toEqual('$0.00');
    expect(convertToCurrency(0)).toEqual('$0.00');
    expect(convertToCurrency(0.0)).toEqual('$0.00');
  });
});

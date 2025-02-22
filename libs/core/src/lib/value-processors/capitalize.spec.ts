import { capitalise, capitaliseEachWordInString } from './capitalize';

describe(capitalise.name, () => {
  it('should capitalize first letter for a single word', () => {
    expect(capitalise('foo')).toEqual('Foo');
  });

  it('should capitalize first letter for a sentence', () => {
    expect(capitalise('foo bar baz')).toEqual('Foo bar baz');
  });

  it('should return an empty string for an empty string', () => {
    expect(capitalise('')).toEqual('');
  });

  it('should return an empty string for `undefined` value', () => {
    expect(capitalise(undefined)).toEqual('');
  });
});

describe(capitaliseEachWordInString.name, () => {
  it('should return an empty string when given an empty string', () => {
    expect(capitaliseEachWordInString('')).toEqual('');
  });

  it('should return an empty string when given undefined', () => {
    expect(capitaliseEachWordInString(undefined)).toEqual('');
  });

  it('should capitalise for 1 word', () => {
    expect(capitaliseEachWordInString('foo')).toEqual('Foo');
  });

  it('should capitalize first letter of each word for a sentence', () => {
    expect(capitaliseEachWordInString('foo bar baz')).toEqual('Foo Bar Baz');
  });
});

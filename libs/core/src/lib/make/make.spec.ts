import { makeWith } from './make';

describe('make()', () => {
  const DEFAULT_ID = 'uuid';
  const DEFAULT_VERSION = 1;

  interface MyObj {
    id: string;
    _version: number;
    nullProp: any;
  }

  const makeDefault = (): MyObj => ({
    id: DEFAULT_ID,
    _version: DEFAULT_VERSION,
    nullProp: undefined,
  });
  const makeMyObj = makeWith(makeDefault);

  it('should create default values if not given any', () => {
    const result = makeMyObj();
    expect(result.id).toEqual(DEFAULT_ID);
    expect(result._version).toEqual(DEFAULT_VERSION);
    expect(result.nullProp).toBeUndefined();
  });

  it('should remove extra values not defined in the default object', () => {
    const params: any = { extra: 'foo' };
    const result: any = makeMyObj(params);

    expect(result.extra).toBeUndefined();
  });

  it('should replace the default values with the given values', () => {
    const newId = 'abcd';
    const result = makeMyObj({ id: newId });

    expect(result.id).toEqual(newId);
  });

  it('should replace a given null value with the default value', () => {
    // This is for blocks with newly added properties to auto-fill older
    // blocks with the default value for those properties
    const _version = undefined;
    const result = makeMyObj({ _version });

    expect(result._version).toEqual(DEFAULT_VERSION);
  });

  it('should replace a given undefined value with the default value', () => {
    const _version = undefined;
    const result = makeMyObj({ _version });

    expect(result._version).toEqual(DEFAULT_VERSION);
  });
});

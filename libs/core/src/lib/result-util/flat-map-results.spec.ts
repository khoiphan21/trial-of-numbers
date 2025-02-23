import { Result } from '@luna/definitions';
import { flatMapResults } from './flat-map-results';
import { formatResultListError } from './format-result-list-error';

describe(flatMapResults.name, () => {
  it('should return a final data prop of all data in the right order', async () => {
    const { data } = flatMapResults(makeAllValidResults());

    expect(data).toEqual(makeAllValidResults().map((r) => r.data));
  });

  it('should return the first error in the results', async () => {
    const { error, data } = flatMapResults(makeErrorResults());

    expect(data).toBeUndefined();
    expect(error).toEqual(formatResultListError('foo', 1));
  });

  it('should return an empty array if empty array received', async () => {
    const { error, data } = flatMapResults([]);
    expect(data).toEqual([]);
    expect(error).toBeUndefined();
  });

  it('should return an error if received undefined', async () => {
    const { error, data } = flatMapResults(undefined as any);
    expect(data).toEqual(undefined);
    expect(error).toBeTruthy();
  });
});

function makeAllValidResults(): Result<string>[] {
  return [{ data: 'foo' }, { data: 'bar' }, { data: 'baz' }];
}

function makeErrorResults(): Result<string>[] {
  return [
    { data: 'valid-data' },
    { error: 'foo' },
    { error: 'bar' },
    { data: 'valid-data' },
  ];
}

import { Result } from '@luna/definitions';
import { formatResultListError } from './format-result-list-error';

export function flatMapResults<T>(
  results: Result<T>[]
): Result<(T | undefined)[]> {
  if (!results) {
    return { error: 'received "undefined" for the results array' };
  }

  type PotentialT = T | undefined;

  const initialResult: Result<PotentialT[]> = { data: [] };
  return results.reduce(
    (finalResult: Result<PotentialT[]>, result, currentIndex) => {
      if (finalResult.error) {
        // simply return error if there's already an error in the final result
        return finalResult;
      }

      if (result.error) {
        // if there's an error, return error straight away
        return {
          error: formatResultListError(result.error, currentIndex),
        } as Result<T[]>;
      }

      if (!finalResult.data) {
        return { error: 'no error in result, but no data either' } as Result<
          T[]
        >;
      }

      return { data: [...finalResult.data, result.data] };
    },
    initialResult
  );
}

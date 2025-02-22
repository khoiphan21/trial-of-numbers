import { TimeInMilliseconds } from '@luna-academy-trial-of-numbers/definitions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { notNullOrUndefined } from '../value-checker';

export const DEFAULT_GET_FIRST_VALUE_TIMEOUT = 4500;

let defaultTimeout = DEFAULT_GET_FIRST_VALUE_TIMEOUT;

export interface GetFirstValueInput<T> {
  observable: Observable<T>;
  name?: string;
  truthyOnly?: boolean;
  timeout?: TimeInMilliseconds;
}

export function configureGetFirstValue<T>(
  input: Pick<GetFirstValueInput<T>, 'timeout'>
) {
  if (input.timeout) {
    defaultTimeout = input.timeout;
  }
}

/**
 * Resolve with the first value retrieved from the observable.
 *
 * Throw an error after the timeout is reached (default to 5s)
 */
export async function getFirstValue<T>(
  input: GetFirstValueInput<T>
): Promise<T> {
  const name = input.name || 'Unnamed';
  const timeout = choose(input.timeout, defaultTimeout);
  const truthyOnly = choose(input.truthyOnly, true);
  const observable: Observable<T> = input.observable;

  function choose(value: any, defaultValue: any) {
    return notNullOrUndefined(value) ? value : defaultValue;
  }

  return new Promise((resolve, reject) => {
    let resolved = false;

    const done$ = new Subject<void>();

    if (!observable || !observable.pipe) {
      throw Error(
        `The observable "${name}" is not a valid observable. Its value is: ` +
          observable
      );
    }

    observable.pipe(takeUntil(done$)).subscribe(
      (val) => {
        if (!truthyOnly || notNullOrUndefined(val)) {
          done$.next();
          resolved = true;
          resolve(val);
        }
      },
      (error) => {
        done$.next();
        resolved = true;
        reject(error);
      }
    );

    setTimeout(() => {
      if (!resolved) {
        reject(
          `Timeout trying to get first value of observable '${name}' with timeout ${timeout}`
        );
      }
    }, timeout);
  });
}

import { Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { notNullOrUndefined } from '../value-checker';

export function takeUntilAndFilter<T>(
  observable: Observable<T>,
  complete$: Observable<any>
): Observable<T> {
  return observable.pipe(
    takeUntil(complete$),
    filter<T>((v) => notNullOrUndefined(v))
  );
}

/**
 * Compare two array of IDs
 * @returns true if the IDs are all matching in value and order
 */
export function compareIdArrays(a: string[], b: string[]): boolean {
  return a.join('-') === b.join('-');
}

import { filter, OperatorFunction } from 'rxjs';
import { notNullOrUndefined } from '../value-checker';

export function filterUndefinedValues<T>() {
  return filter(notNullOrUndefined) as OperatorFunction<T | undefined, T>;
}

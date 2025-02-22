import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

export function combineStreamsSafe<T>(
  streams: Array<Observable<T>>
): Observable<T[]> {
  return streams.length ? combineLatest(streams) : new BehaviorSubject<T[]>([]);
}

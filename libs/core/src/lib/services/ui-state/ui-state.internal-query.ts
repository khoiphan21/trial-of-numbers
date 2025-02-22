import { distinctUntilChanged, map, Observable } from 'rxjs';
import { UIState } from './ui-state';
import { selectState } from './ui-state.store';

/**
 * This function should only be used within `core`, as it can select any prop
 * from UI state
 *
 * @param prop which ui state prop to select
 */
export function selectUIStateInternal<K extends keyof UIState>(
  prop: K
): Observable<UIState[K]> {
  return selectState().pipe(
    map((state) => state[prop]),
    distinctUntilChanged()
  );
}

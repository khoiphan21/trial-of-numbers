import { distinctUntilChanged, map, Observable } from 'rxjs';
import { UIState } from './ui-state';
import { getState, selectState } from './ui-state.store';

/**
 * props that cannot be selected can still be selected via
 * `selectUIStateInternal`, but the main UI will need to rely on specificly
 * exported queries in `ui-queries`
 */
type SelectableUIState = Omit<UIState, 'showCommentPanel'>;

export function selectUIState<K extends keyof SelectableUIState>(
  prop: K
): Observable<UIState[K]> {
  return selectState().pipe(
    map((state) => state[prop]),
    distinctUntilChanged()
  );
}

export const getUIStateSnapshot = getState;

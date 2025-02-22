import { BehaviorSubject, Observable } from 'rxjs';
import { UIState } from './ui-state';

const createInitialState = (): UIState => ({
  activeGame: undefined,
});

const state = new BehaviorSubject<UIState>(createInitialState());

export const selectState = () => state as Observable<UIState>;

export const getState = (): UIState => state.value;

export function updateState(newState: Partial<UIState>) {
  state.next({
    ...state.value,
    ...newState,
  });
}

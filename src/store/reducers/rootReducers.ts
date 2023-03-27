import {combineReducers} from 'redux';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux';
import {select} from 'redux-saga/effects';

import userReducer from './user';

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export function* appSelect<TSelected>(
  selector: (state: RootState) => TSelected,
): Generator<any, TSelected, TSelected> {
  return yield select(selector);
}
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default rootReducer;

import {all} from 'redux-saga/effects';
import userSaga from './userSaga';
import planningSaga from './planningSaga';

export function* rootSaga() {
  yield all([userSaga, planningSaga]);
}

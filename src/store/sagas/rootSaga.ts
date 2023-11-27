import {all} from 'redux-saga/effects';
import userSaga from './userSaga';
import planningSaga from './planningSaga';
import coachesSaga from './coachesSaga';

export function* rootSaga() {
  yield all([userSaga, planningSaga, coachesSaga]);
}

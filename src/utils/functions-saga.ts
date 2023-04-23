import {call, put} from 'redux-saga/effects';
import {userActions} from 'store/reducers/user';
import {log, normalizeCatchActions} from './utils';

export const safe = (handler: any = null, saga: any, ...args: any) =>
  function* (action: any) {
    try {
      yield call(saga, ...args, action);
    } catch (err) {
      yield call(handler(err));
    }
  };

export const onError = (callbackError: any) => (err: any) =>
  function* () {
    if (err?.isEndSession) {
      yield put(userActions.setLogoutUser());
    }
    normalizeCatchActions(err?.response?.data?.codeError);
    yield put(callbackError());
    log(err);
  };

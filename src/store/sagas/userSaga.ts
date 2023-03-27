import {PayloadAction} from '@reduxjs/toolkit';
import {IUserRequest, userActions} from 'store/reducers/user';
import {all, put, takeLatest} from 'redux-saga/effects';
import AuthServices from 'services/auth-services';
import {navigationRef, Screen} from 'router/Router';

function* signInSaga(
  action: PayloadAction<{
    email: string;
    password: string;
  }>,
) {
  try {
    const data: {token: string; result: {user: IUserRequest}} =
      yield AuthServices.logInService({
        email: action.payload.email,
        password: action.payload.password,
      });
    yield AuthServices.setAuthorization(data.token);
    const user: IUserRequest = data.result.user;

    let rootScreen = Screen.CALENDAR;
    if (user.isNew) {
      rootScreen = Screen.SIGN_IN_CHANGE_PASSWORD;
    }
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: rootScreen,
          params: {},
        },
      ],
    });
    yield put(userActions.signInSuccess(user));
  } catch (error) {
    yield put(userActions.userFailed(error as Error));
  }
}

function* changePasswordAuthenticatedSaga(
  action: PayloadAction<{
    password: string;
  }>,
) {
  try {
    yield AuthServices.changePassword({
      password: action.payload.password,
    });
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: Screen.CALENDAR,
          params: {},
        },
      ],
    });
    yield put(userActions.changePasswordSuccess());
  } catch (error) {
    yield put(userActions.userFailed(error as Error));
  }
}

function* logoutSaga() {
  try {
    yield put(userActions.logoutUserSuccess());
    navigationRef.reset({
      index: 0,
      routes: [{name: Screen.SIGN_IN}],
    });
    AuthServices.setAuthorization('');
  } catch (error) {
    yield put(userActions.userFailed(error as Error));
  }
}

export default all([
  takeLatest(userActions.signInAction.type, signInSaga),
  takeLatest(
    userActions.changePasswordAuthenticatedAction.type,
    changePasswordAuthenticatedSaga,
  ),
  takeLatest(userActions.setLogoutUser.type, logoutSaga),
]);

import {PayloadAction} from '@reduxjs/toolkit';
import {IUserRequest, userActions} from 'store/reducers/user';
import {all, put, takeLatest} from 'redux-saga/effects';
import AuthServices from 'services/auth-services';
import {navigationRef, Screen} from 'router/Router';
import {onError, safe} from 'utils/functions-saga';
import Toast from 'react-native-toast-message';
import {LabelSuccess} from 'utils/text';

function* signInSaga(
  action: PayloadAction<{
    email: string;
    password: string;
  }>,
) {
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
  if (!user.isNew) {
    Toast.show({
      type: 'success',
      text1: LabelSuccess.sign_in_success,
      visibilityTime: 1100,
    });
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
}

function* updateProfileSaga(action: PayloadAction<IUserRequest>) {
  const data: {result: IUserRequest} = yield AuthServices.updateProfile({
    ...action.payload,
  });
  yield put(userActions.updateProfileSuccess(data.result));
  Toast.show({
    type: 'success',
    text1: LabelSuccess.profile_updated,
    visibilityTime: 1100,
  });
}

function* changePasswordSettingsSaga(
  action: PayloadAction<{
    currentPassword: string;
    newPassword: string;
  }>,
) {
  yield AuthServices.changePasswordSettings(action.payload);
  navigationRef.goBack();
  yield put(userActions.changePasswordSettingsSuccess());
  Toast.show({
    type: 'success',
    text1: LabelSuccess.password_updated,
    visibilityTime: 1100,
  });
}

function* changePasswordAuthenticatedSaga(
  action: PayloadAction<{
    password: string;
  }>,
) {
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
  Toast.show({
    type: 'success',
    text1: LabelSuccess.sign_in_success,
    visibilityTime: 1100,
  });
}

function* forgotPasswordSaga(
  action: PayloadAction<{
    email: string;
  }>,
) {
  yield AuthServices.forgotPassword({
    email: action.payload.email,
  });
  navigationRef.reset({
    index: 0,
    routes: [
      {
        name: Screen.CONFIRMATION_SUCCESS,
        params: {type: Screen.FORGOT_PASSWORD},
      },
    ],
  });
  yield put(userActions.forgotPasswordSuccess());
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
    yield put(userActions.userFailed());
  }
}

export default all([
  takeLatest(
    userActions.signInAction.type,
    safe(onError(userActions.userFailed), signInSaga),
  ),
  takeLatest(
    userActions.forgotPasswordAction.type,
    safe(onError(userActions.userFailed), forgotPasswordSaga),
  ),
  takeLatest(
    userActions.changePasswordAuthenticatedAction.type,
    safe(onError(userActions.userFailed), changePasswordAuthenticatedSaga),
  ),
  takeLatest(
    userActions.updateProfileAction.type,
    safe(onError(userActions.userFailed), updateProfileSaga),
  ),
  takeLatest(
    userActions.changePasswordSettingsAction.type,
    safe(onError(userActions.userFailed), changePasswordSettingsSaga),
  ),
  takeLatest(userActions.setLogoutUser.type, logoutSaga),
]);

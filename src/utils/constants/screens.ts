import {createNavigationContainerRef} from '@react-navigation/native';

export enum Screen {
  SPLASH = 'SplashScreen',
  SIGN_IN = 'SignInScreen',
  CONFIRMATION_SUCCESS = 'ConfirmationSuccess',
  PROFILE = 'Profile',
  SIGN_IN_CHANGE_PASSWORD = 'SignInChangePasswordScreen',
  FORGOT_PASSWORD = 'ForgotPassword',
  CALENDAR = 'Calendar',
  CALENDAR_STACK = 'CalendarStack',
  SETTINGS = 'Settings',
  SETTINGS_STACK = 'SettingsStack',
  CHANGE_PASSWORD_SETTINGS = 'ChangePasswordSettings',
}

export const navigationRef = createNavigationContainerRef();

export const validateShownTabBar = (_route: string | undefined) => {
  if (_route === Screen.PROFILE || _route === Screen.CHANGE_PASSWORD_SETTINGS) {
    return false;
  }
  return true;
};

import {Screen} from 'utils/constants/screens';

export type AppRootParamList = {
  [Screen.SIGN_IN]: undefined;
  [Screen.SIGN_IN_CHANGE_PASSWORD]: undefined;
  [Screen.CONFIRMATION_SUCCESS]: {type: Screen; extraData?: Object};
  [Screen.FORGOT_PASSWORD]: undefined;
  [Screen.CALENDAR]: undefined;
  [Screen.PROFILE]: undefined;
  [Screen.CHANGE_PASSWORD_SETTINGS]: undefined;
  [Screen.CALENDAR_STACK]: undefined;
  [Screen.SETTINGS_STACK]: undefined;
  [Screen.UPDATE_APP]: {storeUrl: string};
};

declare global {
  declare module '*.png';
  namespace ReactNavigation {
    interface RootParamList extends AppRootParamList {}
  }
}

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

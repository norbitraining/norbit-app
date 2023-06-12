import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SettingsScreen from 'screens/AccountSettings/Settings';
import ProfileScreen from 'screens/AccountSettings/Profile';
import ChangePasswordSettingsScreen from 'screens/AccountSettings/ChangePassword';

import {Screen} from 'utils/constants/screens';

const SettingsRouter = createStackNavigator();

export type NewsFeedRouterParamList = {
  NewsFeed: {};
  NewFeedDetail: {};
};
export default () => {
  return (
    <SettingsRouter.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={Screen.SETTINGS}>
      <SettingsRouter.Screen
        name={Screen.SETTINGS}
        component={SettingsScreen}
      />
      <SettingsRouter.Screen name={Screen.PROFILE} component={ProfileScreen} />
      <SettingsRouter.Screen
        name={Screen.CHANGE_PASSWORD_SETTINGS}
        component={ChangePasswordSettingsScreen}
      />
    </SettingsRouter.Navigator>
  );
};

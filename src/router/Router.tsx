import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import {
  createNavigationContainerRef,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';

import RNSplashScreen from 'react-native-splash-screen';

import SignInScreen from 'screens/Auth/SignIn';
import SignInChangePasswordScreen from 'screens/Auth/SignInChangePassword';
import CalendarScreen from 'screens/Home/Calendar';
import {GlobalStyles} from 'theme/globalStyle';

export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();

export enum Screen {
  SPLASH = 'SplashScreen',
  SIGN_IN = 'SignInScreen',
  SIGN_IN_CHANGE_PASSWORD = 'SignInChangePasswordScreen',
  CALENDAR = 'CalendarScreen',
}

export type RouterParamList = {
  AppRouter: {};
};

export interface RouterProps {}

const Router: React.FC<RouterProps> = ({}) => {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      RNSplashScreen.hide();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer theme={DarkTheme} ref={navigationRef}>
        <SafeAreaView style={GlobalStyles.container}>
          <Stack.Navigator
            initialRouteName={Screen.SIGN_IN}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={Screen.SIGN_IN} component={SignInScreen} />
            <Stack.Screen
              name={Screen.SIGN_IN_CHANGE_PASSWORD}
              component={SignInChangePasswordScreen}
            />
            <Stack.Screen name={Screen.CALENDAR} component={CalendarScreen} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
};

export default Router;

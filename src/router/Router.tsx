import React, {useMemo, useState} from 'react';
import {
  ColorSchemeName,
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  useColorScheme,
} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import {
  createNavigationContainerRef,
  DarkTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import RNSplashScreen from 'react-native-splash-screen';

import SignInScreen from 'screens/Auth/SignIn';
import SignInChangePasswordScreen from 'screens/Auth/SignInChangePassword';
import ForgotPasswordScreen from 'screens/Auth/ForgotPassword';
import ConfirmationSuccessScreen from 'screens/Auth/ConfirmationSuccess';
import CalendarStack from './stack/CalendarStack';
import SettingsStack from './stack/SettingsStack';
import TabBar from 'components/TabBar';
import {GlobalStyles} from 'theme/globalStyle';
import {useSelector} from 'store/reducers/rootReducers';

export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

interface MainStyleScheme {
  container: any;
  safeAreaViewBottom: any;
  statusBarStyle: StatusBarStyle;
}

export type RouterParamList = {
  AppRouter: {};
};

export interface RouterProps {}

const validateShownTabBar = (_route: string | undefined) => {
  if (_route === Screen.PROFILE || _route === Screen.CHANGE_PASSWORD_SETTINGS) {
    return false;
  }
  return true;
};

function BottomTabNavigator() {
  const scheme = useColorScheme();

  const isDark = useMemo(() => scheme === 'dark', [scheme]);
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        const newRoute = getFocusedRouteNameFromRoute(route);
        return {
          headerShown: false,
          tabBarStyle: {
            display: validateShownTabBar(newRoute) ? 'flex' : 'none',
          },
          tabBarHideOnKeyboard: true,
        };
      }}
      initialRouteName={Screen.CALENDAR_STACK}
      tabBar={(props: any) => <TabBar {...props} isDark={isDark} />}>
      <Tab.Screen name={Screen.CALENDAR_STACK} component={CalendarStack} />
      <Tab.Screen name={Screen.SETTINGS_STACK} component={SettingsStack} />
    </Tab.Navigator>
  );
}

const generateMainStyleScheme = ({
  colorScheme,
  router,
}: {
  router: RouteProp<ParamListBase, Screen> | undefined;
  colorScheme: ColorSchemeName;
}): MainStyleScheme => {
  if (
    colorScheme === 'light' &&
    (router?.name === Screen.SETTINGS ||
      router?.name === Screen.PROFILE ||
      router?.name === Screen.CHANGE_PASSWORD_SETTINGS)
  ) {
    return {
      container: GlobalStyles.containerWhite,
      statusBarStyle: 'dark-content',
      safeAreaViewBottom: GlobalStyles.containerBottomWhite,
    };
  }
  if (colorScheme === 'light' && router?.name === Screen.CALENDAR) {
    return {
      container: GlobalStyles.container,
      statusBarStyle: 'light-content',
      safeAreaViewBottom: GlobalStyles.containerBottomWhite,
    };
  }
  return {
    container: GlobalStyles.container,
    safeAreaViewBottom:
      router?.name === Screen.CALENDAR
        ? GlobalStyles.containerBottomDarkCalendar
        : GlobalStyles.containerBottomDark,
    statusBarStyle: 'light-content',
  };
};

const Router: React.FC<RouterProps> = ({}) => {
  const colorScheme = useColorScheme();
  const currentUser = useSelector(x => x.user);

  const [router, setRouter] = useState<RouteProp<ParamListBase, Screen>>({
    key: currentUser.isLoggedIn ? Screen.CALENDAR : Screen.SIGN_IN,
    name: currentUser.isLoggedIn ? Screen.CALENDAR : Screen.SIGN_IN,
  });

  const mainColorScheme = useMemo(
    () => generateMainStyleScheme({colorScheme, router}),
    [colorScheme, router],
  );

  const onStateChange = () => {
    if (navigationRef.current && navigationRef.current!.getCurrentRoute()) {
      const route = navigationRef.current.getCurrentRoute() as RouteProp<
        ParamListBase,
        Screen
      >;
      setRouter(route);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      RNSplashScreen.hide();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <StatusBar barStyle={mainColorScheme.statusBarStyle} animated />
      <NavigationContainer
        theme={DarkTheme}
        ref={navigationRef}
        onStateChange={onStateChange}>
        <SafeAreaView style={mainColorScheme.container}>
          <Stack.Navigator
            initialRouteName={
              currentUser.isLoggedIn ? Screen.CALENDAR : Screen.SIGN_IN
            }
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={Screen.SIGN_IN} component={SignInScreen} />
            <Stack.Screen
              name={Screen.SIGN_IN_CHANGE_PASSWORD}
              component={SignInChangePasswordScreen}
            />
            <Stack.Screen
              name={Screen.FORGOT_PASSWORD}
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name={Screen.CONFIRMATION_SUCCESS}
              component={ConfirmationSuccessScreen}
            />
            <Stack.Screen
              name={Screen.CALENDAR}
              component={BottomTabNavigator}
            />
          </Stack.Navigator>
        </SafeAreaView>
        <SafeAreaView style={mainColorScheme.safeAreaViewBottom} />
      </NavigationContainer>
    </>
  );
};

export default Router;

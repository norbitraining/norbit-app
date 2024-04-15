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
  DarkTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import BootSplash from 'react-native-bootsplash';
import VersionCheck from 'react-native-version-check';

import SignInScreen from 'screens/Auth/SignIn';
import SignInChangePasswordScreen from 'screens/Auth/SignInChangePassword';
import ForgotPasswordScreen from 'screens/Auth/ForgotPassword';
import ConfirmationSuccessScreen from 'screens/Auth/ConfirmationSuccess';
import UpdateAppScreen from 'screens/UpdateApp';
import CalendarStack from './stack/CalendarStack';
import SettingsStack from './stack/SettingsStack';
import TabBar from 'components/TabBar';

import {GlobalStyles} from 'theme/globalStyle';
import {useSelector} from 'store/reducers/rootReducers';
import {
  navigationRef,
  Screen,
  validateShownTabBar,
} from 'utils/constants/screens';
import {coachesActions} from 'store/reducers/coaches';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface MainStyleScheme {
  container: any;
  safeAreaViewBottom: any;
  statusBarStyle: StatusBarStyle;
}

export type RouterParamList = {
  AppRouter: {};
};

export interface RouterProps {
  getCoachesAction: typeof coachesActions.getCoachesAction;
}

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
      // eslint-disable-next-line react/no-unstable-nested-components
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

const Router: React.FC<RouterProps> = ({getCoachesAction}) => {
  const colorScheme = useColorScheme();
  const currentUser = useSelector(x => x.user);

  const [router, setRouter] = useState<RouteProp<ParamListBase, Screen>>({
    key: currentUser.isLoggedIn ? Screen.CALENDAR : Screen.SIGN_IN,
    name: currentUser.isLoggedIn ? Screen.CALENDAR : Screen.SIGN_IN,
  });

  const handleVersionCheck = async () => {
    try {
      const hasUpdate = await VersionCheck.needUpdate();

      console.log(hasUpdate);
      if (!hasUpdate.isNeeded) {
        return;
      }

      navigationRef.navigate(Screen.UPDATE_APP, {
        storeUrl: hasUpdate.storeUrl,
      });
    } catch (e) {
      console.log(e);
    }
  };

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
      BootSplash.hide({fade: true});
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (!currentUser.isLoggedIn) {
      return;
    }
    getCoachesAction();
  }, [currentUser.isLoggedIn, getCoachesAction]);

  return (
    <>
      <StatusBar barStyle={mainColorScheme.statusBarStyle} animated />
      <NavigationContainer
        theme={DarkTheme}
        onReady={handleVersionCheck}
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
            <Stack.Screen
              name={Screen.UPDATE_APP}
              component={UpdateAppScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </SafeAreaView>
        <SafeAreaView style={mainColorScheme.safeAreaViewBottom} />
      </NavigationContainer>
    </>
  );
};

export default Router;

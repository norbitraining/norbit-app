import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';

import SplashScreen from 'screens/Splash/SplashScreen';
import SignInScreen from 'screens/SignIn/SignInScreen';

const Stack = createStackNavigator();

export enum Screen {
  SPLASH = 'Splash',
  SIGN_IN = 'SignIn',
}

export type RouterParamList = {
  AppRouter: {};
};

export interface RouterProps {}

const Router: React.FC<RouterProps> = ({}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={Screen.SPLASH}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={Screen.SPLASH} component={SplashScreen} />
            <Stack.Screen name={Screen.SIGN_IN} component={SignInScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Router;

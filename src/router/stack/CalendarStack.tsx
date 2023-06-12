import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CalendarScreen from 'screens/Home/Calendar';

import {Screen} from 'utils/constants/screens';

const CalendarRouter = createStackNavigator();

export type CalendarRouterParamList = {
  Calendar: {};
};
export default () => {
  return (
    <CalendarRouter.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={Screen.CALENDAR}>
      <CalendarRouter.Screen
        name={Screen.CALENDAR}
        component={CalendarScreen}
      />
    </CalendarRouter.Navigator>
  );
};

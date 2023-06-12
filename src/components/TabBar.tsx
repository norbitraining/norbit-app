import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {GlobalStyles} from 'theme/globalStyle';
import {rHeight} from 'utils';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'utils/stylesheet';
import {Screen} from 'utils/constants/screens';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import Separator from './Separator';

interface TabBarProps extends BottomTabBarProps {
  isDark: boolean;
}

type ItemTab = {
  label: string;
  icon?: string;
};

type IconTab = {
  [value in Screen]?: ItemTab;
};

const itemTabs: IconTab = {
  CalendarStack: {
    label: 'Calendario',
    icon: 'calendar',
  },
  SettingsStack: {
    label: 'Configuración',
    icon: 'settings',
  },
};

const TabBar: React.FC<TabBarProps> = ({
  navigation,
  state,
  descriptors,
  isDark,
}) => {
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  if ((focusedOptions.tabBarStyle as any)?.display === 'none') {
    return <></>;
  }

  return (
    <View
      style={
        isDark
          ? focusedRoute.name === Screen.CALENDAR_STACK
            ? styles.containerTabDarkCalendar
            : styles.containerTabDark
          : styles.containerTab
      }>
      <View style={isDark ? styles.contentTabDark : styles.contentTab}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const item = itemTabs?.[route.name as Screen];

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.8}
              style={styles.tab}>
              {isFocused && (
                <View
                  style={isDark ? styles.tabSelectedDark : styles.tabSelected}
                />
              )}
              <View style={[styles.contentTabItem, GlobalStyles.center]}>
                <View style={[GlobalStyles.center]}>
                  {item?.icon && (
                    <Icon
                      name={item.icon}
                      color={EStyleSheet.value(
                        isFocused
                          ? isDark
                            ? '$colors_tabDark'
                            : '$colors_dangerTab'
                          : isDark
                          ? '$colors_white'
                          : '$colors_primary',
                      )}
                      size={24}
                    />
                  )}
                  {isFocused ? (
                    <>
                      <Separator thickness={4} />
                      <Text
                        align="center"
                        fontSize={12}
                        color={EStyleSheet.value(
                          isFocused
                            ? isDark
                              ? '$colors_tabDark'
                              : '$colors_dangerTab'
                            : isDark
                            ? '$colors_white'
                            : '$colors_primary',
                        )}>
                        {item?.label}
                      </Text>
                    </>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
const styles = StyleSheet.create({
  containerTabDarkCalendar: {
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '$colors_schemeDark',
  },
  contentTabItem: {flex: 0.9},
  containerTabDark: {
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '$colors_dark',
  },
  containerTab: {
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '$colors_white',
  },
  contentTab: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    width: '100%',
    paddingHorizontal: 20,
  },
  contentTabDark: {
    flexDirection: 'row',
    backgroundColor: '$colors_inputColorDark',
    width: '100%',
    paddingHorizontal: 20,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    height: rHeight(55),
  },
  tabSelected: {
    width: '60%',
    marginBottom: 5,
    borderTopWidth: 2,
    borderColor: '$colors_dangerTab',
  },
  tabSelectedDark: {
    width: '60%',
    marginBottom: 5,
    borderTopWidth: 2,
    borderColor: '$colors_tabDark',
  },
});

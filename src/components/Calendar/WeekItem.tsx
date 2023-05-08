import React, {FC, memo, useCallback, useMemo} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {
  styles,
  WeekItemProps,
  itemWidth,
  colors,
  createLocalWeek,
  createWeekList,
} from './helpers';
import {GlobalStyles} from 'theme/globalStyle';
import {getDate, getDay} from 'date-fns';
import {fontNormalize} from 'utils';
import Text from 'components/Text';
import {trigger} from 'react-native-haptic-feedback';

function WeekItemAreEqual(
  prevOrderBook: WeekItemProps,
  nextOrderBook: WeekItemProps,
) {
  return (
    prevOrderBook.date === nextOrderBook.date &&
    prevOrderBook.selectedDate === nextOrderBook.selectedDate
  );
}

export const WeekItem: FC<WeekItemProps> = memo(
  ({date, selectedDate, onSelectDate}) => {
    const day = getDate(date);

    const selectDate = useCallback(() => {
      trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      onSelectDate(date);
    }, [date, onSelectDate]);

    const weekList = useMemo(() => {
      return createWeekList(createLocalWeek('es'));
    }, []);

    const containerStyle = useMemo(
      (): ViewStyle => ({
        width: itemWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: selectedDate ? 10 : 0,
      }),
      [selectedDate],
    );

    const dateSelectedStyle = useMemo(
      (): ViewStyle[] => [
        GlobalStyles.center,
        selectedDate && {
          ...styles.eachDay,
          backgroundColor: 'rgba(225, 37, 27, 0.09)',
          color: colors.white,
        },
      ],
      [selectedDate],
    );

    return (
      <View style={containerStyle}>
        <TouchableOpacity onPress={selectDate} style={dateSelectedStyle}>
          <Text
            color={selectedDate ? '#E1251B' : '#7B7B7B'}
            weight={selectedDate ? 'Medium' : 'Regular'}
            fontSize={fontNormalize(selectedDate ? 14 : 12)}
            style={GlobalStyles.textUppercase}>
            {weekList[getDay(date)]}
          </Text>
          <Text
            color={selectedDate ? '#E1251B' : '#7B7B7B'}
            fontSize={selectedDate ? 16 : 13}
            weight={selectedDate ? 'Regular' : 'Light'}
            style={{
              ...styles.eachDay,
            }}>
            {day}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
  WeekItemAreEqual,
);

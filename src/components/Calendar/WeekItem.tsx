import React, {FC, memo, useCallback, useMemo} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {
  styles,
  WeekItemProps,
  itemWidth,
  colors,
  createLocalWeek,
  createWeekList,
  Language,
} from './helpers';
import {GlobalStyles} from 'theme/globalStyle';
import {getDate, getDay} from 'date-fns';
import {fontNormalize} from 'utils';
import Text from 'components/Text';
import {trigger} from 'react-native-haptic-feedback';
import {useSelector} from 'store/reducers/rootReducers';
import {WithTranslation, withTranslation} from 'react-i18next';

interface WeekItemComponentProps extends WeekItemProps, WithTranslation {}

function WeekItemAreEqual(
  prevOrderBook: WeekItemComponentProps,
  nextOrderBook: WeekItemComponentProps,
) {
  return (
    prevOrderBook.date === nextOrderBook.date &&
    prevOrderBook.selectedDate === nextOrderBook.selectedDate
  );
}

const WeekItemComponent: FC<WeekItemComponentProps> = memo(
  ({i18n, date, selectedDate: _selectedDate, onSelectDate}) => {
    const day = getDate(date);

    const isBlocked = useSelector(x => x.coaches.coachSelected?.blocked);

    const selectedDate = React.useMemo(
      () => !isBlocked && _selectedDate,
      [_selectedDate, isBlocked],
    );

    const selectDate = useCallback(() => {
      trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      onSelectDate(date);
    }, [date, onSelectDate]);

    const weekList = useMemo(() => {
      return createWeekList(createLocalWeek(i18n.language as Language));
    }, [i18n.language]);

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
        <TouchableOpacity
          disabled={isBlocked}
          onPress={selectDate}
          style={dateSelectedStyle}>
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
            style={styles.eachDay}>
            {day}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
  WeekItemAreEqual,
);

export const WeekItem = withTranslation()(WeekItemComponent);

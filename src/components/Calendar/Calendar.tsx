import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  LegacyRef,
  useEffect,
} from 'react';
import {
  CalendarProps,
  createWholeWeek,
  formatDate,
  createWholeWeeks,
  itemWidth,
  ScrollEvent,
  createNextTwoWeeks,
  createPreviousTwoWeeks,
  screenWidth,
  styles,
  createLocalWeek,
  Language,
} from './helpers';

import {Header} from './Header';
import {WeekItem} from './WeekItem';
import {
  View,
  FlatList,
  unstable_batchedUpdates,
  useColorScheme,
} from 'react-native';
import {format} from 'date-fns';
import {StyleSheet} from 'utils';
import {useSelector} from 'store/reducers/rootReducers';
import {PlanningFilter} from './PlanningFilter';
import {WithTranslation, withTranslation} from 'react-i18next';

const getItemLayout = (_: any, index: number) => ({
  length: itemWidth,
  offset: itemWidth * index,
  index,
});

const keyExtractor = (_: Date, index: number) =>
  `${_.toDateString()} - ${index}`;

interface CalendarComponentProps extends CalendarProps, WithTranslation {}

const CalendarComponent: FC<CalendarComponentProps> = memo(
  ({i18n, date, onPressDate, selectedColor, onChangePlanningFilter}) => {
    const scheme = useColorScheme();
    const [selectedDate, setSelectedDate] = useState(date);
    // to get current page's month
    const [appearDate, setAppearDate] = useState(date);
    const flatListRef: LegacyRef<any> = useRef<FlatList>();

    const isBlocked = useSelector(x => x.coaches.coachSelected?.blocked);

    const language = React.useMemo(() => i18n.language as Language, [i18n]);

    const wholeWeek = useMemo(
      () => createWholeWeek(selectedDate),
      [selectedDate],
    );

    const selectDate = useCallback(
      (d: Date) => {
        unstable_batchedUpdates(() => {
          onPressDate(d);
          setSelectedDate(d);
        });
      },
      [onPressDate],
    );

    const [weeks, setWeeks] = useState<Date[]>([]);

    useEffect(() => {
      if (weeks.length > 0) {
        return;
      }
      setWeeks(createWholeWeeks(selectedDate, wholeWeek));
    }, [selectedDate, weeks, wholeWeek]);

    const endReach = useCallback(() => {
      unstable_batchedUpdates(() => {
        const n = createNextTwoWeeks(weeks.slice(-1)[0], []);
        setWeeks(w => {
          return [...w, ...n];
        });
      });
    }, [weeks]);

    const momentumEnd = useCallback(
      (event: ScrollEvent) => {
        const widthFromStart = event.nativeEvent.contentOffset.x;
        if (widthFromStart < screenWidth) {
          const b = createPreviousTwoWeeks(weeks[0], []);
          unstable_batchedUpdates(() => {
            setWeeks(w => {
              return [...b, ...w];
            });
            flatListRef.current.scrollToIndex({animated: false, index: 14});
          });
        }

        const currentPage =
          widthFromStart / event.nativeEvent.layoutMeasurement.width;

        const _date = weeks[currentPage * 7 + 6];
        const _dateInitialWeek = weeks[currentPage * 7 + 0];

        if (!_date) {
          return;
        }

        unstable_batchedUpdates(() => {
          setAppearDate(_date);
          if (_dateInitialWeek.getFullYear() !== selectedDate.getFullYear()) {
            setSelectedDate(_date);
          }
        });
      },
      [weeks, selectedDate],
    );

    const onChangeMonth = useCallback(
      (_month: number, fullDate?: Date) => {
        const month = _month - 1;
        const now = format(new Date(), 'M', {
          locale: createLocalWeek(language),
        });
        const isSameYear =
          selectedDate.getFullYear() === new Date().getFullYear();
        const _date = fullDate
          ? fullDate
          : now === String(month + 1) && isSameYear
          ? new Date()
          : new Date(
              isSameYear
                ? new Date().getFullYear()
                : selectedDate.getFullYear(),
              month,
              1,
            );

        unstable_batchedUpdates(() => {
          const _wholeWeek = createWholeWeek(_date);
          const _wholeWeeks = createWholeWeeks(_date, _wholeWeek);
          setAppearDate(_date);
          selectDate(_date);
          setWeeks(_wholeWeeks);
          flatListRef.current?.scrollToIndex({animated: false, index: 14});
        });
      },
      [language, selectDate, selectedDate],
    );

    const onChangeFullDate = useCallback(
      (_date: Date) => {
        unstable_batchedUpdates(() => {
          const _wholeWeek = createWholeWeek(_date);
          const _wholeWeeks = createWholeWeeks(_date, _wholeWeek);
          setAppearDate(_date);
          selectDate(_date);
          setWeeks(_wholeWeeks);
          flatListRef.current?.scrollToIndex({animated: false, index: 14});
        });
      },
      [selectDate],
    );

    const localMonth = useMemo(() => {
      return format(appearDate, 'M', {locale: createLocalWeek(language)});
    }, [appearDate, language]);

    const renderItem = useCallback(
      ({item}: {item: Date}) => {
        return (
          <WeekItem
            date={item}
            selectedDate={formatDate(item) === formatDate(date)}
            onSelectDate={selectDate}
            selectedColor={selectedColor}
            key={item.toDateString()}
          />
        );
      },
      [date, selectDate, selectedColor],
    );

    const _viewConfigRef = React.useRef({
      viewAreaCoveragePercentThreshold: 60,
      minimumViewTime: 500,
      itemVisiblePercentThreshold: 14,
    });

    return (
      <View
        style={
          scheme === 'dark'
            ? customStyles.containerShadowDark
            : customStyles.containerShadow
        }>
        <Header
          currentMonth={localMonth}
          onChangeMonth={onChangeMonth}
          onChangeFullDate={onChangeFullDate}
          currentDate={selectedDate}
        />

        {weeks.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={weeks}
            pointerEvents={isBlocked ? 'none' : 'auto'}
            extraData={selectedDate}
            viewabilityConfig={_viewConfigRef.current}
            horizontal
            pagingEnabled
            bounces
            windowSize={60}
            removeClippedSubviews
            initialScrollIndex={14}
            initialNumToRender={14}
            maxToRenderPerBatch={500}
            updateCellsBatchingPeriod={50}
            onEndReachedThreshold={0.9}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onEndReached={endReach}
            onMomentumScrollEnd={momentumEnd}
            getItemLayout={getItemLayout}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        )}
        <PlanningFilter onChangePlanningFilter={onChangePlanningFilter} />
      </View>
    );
  },
);

const customStyles = StyleSheet.create({
  containerShadowDark: {
    backgroundColor: '$colors_dark',
    paddingTop: 5,
    paddingBottom: 10,
    ...styles.shadow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  containerShadow: {
    backgroundColor: '$colors_dark',
    paddingTop: 5,
    paddingBottom: 10,
    ...styles.shadow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  container: {
    backgroundColor: '$colors_dark',
    paddingTop: 5,
    paddingBottom: 10,
  },
});

export default withTranslation()(CalendarComponent);

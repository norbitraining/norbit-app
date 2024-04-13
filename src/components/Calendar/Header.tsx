import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  unstable_batchedUpdates,
} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';

import Text from 'components/Text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {CalendarHeaderProps} from './helpers';
import {Svg} from 'assets/svg';

import {margin, padding} from 'theme/spacing';
import {GlobalStyles} from 'theme/globalStyle';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {trigger} from 'react-native-haptic-feedback';
import {fontNormalize} from 'utils';
import CoachSelection from 'components/CoachSelection';
import {useSelector} from 'store/reducers/rootReducers';
import moment from 'moment';
import 'moment/locale/es';
import {WithTranslation, withTranslation} from 'react-i18next';

const PAGE_WIDTH = Dimensions.get('screen').width;

interface HeaderProps extends CalendarHeaderProps, WithTranslation {}

const HeaderComponent: FC<HeaderProps> = memo(
  ({i18n, currentMonth, onChangeMonth, onChangeFullDate, currentDate}) => {
    const ref = useRef<ICarouselInstance | any>();
    const [showModalYears, setShowModalYears] = useState<boolean>(false);
    const [fullDate, setFullDate] = useState<Date>(new Date());
    const insets = useSafeAreaInsets();

    const isBlocked = useSelector(x => x.coaches.coachSelected?.blocked);

    useEffect(() => {
      if (!currentDate) {
        return;
      }
      if (fullDate === currentDate) {
        return;
      }
      setFullDate(currentDate);
    }, [currentDate, fullDate]);

    const getMonthName = React.useCallback(
      (monthNumber: number) => {
        const date = moment({
          month: monthNumber === 0 ? 11 : monthNumber - 1,
          day: 1,
        });
        return date.locale(i18n.language).format('MMMM');
      },
      [i18n.language],
    );

    const getYear = useMemo(() => {
      const date = moment(fullDate);

      return date.locale(i18n.language).format('YYYY');
    }, [fullDate, i18n.language]);

    const progressValue = useSharedValue<number>(0);
    const baseOptions = {
      vertical: false,
      width: PAGE_WIDTH * 0.41,
      height: fontNormalize(38),
    } as const;

    const carouselStyle = useMemo(
      () => ({
        width: PAGE_WIDTH,
        height: fontNormalize(38),
      }),
      [],
    );

    const onPressDatePicker = () => {
      setShowModalYears(!showModalYears);
    };

    const onPressDateSelection = (_date: Date) => {
      unstable_batchedUpdates(() => {
        setFullDate(_date);
        onChangeFullDate?.(_date);
        onPressDatePicker();
      });
    };

    const onChangeSnap = useCallback(
      (index: number) => {
        unstable_batchedUpdates(() => {
          let _fullDate;

          if (
            (Number(currentMonth) === 1 || Number(currentMonth) < 3) &&
            index === 0
          ) {
            _fullDate = new Date(fullDate.getFullYear(), -1, 1);
          } else if (
            (Number(currentMonth) > 10 || Number(currentMonth) === 12) &&
            index === 1
          ) {
            _fullDate = new Date(fullDate.getFullYear() + 1, 0, 1);
          }

          _fullDate && setFullDate(_fullDate);
          onChangeMonth?.(index === 0 ? 12 : index, _fullDate);
        });
      },
      [currentMonth, fullDate, onChangeMonth],
    );

    const renderItemCarousel = useCallback(
      ({item, index}: {item: number; index: number}) => {
        const monthSelected =
          String(item === 0 ? 12 : item) === String(currentMonth);

        const indexToCount = item === 0 ? 12 : item;

        const onPress = () => {
          trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          if (Number(currentMonth) === indexToCount) {
            return;
          }
          ref.current?.scrollTo({
            animated: true,
            count:
              indexToCount > Number(currentMonth)
                ? indexToCount - Number(currentMonth)
                : indexToCount,
          });
        };

        return (
          <TouchableOpacity
            disabled={isBlocked}
            style={[GlobalStyles.flex, GlobalStyles.center]}
            onPress={onPress}
            activeOpacity={0.9}>
            <Text
              fontSize={fontNormalize(monthSelected && !isBlocked ? 26 : 24)}
              weight={monthSelected && !isBlocked ? 'SemiBold' : 'Light'}
              color={monthSelected && !isBlocked ? 'white' : '#747474'}
              style={GlobalStyles.textCapitalize}>
              {getMonthName(index)}
            </Text>
          </TouchableOpacity>
        );
      },
      [currentMonth, getMonthName, isBlocked],
    );

    return (
      <View style={padding.pb5}>
        <View
          style={[GlobalStyles.rowSb, padding.pb9, padding.ph20, margin.mt5]}>
          <TouchableOpacity
            disabled={isBlocked}
            style={GlobalStyles.row}
            activeOpacity={0.8}
            onPress={onPressDatePicker}>
            <Svg.MoreSvg width={24} height={24} />
            <Text
              color="white"
              style={margin.ml12}
              fontSize={fontNormalize(16)}>
              {getYear}
            </Text>
          </TouchableOpacity>
          <CoachSelection />
        </View>
        <Carousel
          enabled={!isBlocked}
          ref={ref}
          {...baseOptions}
          style={carouselStyle}
          loop
          snapEnabled
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
          defaultIndex={Number(currentMonth) > 11 ? 0 : Number(currentMonth)}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.85,
            parallaxScrollingOffset: 35,
          }}
          onSnapToItem={onChangeSnap}
          data={[...new Array(12).keys()]}
          renderItem={renderItemCarousel}
        />
        <DateTimePickerModal
          isVisible={showModalYears}
          mode="date"
          modalStyleIOS={{
            marginBottom: insets.bottom,
          }}
          themeVariant="dark"
          locale={i18n.language}
          isDarkModeEnabled
          date={fullDate}
          onConfirm={onPressDateSelection}
          onCancel={onPressDatePicker}
        />
      </View>
    );
  },
);
export const Header = withTranslation()(HeaderComponent);

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  useColorScheme,
  View,
  ViewToken,
  ListRenderItemInfo,
  SectionList,
  ViewProps,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {GlobalStyles} from 'theme/globalStyle';
import {useSelector} from 'store/reducers/rootReducers';
import {planningActions} from 'store/reducers/planning';

import {ItemAnimation} from './components/AnimationItem';
import {CalendarSkeletonItem} from './components/CalendarSkeletonItem';
import Calendar from 'components/Calendar';
import {EmptyPlanning} from './components/EmptyPlanning';

import {format} from 'date-fns';
import {rHeight} from 'utils';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

interface CalendaryScreenProps {
  getPlanningAction: typeof planningActions.getPlanningAction;
}

const HEADER_HEIGHT = 100;

const CalendarScreen: React.FC<CalendaryScreenProps> = ({
  getPlanningAction,
}) => {
  const scheme = useColorScheme();
  const {height: screenHeight} = useWindowDimensions();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const currentPlanning = useSelector(x => x.planning);

  const scrollValue = useSharedValue(0);
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const [date, setDate] = useState(new Date());
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const suggestionsRef = useRef<SectionList | any>(null);
  const onViewRef = React.useRef(({viewableItems: vItems}: any) => {
    viewableItems.value = vItems;
  });
  const viewConfigRef = React.useRef({
    itemVisiblePercentThreshold: 5,
  });

  const headerConfig = useMemo<{
    heightExpanded: number;
    heightCollapsed: number;
  }>(
    () => ({
      heightCollapsed: HEADER_HEIGHT + 5,
      heightExpanded: headerHeight,
    }),
    [headerHeight],
  );

  const headerDiff = useMemo(() => {
    return headerConfig.heightExpanded - headerConfig.heightCollapsed;
  }, [headerConfig]);

  const translateY = useDerivedValue(
    () => -Math.min(scrollValue.value, headerDiff),
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    position: 'absolute',
    zIndex: 1,
  }));

  const containerStyle = useMemo(
    () => ({
      paddingTop: headerHeight > 0 ? headerHeight : 0,
      paddingBottom: rHeight(20),
    }),
    [headerHeight],
  );

  const containerStyleLoading = useMemo(
    () => ({
      paddingTop: headerHeight > 0 ? headerHeight : 0,
      minHeight: screenHeight + headerDiff,
    }),
    [headerDiff, headerHeight, screenHeight],
  );

  const getPlanning = useCallback(() => {
    getPlanningAction({date: format(date, 'yyyy-MM-dd')});
  }, [date, getPlanningAction]);

  const pressDate = useCallback(
    (d: Date) => {
      setDate(d);
      if (d !== date) {
        return;
      }
      getPlanning();
    },
    [date, getPlanning],
  );

  useEffect(() => {
    getPlanning();
  }, [getPlanning]);

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<any>) => {
      return (
        <ItemAnimation
          item={item}
          index={index}
          viewableItems={viewableItems}
        />
      );
    },
    [viewableItems],
  );

  const onScrollHandler = useAnimatedScrollHandler(
    event =>
      (scrollValue.value =
        event.contentOffset.y > 0 ? event.contentOffset.y : 0),
  );

  const handleHeaderLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
    event => setHeaderHeight(event.nativeEvent.layout.height),
    [],
  );

  const ListHeaderComponent = useMemo(() => {
    if (currentPlanning.planningList.length) {
      return null;
    }
    return EmptyPlanning;
  }, [currentPlanning.planningList.length]);

  return (
    <View style={isDark ? GlobalStyles.container : GlobalStyles.containerWhite}>
      <Animated.View
        onLayout={handleHeaderLayout}
        style={headerAnimatedStyle}
        needsOffscreenAlphaCompositing>
        <Calendar date={date} onPressDate={pressDate} language="es" />
      </Animated.View>
      {currentPlanning.isLoading && (
        <Animated.View
          style={containerStyleLoading}
          needsOffscreenAlphaCompositing>
          <CalendarSkeletonItem />
        </Animated.View>
      )}
      {!currentPlanning.isLoading && (
        <AnimatedSectionList
          exiting={FadeOut.springify()}
          entering={FadeIn.springify()}
          needsOffscreenAlphaCompositing
          renderToHardwareTextureAndroid
          ref={suggestionsRef}
          sections={currentPlanning.planningList}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          scrollEventThrottle={16}
          style={isDark && GlobalStyles.flatListDark}
          renderItem={renderItem}
          decelerationRate="fast"
          onScroll={onScrollHandler}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={containerStyle}
        />
      )}
    </View>
  );
};

export default CalendarScreen;

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  useColorScheme,
  View,
  ViewToken,
  SectionListRenderItemInfo,
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
import {BlockedPlanning} from './components/BlockedPlanning';

import {format} from 'date-fns';
import {isAndroid, rHeight} from 'utils';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

interface CalendarScreenProps {
  getPlanningAction: typeof planningActions.getPlanningAction;
}

const HEADER_HEIGHT = isAndroid ? 110 : 100;
const HEADER_HEIGHT_WITH_MULTI_PLANNING = isAndroid ? 60 : 50;

const CalendarScreen: React.FC<CalendarScreenProps> = ({getPlanningAction}) => {
  const scheme = useColorScheme();
  const {height: screenHeight} = useWindowDimensions();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const currentPlanning = useSelector(x => x.planning);
  const currentCoachSelected = useSelector(x => x.coaches.coachSelected);

  const scrollValue = useSharedValue(0);
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const [date, setDate] = useState(new Date());
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [currentPlanningIndex, setCurrentPlanningIndex] = useState<number>(0);

  const planningList = React.useMemo(
    () =>
      currentPlanning.planningList.length > 1
        ? [currentPlanning.planningList[currentPlanningIndex]]
        : currentPlanning.planningList,
    [currentPlanning.planningList, currentPlanningIndex],
  );

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
      heightCollapsed:
        currentPlanning.planningList.length > 1
          ? HEADER_HEIGHT_WITH_MULTI_PLANNING
          : HEADER_HEIGHT,
      heightExpanded: headerHeight,
    }),
    [currentPlanning.planningList.length, headerHeight],
  );

  const headerDiff = useMemo(() => {
    return headerConfig.heightExpanded === 0
      ? 0
      : headerConfig.heightExpanded - headerConfig.heightCollapsed;
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
    if (!currentCoachSelected?.id || currentCoachSelected.blocked) {
      return;
    }
    getPlanning();
  }, [currentCoachSelected, getPlanning]);

  const renderItem = useCallback(
    ({item, index, section}: SectionListRenderItemInfo<any, any>) => {
      return (
        <ItemAnimation
          item={item}
          planningId={section.id}
          index={index}
          viewableItems={viewableItems}
        />
      );
    },
    [viewableItems],
  );

  const onScrollHandler = useAnimatedScrollHandler(
    event =>
      planningList.length &&
      (scrollValue.value =
        event.contentOffset.y > 0 ? event.contentOffset.y : 0),
  );

  const handleHeaderLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
    event => setHeaderHeight(event.nativeEvent.layout.height),
    [],
  );

  const ListHeaderComponent = useMemo(() => {
    if (currentCoachSelected?.blocked) {
      return BlockedPlanning;
    }
    if (currentPlanning.planningList.length) {
      return null;
    }
    return EmptyPlanning;
  }, [currentCoachSelected?.blocked, currentPlanning.planningList.length]);

  const onChangePlanningFilter = React.useCallback((index: number) => {
    setCurrentPlanningIndex(index);
  }, []);

  return (
    <View style={isDark ? GlobalStyles.container : GlobalStyles.containerWhite}>
      <Animated.View
        onLayout={handleHeaderLayout}
        style={headerAnimatedStyle}
        needsOffscreenAlphaCompositing>
        <Calendar
          date={date}
          onChangePlanningFilter={onChangePlanningFilter}
          onPressDate={pressDate}
        />
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
          ref={suggestionsRef}
          sections={planningList}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          scrollEventThrottle={34}
          style={isDark && GlobalStyles.flatListDark}
          renderItem={renderItem}
          scrollEnabled={!currentCoachSelected?.blocked}
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

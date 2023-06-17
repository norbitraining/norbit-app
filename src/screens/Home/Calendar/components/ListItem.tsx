import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  LayoutChangeEvent,
  useColorScheme,
} from 'react-native';
import {GlobalStyles} from 'theme/globalStyle';
import Text from 'components/Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {margin, padding} from 'theme/spacing';
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {trigger} from 'react-native-haptic-feedback';
import {ExerciseItem} from './ExerciseItem';
import {PlanningCard, PlanningColumn} from 'store/reducers/planning';
import {fontNormalize, getLabelActivityType} from 'utils';
import Separator from 'components/Separator';
import {format} from 'date-fns';
import moment from 'moment';

type ListItemProps = {
  item: PlanningColumn;
  index: number;
};

const ListItem: React.FC<ListItemProps> = React.memo(({item}) => {
  const scheme = useColorScheme();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const [expanded, setExpanded] = useState(true);
  const aref = useAnimatedRef<View>();
  const height = useSharedValue<number>(100);
  const animatedVar = useDerivedValue(
    () => (expanded ? withTiming(1) : withTiming(0)),
    [expanded],
  );
  const iconRotate = useSharedValue<number>(1);

  const onLayout = useCallback(
    (_event: LayoutChangeEvent) => {
      if (_event.nativeEvent.layout.height < 100) {
        return;
      }
      height.value = withTiming(_event.nativeEvent.layout.height, {
        duration: 0,
      });
    },
    [height],
  );

  const toggleAccordion = () => {
    if (height.value === 0) {
      runOnUI(() => {
        'worklet';

        height.value = measure(aref).height;
      })();
    }
    iconRotate.value = withTiming(expanded ? 0 : 1);
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setExpanded(!expanded);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        animatedVar.value,
        [0, 1],
        [0, height.value],
        Extrapolate.CLAMP,
      ),
      opacity: withTiming(expanded ? 1 : 0),
      width: '100%',
      paddingHorizontal: 3,
    };
  });

  const animatedArrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateX: `${interpolate(
            iconRotate.value,
            [0, 1],
            [0, 180],
            Extrapolate.CLAMP,
          )}deg`,
        },
      ],
    };
  });

  return (
    <>
      {item.cards.map((card, index) => (
        <View key={index} needsOffscreenAlphaCompositing>
          <View
            style={[
              GlobalStyles.rowSb,
              padding.ph7,
              padding.pb7,
              GlobalStyles.alignItemsStart,
            ]}>
            <View style={GlobalStyles.flex}>
              <Text
                fontSize={fontNormalize(22)}
                weight="Medium"
                color={isDark ? 'white' : 'black'}>
                {item.columnName}
              </Text>
            </View>
            <View
              style={[
                GlobalStyles.center,
                GlobalStyles.alignItemsStart,
                margin.mt5,
              ]}>
              <TouchableOpacity
                hitSlop={{top: 20, right: 10, left: 15, bottom: 5}}
                activeOpacity={0.8}
                onPress={toggleAccordion}>
                <View
                  style={[GlobalStyles.row, GlobalStyles.justifyContentEnd]}>
                  <Text
                    fontSize={fontNormalize(18)}
                    weight="Light"
                    color={isDark ? 'white' : 'black'}>
                    {card.selectedActivityType === 'round' && card.value1}
                    {getLabelActivityType(
                      card.selectedActivityType,
                      card.value1,
                    )}
                  </Text>

                  <Animated.View style={animatedArrowStyle}>
                    <Icon
                      name={'chevron-down'}
                      size={16}
                      style={margin.ml12}
                      color={EStyleSheet.value('$colors_danger')}
                    />
                  </Animated.View>
                </View>
                <View>
                  {card.selectedActivityType !== 'none' &&
                    card.selectedActivityType !== 'round' && (
                      <DetailByTime card={card} isDark={isDark} />
                    )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Animated.View style={animatedStyle} needsOffscreenAlphaCompositing>
            <View
              ref={aref}
              onLayout={onLayout}
              needsOffscreenAlphaCompositing
              style={padding.ph4}>
              {!card.comment && <Separator thickness={5} />}
              {!!card.comment && (
                <View style={[padding.pb9, margin.mt5]}>
                  <Text style={margin.mb5} color={isDark ? 'white' : 'black'}>
                    Indicaciones:
                  </Text>
                  <Text
                    weight="Light"
                    color={
                      isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                    }>
                    {card.comment}
                  </Text>
                </View>
              )}

              {card.exerciseList.map((exercise, indexExercise) => {
                return (
                  <ExerciseItem
                    key={indexExercise}
                    exerciseName={exercise?.exercise?.exerciseName || ''}
                    videoUrl={exercise?.exercise?.videoUrl || ''}
                    rounds={exercise?.rounds || ''}
                    reps={exercise?.reps || ''}
                    weight={exercise?.weight || ''}
                    time={exercise?.time || ''}
                    distance={exercise?.distance || ''}
                  />
                );
              })}
            </View>
          </Animated.View>
        </View>
      ))}
    </>
  );
});

const DetailByTime = ({
  card,
  isDark,
}: {
  card: PlanningCard;
  isDark: boolean;
}) => {
  return (
    <>
      {(card.selectedActivityType === 'fortime' ||
        card.selectedActivityType === 'amrap') && (
        <View
          style={[
            GlobalStyles.row,
            GlobalStyles.justifyContentEnd,
            margin.mt5,
          ]}>
          <Text
            fontSize={13}
            color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
            {card.selectedActivityType === 'amrap' ? 'Tiempo: ' : 'Timecap: '}
          </Text>
          <Text
            fontSize={13}
            weight="Light"
            color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
            {format(new Date(card.value1), 'mm:ss')} min
          </Text>
        </View>
      )}
      {card.selectedActivityType === 'emom' && (
        <View style={GlobalStyles.row}>
          <View style={[GlobalStyles.justifyContentEnd, margin.mt5]}>
            <Text
              fontSize={13}
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              Cada:
            </Text>
            <Text
              fontSize={13}
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              {format(moment(card.value1).toDate(), 'mm:ss')} min
            </Text>
          </View>
          <View style={margin.mh5}>
            <Text
              fontSize={13}
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              /{' '}
            </Text>
          </View>
          <View style={[GlobalStyles.justifyContentEnd, margin.mt5]}>
            <Text
              fontSize={13}
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              Por:
            </Text>
            <Text
              fontSize={13}
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              {card.value2} rondas
            </Text>
          </View>
        </View>
      )}
      {card.selectedActivityType === 'tabata' && (
        <View style={[GlobalStyles.row]}>
          <View style={[GlobalStyles.justifyContentEnd, margin.mt5]}>
            <Text
              fontSize={13}
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              Rondas:{' '}
            </Text>
            <Text
              fontSize={13}
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              {card.value1}
            </Text>
          </View>

          <View style={margin.mh5}>
            <Text
              fontSize={13}
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
              /
            </Text>
          </View>
          <View style={GlobalStyles.row}>
            <View style={[GlobalStyles.justifyContentEnd, margin.mt5]}>
              <Text
                fontSize={13}
                color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
                Trabajo:{' '}
              </Text>
              <Text
                fontSize={13}
                weight="Light"
                color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
                {format(new Date(card.value2), 'mm:ss')}
              </Text>
            </View>
            <View style={margin.mh5}>
              <Text
                fontSize={13}
                weight="Light"
                color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
                /
              </Text>
            </View>
            <View style={[GlobalStyles.justifyContentEnd, margin.mt5]}>
              <Text
                fontSize={13}
                color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
                Descanso:{' '}
              </Text>
              <Text
                fontSize={13}
                weight="Light"
                color={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)'}>
                {format(new Date(card.value3), 'mm:ss')}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export {ListItem};

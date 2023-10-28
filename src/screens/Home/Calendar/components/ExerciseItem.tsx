import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useColorScheme,
  unstable_batchedUpdates,
} from 'react-native';
import {GlobalStyles} from 'theme/globalStyle';
import Text from 'components/Text';
import Icon from 'react-native-vector-icons/Feather';
import {margin, padding} from 'theme/spacing';
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {trigger} from 'react-native-haptic-feedback';

import {Svg} from 'assets/svg';
import {StyleSheet, fontNormalize, isAndroid, rHeight, rWidth} from 'utils';
import YoutubePlayer from 'react-native-youtube-iframe';

type ExerciseItemProps = {
  exerciseName: string;
  rounds?: string;
  reps?: string;
  distance?: string;
  time?: string;
  weight?: string;
  videoUrl?: string;
};

interface Field {
  label: string;
  isWeight?: boolean;
  percentage?: string;
}

const ExerciseItem: React.FC<ExerciseItemProps> = React.memo(
  ({exerciseName, rounds, reps, distance, time, weight, videoUrl}) => {
    const scheme = useColorScheme();
    const isDark = useMemo(() => scheme === 'dark', [scheme]);

    const fields = React.useMemo((): Field[] => {
      return [
        ...(rounds
          ? [
              {
                label: `${rounds} ${
                  Number(rounds) >= 0
                    ? Number(rounds) > 1
                      ? 'Rondas'
                      : 'Ronda'
                    : ''
                }`,
              },
            ]
          : []),
        ...(distance
          ? [
              {
                label: `${distance}`,
              },
            ]
          : []),
        ...(time
          ? [
              {
                label: `${time}`,
              },
            ]
          : []),
        ...(reps
          ? [
              {
                label: `${reps} ${
                  Number(reps) >= 0 || reps.includes('/') || reps.includes('-')
                    ? 'Reps'
                    : ''
                }`,
              },
            ]
          : []),
        ...(weight
          ? [
              {
                label: `${weight}`,
                isWeight: true,
              },
            ]
          : []),
      ];
    }, [distance, reps, rounds, time, weight]);

    const [playing, setPlaying] = useState(false);

    const [expanded, setExpanded] = useState(false);

    const height = useSharedValue<number>(0);
    const iconRotate = useSharedValue<number>(0);

    const timeOutVideoRef = useRef<number | any>();

    const toggleVideo = useCallback(() => {
      trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });

      unstable_batchedUpdates(() => {
        if (expanded) {
          setPlaying(false);
          height.value = withTiming(0);
          iconRotate.value = withTiming(0);
        } else {
          timeOutVideoRef.current && clearTimeout(timeOutVideoRef.current);
          timeOutVideoRef.current = setTimeout(() => {
            setPlaying(true);
          }, 500);
          height.value = withTiming(rHeight(isAndroid ? 145 : 150));
          iconRotate.value = withTiming(1);
        }
        setExpanded(!expanded);
      });
    }, [expanded, height, iconRotate]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: height.value,
        opacity: withTiming(expanded ? 1 : 0),
        width: '100%',
        paddingHorizontal: 3,
        zIndex: -1,
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

    const renderField = useCallback(
      (field: Field, index: number) => {
        return (
          <View
            key={index}
            style={[
              styles.containerDetailExercise,
              GlobalStyles.center,
              GlobalStyles.row,
              isDark && styles.containerDetailExerciseDark,
              margin.mt5,
              {maxWidth: field.percentage},
            ]}>
            {field.isWeight && <Svg.WeightSvg style={margin.mr5} />}
            <Text
              fontSize={fontNormalize(14)}
              weight="Light"
              color={isDark ? 'white' : 'black'}>
              {field.label}
            </Text>
          </View>
        );
      },
      [isDark],
    );

    const onStateChange = useCallback((state: any) => {
      if (state === 'ended') {
        setPlaying(false);
      }
    }, []);

    return (
      <View
        style={[
          styles.container,
          isDark && styles.containerDark,
          styles.containerMin,
          (!videoUrl || !weight || !rounds || !reps) && [GlobalStyles.center],
        ]}
        needsOffscreenAlphaCompositing>
        <View style={[GlobalStyles.rowSb, padding.ph12, padding.pv10]}>
          <View style={[styles.contentTitleExercise, GlobalStyles.row]}>
            {!videoUrl && (
              <Text
                fontSize={fontNormalize(14)}
                color={isDark ? 'white' : 'black'}
                weight="Medium">
                {exerciseName}
              </Text>
            )}

            {!!videoUrl && (
              <View style={styles.contentButtonVideo}>
                <TouchableOpacity
                  style={GlobalStyles.center}
                  hitSlop={{top: 20, right: 20, left: 15, bottom: 5}}
                  activeOpacity={0.9}
                  onPress={toggleVideo}>
                  <View style={GlobalStyles.row}>
                    <View style={GlobalStyles.center}>
                      <Svg.VideoSvg width={fontNormalize(18)} />
                      <Animated.View style={animatedArrowStyle}>
                        <Icon
                          name={'chevron-down'}
                          size={fontNormalize(13)}
                          color={EStyleSheet.value('$colors_danger')}
                        />
                      </Animated.View>
                    </View>
                    <Text
                      fontSize={fontNormalize(14)}
                      weight="Medium"
                      color={isDark ? 'white' : 'black'}
                      style={styles.minWidthExerciseName}>
                      {exerciseName}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.containerFields}>{fields.map(renderField)}</View>
        </View>
        {!!videoUrl && (
          <Animated.View style={animatedStyle}>
            {expanded && (
              <Animated.View
                style={styles.contentVideo}
                entering={FadeIn.springify()}
                exiting={FadeOut.springify()}>
                <YoutubePlayer
                  height={'100%' as any}
                  width={'100%' as any}
                  forceAndroidAutoplay={isAndroid}
                  webViewStyle={styles.webView}
                  webViewProps={{
                    startInLoadingState: true,
                    shouldRasterizeIOS: true,
                  }}
                  play={playing}
                  contentScale={0.75}
                  videoId={videoUrl}
                  onChangeState={onStateChange}
                />
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  alignItemsStart: {alignSelf: 'flex-start'},
  contentVideo: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    shadowColor: '#000',
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderRadius: 6,
    marginVertical: 7,
    minHeight: rWidth(60),
  },
  containerDark: {backgroundColor: '#131820'},
  containerFields: {
    ...GlobalStyles.row,
    ...GlobalStyles.flex,
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.65,
    paddingHorizontal: 5,
  },
  containerMin: {
    minHeight: rWidth(50),
  },
  contentTitleExercise: {flex: 0.35},
  containerDetailExercise: {
    backgroundColor: '#F6F6F6',
    padding: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  webView: {
    backgroundColor: '$colors_dark',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
  },
  containerDetailExerciseDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  contentButtonVideo: {
    ...GlobalStyles.center,
    paddingTop: 5,
  },
  row3: {justifyContent: 'flex-end', flex: 0.8, marginLeft: 15},
  flexEnd: {alignItems: 'flex-end'},
  minWidthExerciseName: {
    ...margin.ml7,
    minWidth: rWidth(50),
    maxWidth: '80%',
  },
});

export {ExerciseItem};

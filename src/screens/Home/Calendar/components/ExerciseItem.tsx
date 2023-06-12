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
import Separator from 'components/Separator';
import {Svg} from 'assets/svg';
import {StyleSheet, fontNormalize, isAndroid, rHeight, rWidth} from 'utils';
import YoutubePlayer from 'react-native-youtube-iframe';

type ExerciseItemProps = {
  exerciseName: string;
  rounds?: string;
  reps?: string;
  weight?: string;
  videoUrl?: string;
};

const ExerciseItem: React.FC<ExerciseItemProps> = React.memo(
  ({exerciseName, rounds, reps, weight, videoUrl}) => {
    const scheme = useColorScheme();
    const isDark = useMemo(() => scheme === 'dark', [scheme]);

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

    const ContentDetailExercise = useCallback(
      ({text, isWeight = false}: any) => {
        return (
          <View
            style={[
              styles.containerDetailExercise,
              GlobalStyles.center,
              GlobalStyles.row,
              isDark && styles.containerDetailExerciseDark,
            ]}>
            {isWeight && <Svg.WeightSvg style={margin.mr5} />}
            <Text
              fontSize={fontNormalize(14)}
              weight="Light"
              color={isDark ? 'white' : 'black'}>
              {text}
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
          (!videoUrl || !weight || !rounds || !reps) && [
            GlobalStyles.center,
            styles.containerMin,
          ],
        ]}
        needsOffscreenAlphaCompositing>
        <View style={[GlobalStyles.rowSb, padding.ph15, padding.pv10]}>
          <View style={[GlobalStyles.flex, GlobalStyles.row]}>
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
                      <Svg.VideoSvg />
                      <Animated.View style={animatedArrowStyle}>
                        <Icon
                          name={'chevron-down'}
                          size={fontNormalize(14)}
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
          <View
            style={[
              GlobalStyles.flex,
              GlobalStyles.center,
              videoUrl && styles.flexEnd,
            ]}>
            {(rounds || (reps && weight)) && (
              <ContentDetailExercise
                text={rounds ? `${rounds} Rondas` : `${reps} Reps`}
              />
            )}
          </View>
          <View style={[GlobalStyles.row, styles.row3]}>
            <View>
              {(reps || weight) && (
                <ContentDetailExercise
                  text={(rounds || !weight) && reps ? `${reps} Reps` : weight}
                  isWeight={weight && (!rounds || !reps)}
                />
              )}

              {rounds && reps && weight && (
                <>
                  <Separator thickness={7} />
                  <ContentDetailExercise text={`${weight}`} isWeight />
                </>
              )}
            </View>
          </View>
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
  containerMin: {
    minHeight: rWidth(50),
  },
  containerDetailExercise: {
    backgroundColor: '#F6F6F6',
    padding: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
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

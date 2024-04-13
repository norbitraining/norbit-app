import React, {useCallback} from 'react';
import {
  GestureResponderEvent,
  Platform,
  ScrollViewProps,
  useWindowDimensions,
} from 'react-native';
import {
  useKeyboardHandler,
  useResizeMode,
} from 'react-native-keyboard-controller';
import Reanimated, {
  Easing,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSharedRef} from 'utils';

const IS_ANDROID_ELEVEN_OR_HIGHER =
  Platform.OS === 'android' && Platform.Version >= 30;

const IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS =
  IS_ANDROID_ELEVEN_OR_HIGHER || Platform.OS === 'ios';

const TELEGRAM_ANDROID_TIMING_CONFIG = {
  duration: 250,
  easing: Easing.bezier(
    0.19919472913616398,
    0.010644531250000006,
    0.27920937042459737,
    0.91025390625,
  ),
};
const BOTTOM_OFFSET = 50;

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  onScrollAnimated?: (value: number) => void;
  isActive?: (value: boolean) => void;
}

const KeyboardAwareScrollView = React.forwardRef<
  Reanimated.ScrollView,
  KeyboardAwareScrollViewProps
>(({children, isActive = () => {}, onScrollAnimated, ...rest}, ref) => {
  useResizeMode();
  const scrollViewAnimatedRef = useAnimatedRef<Reanimated.ScrollView>();
  const sharedRef = useSharedRef(scrollViewAnimatedRef, ref);

  const scrollPosition = useSharedValue(0);
  const click = useSharedValue(0);
  const position = useSharedValue(0);
  const fakeViewHeight = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const animatedKeyboardHeight = useSharedValue(0);

  const {height} = useWindowDimensions();

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      onScrollAnimated?.(e.contentOffset.y);
      position.value = e.contentOffset.y;
    },
  });

  const onContentTouch = useCallback(
    (e: GestureResponderEvent) => {
      if (keyboardHeight.value === 0) {
        click.value = e.nativeEvent.pageY;
        scrollPosition.value = position.value;
        isActive(true);
      } else {
        isActive(false);
      }
    },
    [click, keyboardHeight, position, scrollPosition, isActive],
  );

  useKeyboardHandler({
    onStart: e => {
      'worklet';
      if (e.height > 0) {
        // just persist height - later will be used in interpolation
        keyboardHeight.value = e.height;
      }
      if (!IS_ANDROID_ELEVEN_OR_HIGHER_OR_IOS) {
        animatedKeyboardHeight.value = withTiming(
          e.height,
          TELEGRAM_ANDROID_TIMING_CONFIG,
        );
      }
    },
    onMove: e => {
      'worklet';

      fakeViewHeight.value = e.height;

      const visibleRect = height - e.height;
      if (visibleRect - click.value <= BOTTOM_OFFSET) {
        const interpolatedScrollTo = interpolate(
          e.height,
          [0, keyboardHeight.value],
          [0, keyboardHeight.value - (height - click.value) + BOTTOM_OFFSET],
        );
        const targetScrollY =
          Math.max(interpolatedScrollTo, 0) + scrollPosition.value;
        scrollTo(scrollViewAnimatedRef, 0, targetScrollY, false);
      }
    },
    onEnd: () => {
      'worklet';
      keyboardHeight.value = 0;
    },
  });

  const view = useAnimatedStyle(
    () => ({
      height: fakeViewHeight.value,
    }),
    [],
  );

  return (
    <Reanimated.ScrollView
      ref={sharedRef as any}
      {...rest}
      onScroll={onScroll}
      onTouchStart={onContentTouch}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}>
      {children}
      <Reanimated.View style={view} />
    </Reanimated.ScrollView>
  );
});

export default KeyboardAwareScrollView;

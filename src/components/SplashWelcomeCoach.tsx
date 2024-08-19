import React from 'react';
import {ActivityIndicator, StyleSheet as RNStyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';
import {useSelector} from 'store/reducers/rootReducers';
import {GlobalStyles} from 'theme/globalStyle';
import {StyleSheet} from 'utils';

import Separator from './Separator';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const SplashWelcomeCoach: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const isLoggedIn = useSelector(x => x.user.isLoggedIn);
  const coachSelected = useSelector(x => x.coaches.coachSelected);
  const opacity = useSharedValue(1);

  const hideSplash = React.useCallback(() => {
    opacity.value = withTiming(0, {duration: 500}, () => {
      runOnJS(setShowSplash)(false);
    });
  }, [opacity]);

  React.useEffect(() => {
    if (!showSplash) {
      return;
    }

    if (!isLoggedIn) {
      hideSplash();
      return;
    }

    if (!coachSelected?.coach?.profile_picture_blob) {
      hideSplash();
      return;
    }

    const refTimeout = setTimeout(hideSplash, 2000);

    return () => {
      clearTimeout(refTimeout);
    };
  }, [
    coachSelected?.coach?.profile_picture_blob,
    hideSplash,
    isLoggedIn,
    showSplash,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!showSplash) {
    return null;
  }

  return (
    <Animated.View
      style={[RNStyleSheet.absoluteFill, GlobalStyles.center, animatedStyle]}>
      <BlurView
        style={[RNStyleSheet.absoluteFill, GlobalStyles.center]}
        blurType="dark"
        blurAmount={16}>
        {!!coachSelected?.coach?.profile_picture_blob && (
          <>
            <FastImage
              source={{
                uri: coachSelected?.coach?.profile_picture_blob,
              }}
              style={styles.profilePicture}
            />
            <Separator thickness={26} />

            <ActivityIndicator color="white" />
          </>
        )}
      </BlurView>
    </Animated.View>
  );
};

export default React.memo(SplashWelcomeCoach);

const styles = StyleSheet.create({
  profilePicture: {
    height: 160,
    width: 160,
    borderRadius: 8,
  },
});

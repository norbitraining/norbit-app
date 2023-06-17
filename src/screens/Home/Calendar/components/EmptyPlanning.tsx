import React, {useMemo} from 'react';
import {Svg} from 'assets/svg';
import {Dimensions, useColorScheme} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {GlobalStyles} from 'theme/globalStyle';
import Text from 'components/Text';
import {StyleSheet, fontNormalize, rHeight} from 'utils';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';

type EmptyPlanningProps = {};

const EmptyPlanning: React.FC<EmptyPlanningProps> = React.memo(({}) => {
  const scheme = useColorScheme();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);
  return (
    <Animated.View
      style={styles.container}
      needsOffscreenAlphaCompositing
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}>
      <Svg.EmptyPlanningSvg
        fill={EStyleSheet.value(isDark ? '#D2D5DA' : '$colors_primary')}
        width={rHeight(95)}
        height={rHeight(90)}
      />
      <Separator thickness={25} />
      <Text
        fontSize={fontNormalize(32)}
        weight="Bold"
        color={EStyleSheet.value(isDark ? '#D2D5DA' : '$colors_primary')}>
        ¡Oops!{' '}
        <Text
          fontSize={fontNormalize(30)}
          weight="Light"
          color={EStyleSheet.value(isDark ? '#D2D5DA' : '$colors_primary')}>
          rest day.
        </Text>
      </Text>
    </Animated.View>
  );
});

const dimensions = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.center,
    height: dimensions.height * 0.45,
  },
});

export {EmptyPlanning};

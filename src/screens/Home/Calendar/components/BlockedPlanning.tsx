import React, {useMemo} from 'react';
import {Svg} from 'assets/svg';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {GlobalStyles} from 'theme/globalStyle';
import Text from 'components/Text';
import {StyleSheet, fontNormalize, rHeight} from 'utils';
import EStyleSheet from 'react-native-extended-stylesheet';
import Separator from 'components/Separator';
import {margin} from 'theme/spacing';
import {ButtonText} from 'utils/text';
import {useDispatch} from 'react-redux';
import {coachesActions} from 'store/reducers/coaches';
import {useSelector} from 'store/reducers/rootReducers';

type BlockedPlanningProps = {};

const BlockedPlanning: React.FC<BlockedPlanningProps> = React.memo(({}) => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const isLoading = useSelector(x => x.coaches.isLoading);

  const handleRetry = React.useCallback(() => {
    dispatch(coachesActions.getCoachesAction());
  }, [dispatch]);

  return (
    <Animated.View
      style={styles.container}
      needsOffscreenAlphaCompositing
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      pointerEvents={isLoading ? 'auto' : 'auto'}>
      <Svg.BlockedPlanningSvg
        fill={EStyleSheet.value(isDark ? '#7E7E7E' : '$colors_primary')}
        width={rHeight(75)}
        height={rHeight(80)}
      />
      <Separator thickness={15} />
      <Text
        fontSize={fontNormalize(26)}
        weight="Light"
        align="center"
        style={[margin.mt10, margin.mh5]}
        color={EStyleSheet.value(isDark ? '#D2D5DA' : '$colors_primary')}>
        Tu planificaciòn ha sido{'\n'}bloqueada
      </Text>
      <TouchableOpacity
        style={margin.mt20}
        activeOpacity={0.8}
        onPress={handleRetry}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text color={isDark ? 'white' : 'black'}>{ButtonText.retry}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const dimensions = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.center,
    height: dimensions.height * 0.55,
  },
});

export {BlockedPlanning};

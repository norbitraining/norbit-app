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
import {useDispatch} from 'react-redux';
import {coachesActions} from 'store/reducers/coaches';
import {useSelector} from 'store/reducers/rootReducers';
import {WithTranslation, withTranslation} from 'react-i18next';

interface BlockedPlanningProps extends WithTranslation {}

const BlockedPlanningComponent: React.FC<BlockedPlanningProps> = React.memo(
  ({t}) => {
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
          {t('common.blockedPlanning')}
        </Text>
        <TouchableOpacity
          style={margin.mt20}
          activeOpacity={0.8}
          onPress={handleRetry}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text color={isDark ? 'white' : 'black'}> {t('button.retry')}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const dimensions = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.center,
    height: dimensions.height * 0.55,
  },
});

const BlockedPlanning = withTranslation()(BlockedPlanningComponent);

export {BlockedPlanning};

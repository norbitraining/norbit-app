import {Skeleton} from '@rneui/themed';
import React, {useCallback, useMemo} from 'react';
import {View, useColorScheme} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {GlobalStyles} from 'theme/globalStyle';
import {margin, padding} from 'theme/spacing';
import {StyleSheet} from 'utils';

type CalendarSkeletonItemProps = {
  isLoading?: boolean;
};

const CalendarSkeletonItem: React.FC<CalendarSkeletonItemProps> = React.memo(
  ({}) => {
    const scheme = useColorScheme();
    const isDark = useMemo(() => scheme === 'dark', [scheme]);

    const SkeletonCard = useCallback(() => {
      return (
        <View style={isDark ? styles.contentCardDark : styles.contentCard}>
          <View style={[GlobalStyles.rowSb, padding.ph15]}>
            <Skeleton
              width={120}
              height={30}
              style={isDark ? styles.skeletonDark : styles.skeleton}
              skeletonStyle={
                isDark ? styles.skeletonColorDark : styles.skeletonColor
              }
            />
            <Skeleton
              width={120}
              height={30}
              style={isDark ? styles.skeletonDark : styles.skeleton}
              skeletonStyle={
                isDark ? styles.skeletonColorDark : styles.skeletonColor
              }
            />
          </View>
          <View style={[padding.ph15, margin.mt20]}>
            <Skeleton
              height={50}
              style={isDark ? styles.skeletonDark : styles.skeleton}
              skeletonStyle={
                isDark ? styles.skeletonColorDark : styles.skeletonColor
              }
            />
          </View>
          <View style={[padding.ph15, margin.mt20]}>
            <Skeleton
              height={50}
              style={isDark ? styles.skeletonDark : styles.skeleton}
              skeletonStyle={
                isDark ? styles.skeletonColorDark : styles.skeletonColor
              }
            />
          </View>
          <View style={[padding.ph15, margin.mt20]}>
            <Skeleton
              height={50}
              style={isDark ? styles.skeletonDark : styles.skeleton}
              skeletonStyle={
                isDark ? styles.skeletonColorDark : styles.skeletonColor
              }
            />
          </View>
        </View>
      );
    }, [isDark]);

    return (
      <Animated.View
        style={[GlobalStyles.center, isDark && GlobalStyles.flatListDark]}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}>
        <SkeletonCard />
        <SkeletonCard />
      </Animated.View>
    );
  },
);

const contentCard = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
  width: '90%',
  paddingVertical: 25,
  backgroundColor: 'white',
  borderRadius: 10,
  marginTop: 20,
} as const;

const styles = StyleSheet.create({
  containerDark: {},
  contentCardDark: {
    ...contentCard,
    shadowColor: 'rgba(39,95,136, 0.2)',
    backgroundColor: '#0F1214',
  },
  contentCard: {
    ...contentCard,
  },
  skeleton: {backgroundColor: 'white'},
  skeletonColor: {backgroundColor: '#D9D9D9', borderRadius: 10},
  skeletonDark: {backgroundColor: '#0F1214'},
  skeletonColorDark: {backgroundColor: '#131820', borderRadius: 10},
});

export {CalendarSkeletonItem};

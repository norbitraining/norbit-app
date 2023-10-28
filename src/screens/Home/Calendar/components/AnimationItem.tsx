import React, {useMemo} from 'react';
import {ViewToken, useColorScheme} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {PlanningColumn} from 'store/reducers/planning';

import {StyleSheet} from 'utils';
import {ListItem} from './ListItem';

type ItemAnimationProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: PlanningColumn;
  planningId: number;
  index: number;
};

const ItemAnimation: React.FC<ItemAnimationProps> = React.memo(
  ({item, planningId, viewableItems, index}) => {
    const scheme = useColorScheme();
    const isDark = useMemo(() => scheme === 'dark', [scheme]);

    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value
          ?.filter?.((_item: any) => _item.isViewable)
          .find(viewableItem => viewableItem.item.id === item.id),
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0),
        transform: [
          {
            scale: withTiming(isVisible ? 1 : 0.9),
          },
        ],
      };
    }, []);

    return (
      <Animated.View
        style={[isDark ? styles.containerDark : styles.container, rStyle]}
        needsOffscreenAlphaCompositing>
        <ListItem item={item} planningId={planningId} index={index} />
      </Animated.View>
    );
  },
);

const containerStyle = {
  shadowColor: '$colors_black',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 3.84,
  elevation: 4,
  width: '95%',
  backgroundColor: '$colors_white',
  alignSelf: 'center',
  borderRadius: 6,
  marginTop: 20,
  paddingVertical: 20,
  paddingHorizontal: 15,
} as const;

const styles = StyleSheet.create({
  container: {
    ...containerStyle,
  },
  containerDark: {
    ...containerStyle,
    shadowColor: 'rgba(39,95,136, 0.2)',
    backgroundColor: '#0F1214',
  },
});

export {ItemAnimation};

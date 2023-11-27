import React, {useRef} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'store/reducers/rootReducers';
import {GlobalStyles} from 'theme/globalStyle';
import {StyleSheet} from 'utils';
import Text from 'components/Text';
import {padding} from 'theme/spacing';
import {normalizeText} from '@rneui/base';
import {trigger} from 'react-native-haptic-feedback';

type PlanningFilterProps = {
  onChangePlanningFilter: (index: number) => void;
};

const {width} = Dimensions.get('window');

const PlanningFilter: React.FC<PlanningFilterProps> = React.memo(
  ({onChangePlanningFilter}) => {
    const scrollRef = useRef<ScrollView | null>(null);

    const [planningSelected, setPlanningSelected] = React.useState<number>(0);

    const countPlanning = useSelector(x => x.planning.planningList.length);

    React.useEffect(() => {
      scrollRef.current?.scrollTo({x: 0});
      setPlanningSelected(0);
    }, [countPlanning]);

    const totalWidth = React.useMemo(
      () => (countPlanning < 3 ? width / 2 : width / 3),
      [countPlanning],
    );

    const renderFilterItem = React.useCallback(
      (_: number, index: number) => {
        const isSelected = planningSelected === index;

        const onPress = () => {
          if (planningSelected === index) {
            return;
          }
          trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          setPlanningSelected(index);
          onChangePlanningFilter(index);

          if (index !== 2) {
            return;
          }
          scrollRef.current?.scrollTo({
            x: index * totalWidth,
            animated: true,
          });
        };
        const contentItemStyle = {
          width: countPlanning < 3 ? width / 2 : width / 3,
          ...(isSelected
            ? GlobalStyles.justifyContentCenter
            : GlobalStyles.center),
          ...(countPlanning < 3 && padding.ph15),
        };
        return (
          <View key={index} style={contentItemStyle}>
            <TouchableOpacity
              style={isSelected ? styles.itemSelected : styles.item}
              hitSlop={{left: 15, top: 20, bottom: 20, right: 15}}
              activeOpacity={0.8}
              onPress={onPress}>
              <Text
                fontSize={normalizeText(13)}
                color={isSelected ? 'black' : '#626262'}>{`Planificación ${
                index + 1
              }`}</Text>
            </TouchableOpacity>
          </View>
        );
      },
      [countPlanning, onChangePlanningFilter, planningSelected, totalWidth],
    );

    return (
      <View
        style={countPlanning < 2 && GlobalStyles.hide}
        needsOffscreenAlphaCompositing
        renderToHardwareTextureAndroid>
        <ScrollView
          ref={scrollRef}
          horizontal
          decelerationRate={0.5}
          disableIntervalMomentum
          snapToInterval={totalWidth}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          pagingEnabled>
          {[...new Array(countPlanning).keys()].map(renderFilterItem)}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  item: {
    ...GlobalStyles.center,
    flexGrow: 1,
    width: '100%',
  },
  itemSelected: {
    ...GlobalStyles.center,
    flex: 1,
    backgroundColor: '$colors_white',
    paddingVertical: 10,
    borderRadius: 100,
  },
});

export {PlanningFilter};

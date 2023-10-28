import React, {useState} from 'react';
import {View, TouchableOpacity, useColorScheme} from 'react-native';

import Animated, {
  Extrapolate,
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

import Text from 'components/Text';

import {StyleSheet} from 'utils';
import {GlobalStyles} from 'theme/globalStyle';
import {margin, padding} from 'theme/spacing';
import {trigger} from 'react-native-haptic-feedback';
import EStyleSheet from 'react-native-extended-stylesheet';

interface ContainerMessageProps {
  onPressEdit?: () => void;
  label: string;
  value: string;
  defaultExpanded?: boolean;
}

export default React.memo<ContainerMessageProps>(function ContainerMessage({
  label,
  onPressEdit,
  value,
  defaultExpanded = true,
}) {
  const schema = useColorScheme();
  const isDark = React.useMemo(() => schema === 'dark', [schema]);

  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const iconRotate = useSharedValue<number>(1);

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

  const toggleAccordion = React.useCallback(() => {
    setExpanded(prevExpanded => {
      iconRotate.value = withTiming(prevExpanded ? 0 : 1);
      trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      return !prevExpanded;
    });
  }, [iconRotate]);

  return (
    <View style={GlobalStyles.row}>
      <View style={[padding.pb5, GlobalStyles.flexible]}>
        <View style={GlobalStyles.rowSb}>
          <TouchableOpacity
            style={[GlobalStyles.row, margin.mb5]}
            hitSlop={{top: 20, right: 10, left: 15, bottom: 5}}
            activeOpacity={0.8}
            onPress={toggleAccordion}>
            <Animated.View style={animatedArrowStyle}>
              <Icon
                name="chevron-down"
                size={20}
                style={margin.mr5}
                color={EStyleSheet.value('$colors_danger')}
              />
            </Animated.View>
            <Text color={isDark ? 'white' : 'black'}>{label}</Text>
          </TouchableOpacity>
          {typeof onPressEdit === 'function' && expanded && (
            <Animated.View
              entering={FadeIn.springify(250)}
              exiting={FadeOut.springify(250)}>
              <TouchableOpacity onPress={onPressEdit}>
                <Icon
                  name="edit-3"
                  size={18}
                  style={margin.mr10}
                  color={schema === 'dark' ? 'white' : 'black'}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
        {expanded && (
          <Animated.View
            entering={FadeIn.springify(250)}
            exiting={FadeOut.springify(250)}
            style={isDark ? styles.contentNotesDark : styles.contentNotes}>
            <Text
              weight="Light"
              color={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}>
              {value}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  contentNotesDark: {
    ...margin.mt10,
    ...padding.p10,
    backgroundColor: '#15191C',
    borderRadius: 5,
  },
  contentNotes: {
    ...margin.mt5,
    ...padding.p10,
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
  },
});

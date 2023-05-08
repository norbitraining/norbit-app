import React from 'react';
import {View, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {fontNormalize, rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigationRef} from 'router/Router';
import EStyleSheet from 'react-native-extended-stylesheet';
import Text from './Text';

export interface HeaderProps {
  showBackButton?: boolean;
  showText?: boolean;
  text?: string;
  textColor?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}

const defaultProps: HeaderProps = {
  showBackButton: true,
  textColor: EStyleSheet.value('$colors_black'),
  iconColor: EStyleSheet.value('$colors_white'),
  showText: true,
};

const Header: React.FC<HeaderProps> = ({
  showBackButton,
  showText,
  text,
  textColor,
  iconColor,
  style,
}): React.ReactElement => {
  const onBackScreen = () => {
    navigationRef.goBack();
  };
  return (
    <View style={[styles.contentHeader, style]}>
      {showBackButton && (
        <View style={styles.contentButton}>
          <TouchableOpacity onPress={onBackScreen}>
            <Icon name="chevron-left" size={rHeight(30)} color={iconColor} />
          </TouchableOpacity>
        </View>
      )}
      {showText && (
        <View style={styles.contentTitle}>
          <Text
            fontSize={fontNormalize(26)}
            color={textColor}
            align="left"
            weight="SemiBold">
            {text}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentButton: {
    width: '15%',
  },
  contentHeader: {
    marginTop: 10,
    marginHorizontal: '1%',
  },
  contentTitle: {
    paddingHorizontal: '4%',
    paddingTop: rHeight(10),
    justifyContent: 'center',
  },
});

export default withDefaults(Header, defaultProps);

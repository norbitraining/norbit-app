import React, {useMemo} from 'react';

import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import {ColorPalette} from 'theme/palette';
import {rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';
import Text, {TextCustomProps} from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

type ButtonTheme = 'light' | 'dark';

export interface ButtonProps {
  text?: string;
  iconName?: string;
  iconProps?: IconProps;
  isLoading?: boolean;
  disabled?: boolean;
  buttonHeight?: number;
  theme?: ButtonTheme;
  textProps?: TextCustomProps;
  colorIndicator?: string;
  buttonColor?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  colorText?: keyof typeof ColorPalette;
  onPress?: () => void;
}

const defaultProps: ButtonProps = {
  text: '',
  buttonColor: ColorPalette.secondary,
  colorIndicator: ColorPalette.white,
  colorText: 'black',
  theme: 'light',
  onPress: () => {},
};

const Button: React.FC<ButtonProps> = ({
  text,
  theme,
  iconName,
  iconProps,
  isLoading,
  disabled,
  colorIndicator,
  buttonStyle,
  buttonColor,
  textProps,
  colorText,
  onPress,
  buttonHeight,
}) => {
  const handlePress = () => {
    onPress?.();
  };
  const styleOpacity = useMemo(() => {
    return {
      opacity: disabled ? 0.5 : 1,
      backgroundColor:
        theme === 'dark' ? 'rgba(255, 255, 255,0.5)' : "'rgba(0, 0, 0,0.5)'",
    };
  }, [disabled, theme]);
  return (
    <TouchableOpacity
      style={[
        styles.buttonColor,
        buttonStyle,
        {height: rHeight(buttonHeight || 40), backgroundColor: buttonColor},
        disabled && styleOpacity,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}>
      {iconName && !isLoading && (
        <Icon
          color={EStyleSheet.value('$colors_white')}
          {...iconProps}
          name={iconName}
          size={rHeight(iconProps?.size || 24)}
        />
      )}
      {text && !isLoading && (
        <Text fontSize={16} color={colorText} weight="Bold" {...textProps}>
          {text}
        </Text>
      )}
      {isLoading && <ActivityIndicator color={colorIndicator} size="small" />}
    </TouchableOpacity>
  );
};

export default withDefaults(Button, defaultProps);

const styles = StyleSheet.create({
  buttonColor: {
    borderRadius: 2,
    backgroundColor: '$colors_secondary',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

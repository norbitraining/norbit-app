import React, {useState} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';

import {fontNormalize, rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';

import Text, {TextCustomProps} from './Text';
import {fontMaker} from 'font';
import {GlobalStyles} from 'theme/globalStyle';

export type InputTheme = 'light' | 'dark';

const HIT_SLOP = {left: 25, right: 20, bottom: 30, top: 30};

export interface InputProps {
  customStyle?: StyleProp<ViewStyle>;
  customLabel?: StyleProp<ViewStyle>;
  theme?: InputTheme;
  textInputProps: TextInputProps;
  iconProps?: IconProps;
  labelProps?: TextCustomProps;
  labelErrorProps?: TextCustomProps;
  label?: string;
  isPassword?: boolean;
  iconName?: string;
  error?: any;
}

const defaultProps: InputProps = {
  iconProps: {name: ''},
  textInputProps: {},
  theme: 'dark',
  labelProps: {fontSize: 14},
  isPassword: false,
};

const TextInputComponent: React.FC<InputProps> = ({
  textInputProps,
  labelProps,
  labelErrorProps,
  isPassword,
  theme,
  label,
  error,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const onPressShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View
      style={[
        styles.containerInput,
        textInputProps.editable === false && styles.disabled,
      ]}>
      <View style={styles.contentLabel}>
        <Text
          weight="Medium"
          color={EStyleSheet.value(
            theme === 'light' ? '$colors_dark' : '$colors_white',
          )}
          fontSize={labelProps?.fontSize || 14}>
          {label}
        </Text>
      </View>
      <View
        style={[
          theme === 'light' ? styles.contentInputDark : styles.contentInput,
          GlobalStyles.row,
        ]}>
        <TextInput
          placeholderTextColor={
            theme === 'light'
              ? 'rgba(0,0,0,0.5)'
              : EStyleSheet.value('$colors_gray')
          }
          autoCapitalize="none"
          {...textInputProps}
          secureTextEntry={isPassword && !showPassword}
          style={[
            theme === 'light' ? styles.inputDark : styles.input,
            textInputProps.style,
          ]}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.contentIcon}
            activeOpacity={0.8}
            hitSlop={HIT_SLOP}
            onPress={onPressShowPassword}>
            <Icon
              color={EStyleSheet.value(
                theme === 'light' ? '$colors_dark' : '$colors_white',
              )}
              name={showPassword ? 'eye' : 'eye-off'}
              size={rHeight(16)}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.contentError}>
          <Text
            {...labelErrorProps}
            align="left"
            style={[styles.textError, labelErrorProps?.style]}>
            {error.message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(withDefaults(TextInputComponent, defaultProps));

const inputStyle = {
  height: rHeight(40),
  fontSize: fontNormalize(14),
  flex: 1,
  color: '$colors_white',
  ...fontMaker({weight: 'Regular'}),
} as const;

const contentInputStyle = {
  height: rHeight(40),
  fontSize: fontNormalize(14),
  width: '100%',
  justifyContent: 'center',
  backgroundColor: '$colors_inputColorDark',
  paddingLeft: '5%',
  paddingRight: '3%',
  borderRadius: 5,
} as const;

const styles = StyleSheet.create({
  contentIcon: {paddingRight: 5},
  contentError: {
    marginTop: rHeight(10),
  },
  disabled: {
    opacity: 0.5,
  },
  textError: {
    fontSize: fontNormalize(12),
    color: '$colors_danger',
    marginLeft: 10,
  },
  containerInput: {},
  contentLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rHeight(5),
  },
  label: {
    fontSize: fontNormalize(16),
    color: '$colors_white',
  },
  input: {
    ...inputStyle,
  },
  inputDark: {
    ...inputStyle,
    color: '$colors_dark',
  },
  contentInput: {
    ...contentInputStyle,
  },
  contentInputDark: {
    ...contentInputStyle,
    backgroundColor: '$colors_white',
    borderColor: '#CFD0E2',
    borderWidth: 1,
  },
});

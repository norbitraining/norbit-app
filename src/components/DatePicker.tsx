import React, {useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';

import {fontNormalize, rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';

import Text, {TextCustomProps} from './Text';
import {fontMaker} from 'font';
import {GlobalStyles} from 'theme/globalStyle';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {WithTranslation, withTranslation} from 'react-i18next';

export type InputTheme = 'light' | 'dark';

const HIT_SLOP = {left: 25, right: 20, bottom: 30, top: 30};

export interface PickerProps extends WithTranslation {
  onChangeDate?: (value: string) => void;
  customStyle?: StyleProp<ViewStyle>;
  customLabel?: StyleProp<ViewStyle>;

  labelModal?: string;
  theme?: InputTheme;
  iconProps?: IconProps;
  value?: string;
  placeholder?: string;
  labelProps?: TextCustomProps;
  labelErrorProps?: TextCustomProps;
  label?: string;
  iconName?: string;
  error?: any;
}

const defaultProps: any = {
  iconProps: {name: ''},
  value: '',
  placeholder: '01/01/1998',
  theme: 'dark',
  labelProps: {fontSize: 14},
};

const Picker: React.FC<PickerProps> = ({
  i18n,
  onChangeDate,
  labelProps,
  labelErrorProps,
  value,
  placeholder,
  theme,
  label,
  error,
}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);

  const onPressDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const onPressDateSelection = (date: Date) => {
    onChangeDate?.(moment(date).format('DD/MM/YYYY'));
    onPressDatePicker();
  };

  return (
    <View style={[styles.containerInput]}>
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
        <TouchableOpacity
          style={styles.contentIcon}
          activeOpacity={0.8}
          hitSlop={HIT_SLOP}
          onPress={onPressDatePicker}>
          <View style={GlobalStyles.row}>
            {value ? (
              <Text
                style={GlobalStyles.flex}
                color={
                  theme === 'light'
                    ? EStyleSheet.value('$colors_dark')
                    : EStyleSheet.value('$colors_white')
                }
                fontSize={fontNormalize(14)}>
                {value}
              </Text>
            ) : (
              <Text
                style={GlobalStyles.flex}
                color={
                  theme === 'light'
                    ? EStyleSheet.value('$colors_textOpacity')
                    : EStyleSheet.value('$colors_darkGray')
                }>
                {placeholder}
              </Text>
            )}
            <Icon
              color={EStyleSheet.value('$colors_danger')}
              name={'calendar'}
              size={rHeight(16)}
            />
          </View>
        </TouchableOpacity>
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        themeVariant="dark"
        locale={i18n.language}
        isDarkModeEnabled
        date={value ? moment(value, 'DD/MM/YYYY').toDate() : undefined}
        maximumDate={new Date()}
        onConfirm={onPressDateSelection}
        onCancel={onPressDatePicker}
      />
    </View>
  );
};

export default withTranslation()(withDefaults(Picker, defaultProps));

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
  contentIcon: {...GlobalStyles.flex, paddingRight: 5},
  contentError: {
    marginTop: rHeight(10),
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

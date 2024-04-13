import React, {useMemo, useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';

import {fontNormalize, rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';

import Text, {TextCustomProps} from './Text';
import {fontMaker} from 'font';
import {GlobalStyles} from 'theme/globalStyle';
import PickerModal from '@freakycoder/react-native-picker-modal';
import {WithTranslation, withTranslation} from 'react-i18next';

export type InputTheme = 'light' | 'dark';

type ListType = 'gender';

type TListPicker = {
  [x in ListType]: string[];
};

const HIT_SLOP = {left: 25, right: 20, bottom: 30, top: 30};

export interface PickerProps extends WithTranslation {
  onChangeSelection?: (value: string) => void;
  customStyle?: StyleProp<ViewStyle>;
  customLabel?: StyleProp<ViewStyle>;
  typeList: ListType;
  labelModal?: string;
  theme?: InputTheme;
  iconProps?: IconProps;
  value?: string;
  labelProps?: TextCustomProps;
  labelErrorProps?: TextCustomProps;
  label?: string;
  iconName?: string;
  error?: any;
}

const defaultProps: any = {
  iconProps: {name: ''},
  value: '',
  typeList: 'gender',

  theme: 'dark',
  labelProps: {fontSize: 14},
};

const Picker: React.FC<PickerProps> = ({
  t,
  onChangeSelection,
  labelProps,
  typeList,
  labelErrorProps,
  value,
  theme,
  labelModal,
  label,
  error,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const list: TListPicker = {
    gender: [t('common.female'), t('common.male')],
  };

  const pickerList = list[typeList] || [];

  const onPressShowModal = () => {
    setShowModal(!showModal);
  };

  const onPressItemSelection = (_value: string | number) => {
    const newValue =
      typeList === 'gender'
        ? _value === 'Femenino' || _value === 'Female'
          ? 'F'
          : 'M'
        : _value;
    onChangeSelection?.(newValue as string);
    onPressShowModal();
  };

  const formatValue = useMemo(() => {
    if (typeList !== 'gender') {
      return value;
    }
    if (value === 'F') {
      return t('common.female');
    }
    if (value === 'M') {
      return t('common.male');
    }
    return value;
  }, [t, typeList, value]);

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
          onPress={onPressShowModal}>
          <View style={GlobalStyles.row}>
            <Text
              style={GlobalStyles.flex}
              fontSize={fontNormalize(14)}
              color={
                theme === 'light'
                  ? EStyleSheet.value('$colors_dark')
                  : EStyleSheet.value('$colors_white')
              }>
              {formatValue}
            </Text>
            <Icon
              color={EStyleSheet.value('$colors_danger')}
              name={'chevron-down'}
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
      <PickerModal
        title={labelModal || t('common.genderSelection')}
        isVisible={showModal}
        data={pickerList}
        onPress={onPressItemSelection}
        onCancelPress={onPressShowModal}
        onBackdropPress={onPressShowModal}
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

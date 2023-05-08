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
import {fontNormalize, rHeight, withDefaults} from 'utils';
import {StyleSheet} from 'utils/stylesheet';
import {fontMaker} from 'font';
import {GlobalStyles} from 'theme/globalStyle';
import {IUserRequest} from 'store/reducers/user';
import {margin} from 'theme/spacing';

import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';
import PickerModal from '@freakycoder/react-native-picker-modal';

import Text, {TextCustomProps} from 'components/Text';

export type InputTheme = 'light' | 'dark';

type MeasurementType = 'height' | 'weight';

const heightList = ['ft', 'cm'];
const weightList = ['lb', 'kg'];

const HIT_SLOP = {left: 25, right: 20, bottom: 30, top: 30};

export interface MeasurementTextInputProps {
  onChangeMeasurement?: (
    measurementValue: IUserRequest['weight_measurement'] &
      IUserRequest['height_measurement'],
  ) => void;
  customStyle?: StyleProp<ViewStyle>;
  customLabel?: StyleProp<ViewStyle>;
  measurementType?: MeasurementType;
  measurementValue?: string;
  theme?: InputTheme;
  textInputProps: TextInputProps;
  iconProps?: IconProps;
  labelProps?: TextCustomProps;
  labelErrorProps?: TextCustomProps;
  label?: string;
  iconName?: string;
  error?: any;
}

const defaultProps: MeasurementTextInputProps = {
  iconProps: {name: ''},
  textInputProps: {},
  measurementType: 'weight',
  theme: 'dark',
  labelProps: {fontSize: 14},
};

const MeasurementTextInput: React.FC<MeasurementTextInputProps> = ({
  onChangeMeasurement,
  textInputProps,
  labelProps,
  labelErrorProps,
  measurementType,
  measurementValue,
  theme,
  label,
  error,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const onPressShowModal = () => {
    setShowModal(!showModal);
  };

  const onPressItemSelection = (value: string | number) => {
    const _measurementValue =
      measurementType === 'height'
        ? (value as IUserRequest['height_measurement'])
        : (value as IUserRequest['weight_measurement']);
    onChangeMeasurement?.(
      _measurementValue as IUserRequest['height_measurement'] &
        IUserRequest['weight_measurement'],
    );
    onPressShowModal();
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
        <TextInput
          placeholderTextColor={EStyleSheet.value('$colors_gray')}
          autoCapitalize="none"
          {...textInputProps}
          keyboardType="numeric"
          returnKeyType="done"
          style={[
            theme === 'light' ? styles.inputDark : styles.input,
            textInputProps.style,
          ]}
        />

        <TouchableOpacity
          style={styles.contentIcon}
          activeOpacity={0.8}
          hitSlop={HIT_SLOP}
          onPress={onPressShowModal}>
          <View style={GlobalStyles.row}>
            <Text
              style={margin.mr5}
              fontSize={fontNormalize(14)}
              color={
                theme === 'light'
                  ? EStyleSheet.value('$colors_dark')
                  : EStyleSheet.value('$colors_white')
              }>
              {measurementValue}
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
        title="Selecciona un tipo de medida"
        isVisible={showModal}
        data={measurementType === 'height' ? heightList : weightList}
        onPress={onPressItemSelection}
        onCancelPress={onPressShowModal}
        onBackdropPress={onPressShowModal}
      />
    </View>
  );
};

export default withDefaults(MeasurementTextInput, defaultProps);

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
  contentIcon: {
    paddingRight: 5,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderColor: 'rgba(207, 208, 226, 0.31)',
  },
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

import React, {useMemo, useState} from 'react';
import * as yup from 'yup';
import {View, useColorScheme} from 'react-native';

import {GlobalStyles} from 'theme/globalStyle';

import EStyleSheet from 'react-native-extended-stylesheet';

import Header from 'components/Header';
import {IUserRequest, userActions} from 'store/reducers/user';
import Separator from 'components/Separator';
import {ButtonText, HeaderText, Input, ValidationText} from 'utils/text';
import {Controller, useForm} from 'react-hook-form';
import TextInput from 'components/TextInput';
import {yupResolver} from '@hookform/resolvers/yup';
import {useSelector} from 'store/reducers/rootReducers';
import moment from 'moment';
import {margin, padding} from 'theme/spacing';
import Button from 'components/Button';
import MeasurementTextInput from 'components/MeasurementTextInput';
import Picker from 'components/Picker';
import DatePicker from 'components/DatePicker';

interface ProfileScreenProps {
  updateProfileAction: typeof userActions.updateProfileAction;
}

const schema = yup
  .object({
    first_name: yup.string().required(ValidationText),
    last_name: yup.string().required(),
    email: yup.string().email(),
    birthday: yup.string().required(),
    gender: yup.string().required(),
    height: yup.string().required(),
    weight: yup.string().required(),
    height_measurement: yup.string().required(),
    weight_measurement: yup.string().required(),
  })
  .required();

const ProfileScreen: React.FC<ProfileScreenProps> = ({updateProfileAction}) => {
  const scheme = useColorScheme();

  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const currentUser = useSelector(state => state.user);
  const [heightMeasurement, setHeightMeasurement] = useState<
    IUserRequest['height_measurement']
  >(currentUser.user?.height_measurement);
  const [weightMeasurement, setWeightMeasurement] = useState<
    IUserRequest['weight_measurement']
  >(currentUser.user?.weight_measurement);

  const {
    handleSubmit,
    setValue,
    control,
    formState: {errors, isValid, isDirty},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    values: {
      first_name: currentUser.user?.first_name,
      last_name: currentUser.user?.last_name,
      birthday: currentUser.user?.birthday
        ? moment(currentUser.user?.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY')
        : '',
      email: currentUser.user?.email,
      gender: currentUser.user?.gender ? 'M' : 'F',
      weight: currentUser.user?.weight,
      height: currentUser.user?.height,
      weight_measurement: currentUser.user?.weight_measurement,
      height_measurement: currentUser.user?.height_measurement,
    },
    defaultValues: {},
  });

  const onChangeHeightMeasurement = (
    value: IUserRequest['height_measurement'],
  ) => {
    setValue('height_measurement', value, {shouldDirty: true});
    setHeightMeasurement(value);
  };

  const onChangeWeightMeasurement = (
    value: IUserRequest['weight_measurement'],
  ) => {
    setValue('weight_measurement', value, {shouldDirty: true});
    setWeightMeasurement(value);
  };

  const onSubmit = async () => {
    const values = getValues();

    updateProfileAction({
      ...values,
      gender: values.gender === 'M' ? 0 : 1,
      birthday: moment(values.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    });
  };

  return (
    <View
      style={
        scheme === 'dark' ? GlobalStyles.container : GlobalStyles.containerWhite
      }>
      <Header
        text={HeaderText.editProfile}
        showBackButton={true}
        textColor={EStyleSheet.value(
          isDark ? '$colors_white' : '$colors_black',
        )}
        iconColor={EStyleSheet.value(
          isDark ? '$colors_white' : '$colors_black',
        )}
      />
      <View style={[padding.ph15, GlobalStyles.flex]}>
        <Separator thickness="10%" />
        <View style={GlobalStyles.row}>
          <View style={[GlobalStyles.flex, margin.mr7]}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={Input.firstName}
                  theme={isDark ? 'dark' : 'light'}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '',
                  }}
                  error={errors.first_name}
                />
              )}
              name="first_name"
              rules={{required: true}}
            />
          </View>
          <View style={[GlobalStyles.flex, margin.ml7]}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={Input.lastName}
                  theme={isDark ? 'dark' : 'light'}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '',
                  }}
                  error={errors.last_name}
                />
              )}
              name="last_name"
              rules={{required: true}}
            />
          </View>
        </View>
        <Separator thickness={15} />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label={Input.email}
              theme={isDark ? 'dark' : 'light'}
              textInputProps={{
                onBlur: onBlur,
                editable: false,
                onChangeText: onChange,
                value,
                placeholder: '',
              }}
              error={errors.email}
            />
          )}
          name="email"
          rules={{required: true}}
        />
        <Separator thickness={15} />
        <View style={GlobalStyles.row}>
          <View style={[GlobalStyles.flex, margin.mr7]}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <DatePicker
                  label={Input.birthday}
                  theme={isDark ? 'dark' : 'light'}
                  onChangeDate={onChange}
                  value={value}
                  error={errors.birthday}
                />
              )}
              name="birthday"
              rules={{required: true}}
            />
          </View>
          <View style={[GlobalStyles.flex, margin.ml7]}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <Picker
                  label={Input.gender}
                  theme={isDark ? 'dark' : 'light'}
                  typeList="gender"
                  onChangeSelection={onChange}
                  value={value}
                  error={errors.gender}
                />
              )}
              name="gender"
              rules={{required: true}}
            />
          </View>
        </View>
        <Separator thickness={15} />
        <View style={GlobalStyles.row}>
          <View style={[GlobalStyles.flex, margin.mr7]}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <MeasurementTextInput
                  label={Input.height}
                  theme={isDark ? 'dark' : 'light'}
                  measurementType="height"
                  measurementValue={heightMeasurement}
                  onChangeMeasurement={onChangeHeightMeasurement}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '',
                  }}
                  error={errors.height}
                />
              )}
              name="height"
              rules={{required: true}}
            />
          </View>
          <View style={[GlobalStyles.flex, margin.ml7]}>
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <MeasurementTextInput
                  label={Input.weight}
                  theme={isDark ? 'dark' : 'light'}
                  measurementType="weight"
                  measurementValue={weightMeasurement}
                  onChangeMeasurement={onChangeWeightMeasurement}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '',
                  }}
                  error={errors.weight}
                />
              )}
              name="weight"
              rules={{required: true}}
            />
          </View>
        </View>
      </View>
      <Separator thickness="7%" />
      <View style={padding.ph15}>
        <Button
          isLoading={currentUser.isLoading}
          text={ButtonText.saveChanges}
          theme={scheme || 'light'}
          onPress={handleSubmit(onSubmit)}
          colorText={EStyleSheet.value('$colors_white')}
          buttonColor={EStyleSheet.value('$colors_dangerTab')}
          disabled={isValid && !isDirty}
        />
      </View>

      <Separator thickness="3%" />
    </View>
  );
};

export default ProfileScreen;

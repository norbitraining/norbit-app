import React from 'react';
import * as yup from 'yup';

import {TouchableOpacity, View} from 'react-native';

import {Background, Common} from 'assets';
import {GlobalStyles} from 'theme/globalStyle';

import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import BackgroundContainer from 'components/BackgroundContainer';
import FastImage from 'react-native-fast-image';
import {rHeight, rWidth, StyleSheet} from 'utils';
import Text from 'components/Text';
import {margin} from 'theme/spacing';
import Separator from 'components/Separator';
import TextInput from 'components/TextInput';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'components/Button';
import {userActions} from 'store/reducers/user';
import {useSelector} from 'store/reducers/rootReducers';
import {Screen, navigationRef} from 'utils/constants/screens';
import {WithTranslation, withTranslation} from 'react-i18next';
import KeyboardAwareScrollView from 'components/KeyboardAwareScrollView';

interface SignInScreenProps extends WithTranslation {
  signInAction: typeof userActions.signInAction;
}

const SignInScreen: React.FC<SignInScreenProps> = ({t, signInAction}) => {
  const currentUser = useSelector(state => state.user);

  const schema = React.useMemo(
    () =>
      yup
        .object({
          email: yup
            .string()
            .email(t('validations.emailMatch') as string)
            .required(t('validations.emailRequired') as string),
          password: yup
            .string()
            .required(t('validations.passwordRequired') as string),
        })
        .required(),
    [t],
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleForgotPassword = () => {
    navigationRef.navigate(Screen.FORGOT_PASSWORD);
  };

  const onSubmit = async () => {
    const values = getValues();
    try {
      signInAction({email: values.email, password: values.password});
    } catch (e) {}
  };
  return (
    <BackgroundContainer source={Background.SIGN_IN}>
      <View style={container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={GlobalStyles.flex}>
          <View style={styles.contentLogo}>
            <View style={GlobalStyles.center}>
              <FastImage
                source={Common.LOGO_LIGHT}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.contentForm}>
            <View>
              <Text fontSize={28} color="white" weight="Light">
                {t('common.signIn')}
              </Text>
              <Text fontSize={16} color="white" weight="Light">
                {t('common.signInSubtitle')}
              </Text>
            </View>
            <Separator thickness={20} />
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={t('input.email') as string}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: 'ex@outlook.com',
                    keyboardType: 'email-address',
                  }}
                  error={errors.email}
                />
              )}
              name="email"
              rules={{required: true}}
            />
            <Separator thickness={15} />
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={t('input.password') as string}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '*********',
                    secureTextEntry: true,
                  }}
                  isPassword
                  error={errors.password}
                />
              )}
              name="password"
              rules={{required: true}}
            />
          </View>
          <View style={styles.contentButtonAuthForm}>
            <TouchableOpacity
              onPress={handleForgotPassword}
              hitSlop={{left: 40, top: 10, bottom: 20}}>
              <Text
                fontSize={14}
                weight="Light"
                color={EStyleSheet.value('$colors_white')}>
                {t('input.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          <Separator thickness={rWidth(40)} />
          <View style={styles.contentButton}>
            <Button
              text={t('button.signIn') as string}
              onPress={handleSubmit(onSubmit)}
              textProps={{
                fontSize: rHeight(14),
                weight: 'Medium',
                color: 'white',
              }}
              buttonColor="#CC392A"
              isLoading={currentUser.isLoading}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </BackgroundContainer>
  );
};

export default withTranslation()(SignInScreen);

const styles = StyleSheet.create({
  logo: {width: rWidth(200), height: rWidth(50)},
  contentLogo: {flexGrow: 0.4, justifyContent: 'flex-end'},
  contentButtonAuthForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 15,
    zIndex: 100,
  },
  contentForm: {flexGrow: 0.35, justifyContent: 'flex-end'},
  containerCenter: {
    justifyContent: 'center',
  },
  contentButton: {flex: 0.15, justifyContent: 'center'},
});

const container = [GlobalStyles.flexible, margin.mh15];

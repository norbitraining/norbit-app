import React from 'react';
import * as yup from 'yup';

import {KeyboardAvoidingView, TouchableOpacity, View} from 'react-native';

import {Background, Common} from 'assets';
import {GlobalStyles} from 'theme/globalStyle';

import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import BackgroundContainer from 'components/BackgroundContainer';
import FastImage from 'react-native-fast-image';
import {isAndroid, rHeight, rWidth, StyleSheet} from 'utils';
import Text from 'components/Text';
import {Input, Label, ButtonText, ValidationText} from 'utils/text';
import {margin} from 'theme/spacing';
import Separator from 'components/Separator';
import TextInput from 'components/TextInput';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'components/Button';
import {userActions} from 'store/reducers/user';
import {useSelector} from 'store/reducers/rootReducers';
import {navigationRef, Screen} from 'router/Router';

const BEHAVIOR = isAndroid ? undefined : 'padding';

interface SignInScreenProps {
  signInAction: typeof userActions.signInAction;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email(ValidationText.emailMatch)
      .required(ValidationText.emailRequired),
    password: yup.string().required(ValidationText.passwordRequired),
  })
  .required();

const SignInScreen: React.FC<SignInScreenProps> = ({signInAction}) => {
  const currentUser = useSelector(state => state.user);
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
      email: 'egarciaT@norbitraining.com',
      password: 'Ernesto1.',
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
        <KeyboardAvoidingView
          style={GlobalStyles.flexible}
          behavior={BEHAVIOR}
          keyboardVerticalOffset={15}>
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
                {Label.signIn}
              </Text>
              <Text fontSize={16} color="white" weight="Light">
                {Label.signInSubtitle}
              </Text>
            </View>
            <Separator thickness={20} />
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={Input.email}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: 'ex@outlook.com',
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
                  label={Input.password}
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
            <View style={styles.contentButtonAuthForm}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text
                  fontSize={14}
                  weight="Light"
                  color={EStyleSheet.value('$colors_white')}>
                  {Input.forgotPassword}
                </Text>
              </TouchableOpacity>
            </View>
            <Separator thickness="10%" />
          </View>
        </KeyboardAvoidingView>
        <View style={styles.contentButton}>
          <Button
            text={ButtonText.signIn}
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
      </View>
    </BackgroundContainer>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  logo: {width: rWidth(200), height: rWidth(50)},
  contentLogo: {flex: 0.35, justifyContent: 'flex-end'},
  contentButtonAuthForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  contentForm: {flex: 0.65, justifyContent: 'flex-end'},
  containerCenter: {
    justifyContent: 'center',
  },
  contentButton: {flex: 0.15, justifyContent: 'center'},
});

const container = [GlobalStyles.flexible, margin.mh15];

import React from 'react';
import * as yup from 'yup';

import {KeyboardAvoidingView, View} from 'react-native';

import {Background} from 'assets';
import {GlobalStyles} from 'theme/globalStyle';

import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import BackgroundContainer from 'components/BackgroundContainer';
import {isAndroid, rHeight, rWidth, StyleSheet} from 'utils';
import Text from 'components/Text';
import {margin, padding} from 'theme/spacing';
import Separator from 'components/Separator';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import {userActions} from 'store/reducers/user';
import {useSelector} from 'store/reducers/rootReducers';
import {Svg} from 'assets/svg';
import Header from 'components/Header';
import {WithTranslation, withTranslation} from 'react-i18next';

const BEHAVIOR = isAndroid ? undefined : 'padding';

interface ForgotPasswordProps extends WithTranslation {
  forgotPasswordAction: typeof userActions.forgotPasswordAction;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({
  t,
  forgotPasswordAction,
}) => {
  const currentUser = useSelector(state => state.user);

  const schema = React.useMemo(
    () =>
      yup
        .object({
          email: yup
            .string()
            .email(t('validations.emailMatch') as string)
            .required(t('validations.emailRequired') as string),
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
    },
  });

  const onSubmit = async () => {
    const values = getValues();
    try {
      forgotPasswordAction({email: values.email});
    } catch (e) {}
  };
  return (
    <BackgroundContainer source={Background.FORGOT_PASSWORD}>
      <View style={container}>
        <Header />
        <KeyboardAvoidingView
          style={GlobalStyles.flexible}
          behavior={BEHAVIOR}
          keyboardVerticalOffset={15}>
          <View style={styles.contentForm}>
            <View style={GlobalStyles.center}>
              <Svg.ForgotPasswordSvg
                fill="white"
                width={rWidth(45)}
                height={rWidth(45)}
              />
              <Separator thickness={15} />
            </View>
            <View>
              <Text fontSize={24} color="white" weight="Medium" align="center">
                {t('common.forgotPassword')}
              </Text>

              <Separator thickness={15} />
              <Text fontSize={16} color="white" weight="Light" align="center">
                {t('common.forgotPasswordSubtitle')}
              </Text>
            </View>
            <Separator thickness="8%" />
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
                  }}
                  error={errors.email}
                />
              )}
              name="email"
              rules={{required: true}}
            />
            <Separator thickness="5%" />

            <View style={padding.ph10}>
              <Button
                text={t('button.forgotPassword') as string}
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
        </KeyboardAvoidingView>
      </View>
    </BackgroundContainer>
  );
};

export default withTranslation()(ForgotPasswordScreen);

const styles = StyleSheet.create({
  logo: {width: rWidth(200), height: rWidth(50)},
  contentLogo: {flex: 0.35, justifyContent: 'flex-end'},
  contentButtonAuthForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  contentForm: {flex: 1, justifyContent: 'center'},
  containerCenter: {
    justifyContent: 'center',
  },
  contentButton: {flex: 0.15, justifyContent: 'center'},
});

const container = [GlobalStyles.flexible, margin.mh15];

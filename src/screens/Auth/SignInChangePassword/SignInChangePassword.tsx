import React, {useCallback} from 'react';
import * as yup from 'yup';

import {KeyboardAvoidingView, View, Keyboard} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {GlobalStyles} from 'theme/globalStyle';
import {isAndroid, rHeight, rWidth, StyleSheet} from 'utils';
import {padding} from 'theme/spacing';
import {userActions} from 'store/reducers/user';
import {useSelector} from 'store/reducers/rootReducers';

import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';
import Separator from 'components/Separator';
import TextInput from 'components/TextInput';
import Text from 'components/Text';
import Button from 'components/Button';
import {Svg} from 'assets/svg';
import {WithTranslation, withTranslation} from 'react-i18next';

const BEHAVIOR = isAndroid ? undefined : 'padding';

interface SignInChangePasswordScreenProps extends WithTranslation {
  changePasswordAuthenticatedAction: typeof userActions.changePasswordAuthenticatedAction;
}

interface TextRule {
  label: string;
  regex: RegExp;
}

const textRules = (t: any): TextRule[] => [
  {
    label: t('rules.required'),
    regex: /\S/,
  },
  {
    label: t('rules.minCharacter'),
    regex: /.{8,}$/,
  },
  {
    label: t('rules.latterUppercase'),
    regex: /[A-Z]/,
  },
  {
    label: t('rules.latterLowercase'),
    regex: /[a-z]/,
  },
  {
    label: t('rules.specialCharacter'),
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])/,
  },
];

const SignInChangePasswordScreen: React.FC<SignInChangePasswordScreenProps> = ({
  t,
  changePasswordAuthenticatedAction,
}) => {
  const currentUser = useSelector(state => state.user);

  const schema = React.useMemo(
    () =>
      yup
        .object({
          password: yup
            .string()
            .required()
            .min(8)
            .matches(/[A-Z]/)
            .matches(/[a-z]/)
            .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])/),
          confirmPassword: yup
            .string()
            .required(t('validations.verifyPasswordRequired') as string)
            .oneOf(
              [yup.ref('password')],
              t('validations.verifyPasswordNotEqual') as string,
            ),
        })
        .required(),
    [t],
  );

  const textRuleList = React.useMemo(() => textRules(t), [t]);

  const {
    handleSubmit,
    control,
    formState: {errors, isSubmitted},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = () => {
    try {
      const values = getValues();
      changePasswordAuthenticatedAction({password: values.password});
    } catch (e) {}
  };

  const TextRule = useCallback(
    (rule: TextRule, index: number) => {
      const password = getValues().password;
      const isError = !rule.regex.test(password);
      return (
        <View key={index} style={[GlobalStyles.row, styles.itemRule]}>
          {isSubmitted && (
            <Icon
              name={isError ? 'x-circle' : 'check-circle'}
              color={EStyleSheet.value(
                isError ? '$colors_danger' : '$colors_success',
              )}
              style={styles.iconRule}
              size={14}
            />
          )}
          <Text
            fontSize={12}
            align="left"
            color="white"
            style={styles.textRules}>
            {rule.label}
          </Text>
        </View>
      );
    },
    [getValues, isSubmitted],
  );

  const onEndCapture = () => {
    if (!Keyboard.isVisible()) {
      return;
    }
    Keyboard.dismiss();
  };

  return (
    <View style={container} onTouchEndCapture={onEndCapture}>
      <KeyboardAvoidingView
        style={GlobalStyles.flexible}
        behavior={BEHAVIOR}
        keyboardVerticalOffset={50}>
        <View style={styles.contentTitle}>
          <View>
            <View style={GlobalStyles.center}>
              <Svg.PasswordSvg width={rWidth(50)} height={rWidth(50)} />
              <Separator thickness={24} />
            </View>
            <Text color="white" fontSize={24} weight="Medium" align="center">
              {t('common.hello')} {currentUser.user?.first_name}!
            </Text>
            <Text color="white" fontSize={24} weight="Medium" align="center">
              {t('common.welcomeTo')} NORBIT
            </Text>
            <Separator thickness={18} />
            <Text color="white" fontSize={16} weight="Light" align="center">
              {t('common.beforeStart')}
            </Text>
          </View>
        </View>
        <View style={styles.contentForm}>
          <Separator thickness={25} />
          <View style={styles.contentInputs}>
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
                />
              )}
              name="password"
              rules={{required: true}}
            />
            <Separator thickness={15} />
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label={t('input.confirmPassword') as string}
                  textInputProps={{
                    onBlur: onBlur,
                    onChangeText: onChange,
                    value,
                    placeholder: '*********',
                    secureTextEntry: true,
                  }}
                  isPassword
                  error={errors.confirmPassword}
                />
              )}
              name="confirmPassword"
              rules={{required: true}}
            />
          </View>
          <Separator thickness={15} />
          <View style={styles.contentRules}>{textRuleList.map(TextRule)}</View>
          <Separator thickness={15} />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.contentButton}>
        <Button
          text={t('button.startTraining') as string}
          onPress={handleSubmit(onSubmit)}
          textProps={{
            fontSize: rHeight(14),
            weight: 'Medium',
            color: 'white',
            style: {textTransform: 'uppercase'},
          }}
          buttonColor="#27B124"
          isLoading={currentUser.isLoading}
        />
      </View>
    </View>
  );
};

export default withTranslation()(SignInChangePasswordScreen);

const styles = StyleSheet.create({
  logo: {width: rWidth(200), height: rWidth(50)},
  textRules: {flex: 1},
  contentTitle: {flex: 0.45, justifyContent: 'center', zIndex: -1},
  contentLogo: {
    flex: 0.35,
    justifyContent: 'flex-end',
  },
  contentButtonAuthForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  contentInputs: {
    backgroundColor: '$colors_dark',
  },
  contentForm: {
    flex: 0.55,
    justifyContent: 'flex-end',
    zIndex: 1,
    backgroundColor: '$colors_dark',
  },
  containerCenter: {
    justifyContent: 'center',
  },
  iconRule: {marginRight: 7},
  itemRule: {marginVertical: 3},
  contentButton: {flex: 0.15, justifyContent: 'center'},
  contentRules: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#393939',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

const container = [GlobalStyles.container, padding.ph15];

import React, {useCallback} from 'react';
import * as yup from 'yup';

import {KeyboardAvoidingView, View, Keyboard} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {GlobalStyles} from 'theme/globalStyle';
import {isAndroid, rHeight, rWidth, StyleSheet} from 'utils';
import {ButtonText, Input, TextRules, ValidationText} from 'utils/text';
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

const BEHAVIOR = isAndroid ? undefined : 'padding';

interface SignInChangePasswordScreenProps {
  changePasswordAuthenticatedAction: typeof userActions.changePasswordAuthenticatedAction;
}

interface TextRule {
  label: string;
  regex: RegExp;
}

const textRuleList: TextRule[] = [
  {
    label: TextRules.required,
    regex: /\S/,
  },
  {
    label: TextRules.minCharacter,
    regex: /.{8,}$/,
  },
  {
    label: TextRules.latterUppercase,
    regex: /[A-Z]/,
  },
  {
    label: TextRules.latterLowercase,
    regex: /[a-z]/,
  },
  {
    label: TextRules.specialCharacter,
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])/,
  },
];

const schema = yup
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
      .required(ValidationText.verifyPasswordRequired)
      .oneOf([yup.ref('password')], ValidationText.verifyPasswordNotEqual),
  })
  .required();

const SignInChangePasswordScreen: React.FC<SignInChangePasswordScreenProps> = ({
  changePasswordAuthenticatedAction,
}) => {
  const currentUser = useSelector(state => state.user);
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
              ¡Hola {currentUser.user?.first_name}!
            </Text>
            <Text color="white" fontSize={24} weight="Medium" align="center">
              Bienvenido a NORBIT
            </Text>
            <Separator thickness={18} />
            <Text color="white" fontSize={16} weight="Light" align="center">
              Antes de entrenar{'\n'}cambia tu contraseña
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
                  label={Input.password}
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
                  label={Input.confirmPassword}
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
          text={ButtonText.startTraining}
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

export default SignInChangePasswordScreen;

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

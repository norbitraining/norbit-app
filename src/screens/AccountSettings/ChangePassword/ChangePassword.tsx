import React, {useCallback, useMemo} from 'react';
import * as yup from 'yup';

import {
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';
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
import Header from 'components/Header';
import {WithTranslation, withTranslation} from 'react-i18next';

const BEHAVIOR = isAndroid ? undefined : 'padding';

interface ChangePasswordScreenProps extends WithTranslation {
  changePasswordSettingsAction: typeof userActions.changePasswordSettingsAction;
}

interface TextRule {
  label: string;
  regex: RegExp;
}

const textRuleList: TextRule[] = [
  {
    label: 'rules.required',
    regex: /\S/,
  },
  {
    label: 'rules.minCharacter',
    regex: /.{8,}$/,
  },
  {
    label: 'rules.latterUppercase',
    regex: /[A-Z]/,
  },
  {
    label: 'rules.latterLowercase',
    regex: /[a-z]/,
  },
  {
    label: 'rules.specialCharacter',
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])/,
  },
];

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  t,
  changePasswordSettingsAction,
}) => {
  const scheme = useColorScheme();

  const isDark = useMemo(() => scheme === 'dark', [scheme]);

  const containerStyle = [
    isDark ? GlobalStyles.container : GlobalStyles.containerWhite,
  ];

  const schema = React.useMemo(
    () =>
      yup
        .object({
          currentPassword: yup
            .string()
            .required(t('validations.passwordRequired') as string),
          newPassword: yup
            .string()
            .required(t('validations.passwordRequired') as string)
            .min(8)
            .matches(/[A-Z]/)
            .matches(/[a-z]/)
            .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?])/),
          confirmNewPassword: yup
            .string()
            .required(t('validations.verifyPasswordRequired') as string)
            .oneOf(
              [yup.ref('newPassword')],
              t('validations.verifyPasswordNotEqual') as string,
            ),
        })
        .required(),
    [t],
  );

  const currentUser = useSelector(state => state.user);
  const {
    handleSubmit,
    control,
    formState: {errors, isSubmitted, isValid},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = () => {
    try {
      const values = getValues();
      changePasswordSettingsAction({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    } catch (e) {}
  };

  const TextRule = useCallback(
    (rule: TextRule, index: number) => {
      const password = getValues().newPassword;
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
            color={isDark ? 'white' : 'black'}
            style={styles.textRules}>
            {t(rule.label)}
          </Text>
        </View>
      );
    },
    [getValues, isDark, isSubmitted, t],
  );

  return (
    <View style={containerStyle}>
      <Header
        text={t('header.changePassword') as string}
        showBackButton
        textColor={EStyleSheet.value(
          isDark ? '$colors_white' : '$colors_black',
        )}
        iconColor={EStyleSheet.value(
          isDark ? '$colors_white' : '$colors_black',
        )}
      />
      <Separator thickness="3%" />

      <View style={[GlobalStyles.flex, padding.ph20]}>
        <ScrollView contentContainerStyle={padding.pb15}>
          <KeyboardAvoidingView
            style={GlobalStyles.flex}
            behavior={BEHAVIOR}
            keyboardVerticalOffset={50}>
            <View>
              <Separator thickness={20} />
              <View>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      label={t('input.currentPassword') as string}
                      theme={scheme || 'light'}
                      textInputProps={{
                        onBlur: onBlur,
                        onChangeText: onChange,
                        value,
                        placeholder: '*********',
                        secureTextEntry: true,
                      }}
                      isPassword
                      error={errors.currentPassword}
                    />
                  )}
                  name="currentPassword"
                  rules={{required: true}}
                />
                <Separator thickness={15} />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      label={t('input.newPassword') as string}
                      theme={scheme || 'light'}
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
                  name="newPassword"
                  rules={{required: true}}
                />
                <Separator thickness={15} />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      label={t('input.confirmNewPassword') as string}
                      theme={scheme || 'light'}
                      textInputProps={{
                        onBlur: onBlur,
                        onChangeText: onChange,
                        value,
                        placeholder: '*********',
                        secureTextEntry: true,
                      }}
                      isPassword
                      error={errors.confirmNewPassword}
                    />
                  )}
                  name="confirmNewPassword"
                  rules={{required: true}}
                />
              </View>
              <Separator thickness={15} />
              <View style={styles.contentRules}>
                {textRuleList.map(TextRule)}
              </View>
              <Separator thickness={15} />
            </View>
          </KeyboardAvoidingView>

          <View style={styles.contentButton}>
            <Button
              text={t('button.changePassword') as string}
              onPress={handleSubmit(onSubmit)}
              textProps={{
                fontSize: rHeight(14),
                weight: 'Medium',
                color: 'white',
                style: {textTransform: 'uppercase'},
              }}
              theme={scheme || 'light'}
              disabled={!isValid}
              isLoading={currentUser.isLoading}
              buttonColor={EStyleSheet.value('$colors_dangerTab')}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default withTranslation()(ChangePasswordScreen);

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
  contentButton: {flex: 0.15, justifyContent: 'center', marginTop: 15},
  contentRules: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#393939',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Separator from 'components/Separator';
import Text from 'components/Text';

import {View, Linking, useColorScheme} from 'react-native';
import {GlobalStyles} from 'theme/globalStyle';
import {padding} from 'theme/spacing';
import {AppRootParamList} from 'types/*';
import {fontNormalize, rWidth} from 'utils';
import {Screen, navigationRef} from 'utils/constants/screens';
import {StyleSheet} from 'utils/stylesheet';
import {Svg} from 'assets/svg';
import {WithTranslation, withTranslation} from 'react-i18next';

interface UpdateAppScreenProps extends WithTranslation {}

const UpdateAppScreen: React.FC<UpdateAppScreenProps> = ({t}) => {
  const route = useRoute<RouteProp<AppRootParamList, Screen.UPDATE_APP>>();

  const scheme = useColorScheme();
  const isDark = React.useMemo(() => scheme === 'dark', [scheme]);

  const handleUpdateApp = React.useCallback(() => {
    const link = route.params.storeUrl;

    Linking.canOpenURL(link).then(supported => {
      if (!supported) {
        return;
      }
      Linking.openURL(link);
    });
  }, [route.params.storeUrl]);

  const handleSkip = () => {
    navigationRef.goBack();
  };

  return (
    <View
      style={[
        isDark ? GlobalStyles.container : GlobalStyles.containerWhite,
        padding.ph15,
      ]}>
      <View style={GlobalStyles.flex}>
        <Separator thickness={rWidth(25)} />
        <View style={GlobalStyles.center}>
          <Svg.UpdateAppSvg height={rWidth(200)} width={rWidth(250)} />
        </View>
        <View>
          <Separator thickness={rWidth(30)} />
          <Text
            color={
              isDark
                ? StyleSheet.value('$colors_white')
                : StyleSheet.value('$colors_black')
            }
            fontSize={fontNormalize(28)}
            align="center"
            weight="Medium">
            {t('common.newUpdate')}
          </Text>
          <Separator thickness={rWidth(20)} />
          <Text
            color={
              isDark
                ? StyleSheet.value('$colors_whiteOpacity')
                : StyleSheet.value('$colors_dark')
            }
            weight="Light"
            align="center"
            fontSize={fontNormalize(14)}
            lineHeight={fontNormalize(22)}>
            {t('common.newUpdateDescription')}
          </Text>
        </View>
      </View>
      <Button
        text={t('button.update') as string}
        buttonColor={StyleSheet.value('$colors_danger')}
        colorText={StyleSheet.value('$colors_white')}
        onPress={handleUpdateApp}
      />
      <Separator thickness={rWidth(12)} />
      <Button
        text={t('button.skip') as string}
        buttonColor={'transparent'}
        textProps={{weight: 'Light'}}
        colorText={
          isDark
            ? StyleSheet.value('$colors_whiteOpacity')
            : StyleSheet.value('$colors_dark')
        }
        onPress={handleSkip}
      />
      <Separator thickness={rWidth(20)} />
    </View>
  );
};

export default withTranslation()(UpdateAppScreen);

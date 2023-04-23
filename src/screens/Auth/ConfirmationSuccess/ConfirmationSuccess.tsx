import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {RouteProp, useRoute} from '@react-navigation/native';

import {AppRootParamList} from 'types/*';

import {GlobalStyles} from 'theme/globalStyle';
import {rWidth} from 'utils';

import Text from 'components/Text';
import Button from 'components/Button';

import {navigationRef, Screen} from 'router/Router';
import actions from './actions';
import {Svg} from 'assets/svg';
import Separator from 'components/Separator';

const ConfirmationSuccess = () => {
  const route =
    useRoute<RouteProp<AppRootParamList, Screen.CONFIRMATION_SUCCESS>>();

  const caseAction = useMemo(() => actions({type: route.params.type}), [route]);

  const onSubmit = () => {
    if (!caseAction?.screenToNavigate) {
      return;
    }
    navigationRef.reset({
      index: 0,
      routes: [{name: caseAction.screenToNavigate}],
    });
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.contentInfo}>
        <View>
          <View style={GlobalStyles.center}>
            <Svg.SuccessSvg width={rWidth(100)} height={rWidth(100)} />
          </View>
          <Separator thickness={25} />
          <Text
            fontSize={24}
            color={EStyleSheet.value('$colors_white')}
            align="center"
            weight="Medium">
            {caseAction?.title}
          </Text>
        </View>

        <Separator thickness="10%" />
        <View style={styles.contentMessage}>
          <Text color="white" align="left" weight="Light" fontSize={16}>
            {caseAction?.description}
          </Text>
        </View>
      </View>
      <View style={styles.contentForm}>
        <Button
          textProps={{
            weight: 'Bold',
            fontSize: 14,
            color: 'white',
            style: {textTransform: 'uppercase'},
          }}
          text={caseAction?.buttonText}
          colorText={EStyleSheet.value('$colors_black')}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

export default ConfirmationSuccess;

const styles = StyleSheet.create({
  contentInfo: {flex: 1, justifyContent: 'center'},
  contentForm: {paddingHorizontal: 15, flex: 0.1},
  contentMessage: {paddingHorizontal: '8%', marginBottom: '25%'},
});

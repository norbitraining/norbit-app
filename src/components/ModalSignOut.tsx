import {Svg} from 'assets/svg';
import React, {memo, useMemo} from 'react';
import {View, Modal, useColorScheme} from 'react-native';

import {StyleSheet} from 'utils/stylesheet';
import Text from './Text';
import Button from './Button';
import EStyleSheet from 'react-native-extended-stylesheet';
import {GlobalStyles} from 'theme/globalStyle';
import Separator from './Separator';
import {useDispatch} from 'react-redux';
import {userActions} from 'store/reducers/user';

export interface ModalSignOutProps {
  visible: boolean;
  onCloseModal?: () => void;
}

const ModalSignOut: React.FC<ModalSignOutProps> = ({
  visible,
  onCloseModal,
}): React.ReactElement => {
  const scheme = useColorScheme();
  const isDark = useMemo(() => scheme === 'dark', [scheme]);
  const dispatch = useDispatch();
  const onCloseSession = () => {
    dispatch(userActions.setLogoutUser());
    onCloseModal?.();
  };
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCloseModal}>
      <View style={styles.centeredView}>
        <View style={isDark ? styles.modalViewDark : styles.modalView}>
          <View>
            <Svg.SadSvg />
          </View>

          <Separator thickness={15} />
          <Text
            weight="SemiBold"
            fontSize={18}
            color={EStyleSheet.value(
              isDark ? '$colors_white' : '$colors_dark',
            )}>
            Oh no! Ya te vas...{'\n'}¿Quieres cerrar sesión?
          </Text>
          <Separator thickness={10} />
          <Text fontSize={16} color={isDark ? '#A6A6A6' : '#686868'}>
            ¿Está seguro de que desea cerrar sesión en su cuenta de momento?
          </Text>
          <Separator thickness={55} />
          <View style={GlobalStyles.row}>
            <Button
              buttonStyle={GlobalStyles.flex}
              text="Cerrar Sesión"
              textProps={{
                weight: 'Regular',
              }}
              onPress={onCloseSession}
              buttonColor="transparent"
              colorText={EStyleSheet.value('$colors_dangerTab')}
            />
            <Button
              text="Cancelar"
              textProps={{
                weight: 'Regular',
              }}
              onPress={onCloseModal}
              colorText={EStyleSheet.value('$colors_white')}
              buttonStyle={GlobalStyles.flex}
              buttonColor={EStyleSheet.value('$colors_dangerTab')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ModalSignOut);

const modalView = {
  zIndex: 1,
  margin: 20,
  backgroundColor: '#0F1214',
  borderRadius: 10,
  paddingTop: 20,
  paddingVertical: 15,
  paddingHorizontal: 20,
  width: '90%',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  marginBottom: '10%',
} as const;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    zIndex: -1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalView: {
    ...modalView,
    backgroundColor: '$colors_white',
  },

  modalViewDark: {
    ...modalView,
  },
});

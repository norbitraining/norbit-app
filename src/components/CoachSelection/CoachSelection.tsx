import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import {WithTranslation, withTranslation} from 'react-i18next';

import FastImage from 'react-native-fast-image';
import BottomSheetCoachList from './BottomSheetCoachList';

import Text from 'components/Text';

import {StyleSheet, getInitials} from 'utils';
import {useSelector} from 'store/reducers/rootReducers';
import {GlobalStyles} from 'theme/globalStyle';
import {margin} from 'theme/spacing';

interface CoachSelectionProps extends WithTranslation {}

const CoachSelection: React.FC<CoachSelectionProps> = React.memo(({t}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const currentCoachSelected = useSelector(x => x.coaches.coachSelected);
  const currentCoachList = useSelector(x => x.coaches.coaches);

  const fullName = React.useMemo(
    () =>
      `${currentCoachSelected?.coach.firstName} ${currentCoachSelected?.coach.lastName}`,
    [currentCoachSelected],
  );

  const profilePicture = React.useMemo(() => {
    if (!currentCoachSelected?.coach.profile_picture_blob) {
      return null;
    }
    return currentCoachSelected?.coach.profile_picture_blob;
  }, [currentCoachSelected?.coach.profile_picture_blob]);

  const closeModal = React.useCallback(() => {
    setShowModal(false);
  }, []);

  const onPress = React.useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <>
      <TouchableOpacity
        disabled={!currentCoachSelected || currentCoachList.length < 2}
        activeOpacity={0.8}
        style={styles.container}
        onPress={onPress}>
        {currentCoachSelected && (
          <>
            <View>
              <Text color="white" fontSize={12}>
                {currentCoachSelected?.coach.gender === '1'
                  ? t('common.coachMale')
                  : t('common.coachFemale')}
              </Text>
              <Text color="white" fontSize={12} weight="Light">
                {fullName}
              </Text>
            </View>
            <View style={styles.initials}>
              {profilePicture ? (
                <FastImage
                  source={{uri: profilePicture}}
                  style={styles.profilePicture}
                  resizeMode="contain"
                />
              ) : (
                <Text color="white" fontSize={12}>
                  {getInitials(fullName)}
                </Text>
              )}
            </View>
          </>
        )}
        {!currentCoachSelected && (
          <Text color={EStyleSheet.value('$colors_dangerTab')} fontSize={12}>
            {t('common.withoutCoach')}
          </Text>
        )}
      </TouchableOpacity>
      <BottomSheetCoachList openModal={showModal} onCloseModal={closeModal} />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  initials: {
    ...GlobalStyles.center,
    ...margin.ml7,
    backgroundColor: '$colors_black',
    borderRadius: 100,
    height: 28,
    width: 28,
  },
  profilePicture: {
    borderRadius: 100,
    height: 28,
    width: 28,
  },
});

export default withTranslation()(CoachSelection);

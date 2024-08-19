import React from 'react';
import {useColorScheme, View} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';

import {StyleSheet, fontNormalize, getInitials, rWidth} from 'utils';
import {GlobalStyles} from 'theme/globalStyle';
import {margin, padding} from 'theme/spacing';

import {useDispatch} from 'react-redux';
import {useSelector} from 'store/reducers/rootReducers';
import Text from 'components/Text';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import {ICoachesRequest, coachesActions} from 'store/reducers/coaches';
import Separator from 'components/Separator';
import EStyleSheet from 'react-native-extended-stylesheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {trigger} from 'react-native-haptic-feedback';
import {planningActions} from 'store/reducers/planning';
import {WithTranslation, withTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

interface CoachListItemProps {
  itemCoach: ICoachesRequest;
  index: number | string;
  onPressBackdrop: () => void;
}

interface BottomSheetCoachListProps extends WithTranslation {
  openModal: boolean;
  onCloseModal: () => void;
}

export default withTranslation()(
  React.memo<BottomSheetCoachListProps>(function BottomSheetCoachList({
    t,
    openModal,
    onCloseModal,
  }) {
    const schema = useColorScheme();
    const [keyboardHeight] = useKeyboardHeight();

    const currentCoaches = useSelector(x => x.coaches);

    const coachList = React.useMemo(
      () => [
        ...(currentCoaches.coachSelected
          ? currentCoaches.coaches.filter(
              x => x.id !== currentCoaches.coachSelected?.id,
            )
          : currentCoaches.coaches),
      ],
      [currentCoaches],
    );

    const animatedIndex = useSharedValue(0);

    const isDark = React.useMemo(() => schema === 'dark', [schema]);

    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

    const handleOpenModal = React.useCallback(() => {
      animatedIndex.value = withTiming(0);
      bottomSheetModalRef.current?.present();
    }, [animatedIndex]);

    const handleCloseModal = () => {
      bottomSheetModalRef.current?.close();
    };

    const handleOnDismiss = React.useCallback(() => {
      onCloseModal();
      handleCloseModal();
    }, [onCloseModal]);

    const onPressBackdrop = React.useCallback(() => {
      animatedIndex.value = withTiming(-1);
      handleOnDismiss();
    }, [animatedIndex, handleOnDismiss]);

    React.useEffect(() => {
      if (!openModal) {
        return;
      }
      handleOpenModal();
    }, [handleOpenModal, openModal]);

    const renderBackdrop = React.useCallback(
      (propsBd: any) => (
        <BottomSheetBackdrop
          {...propsBd}
          animatedIndex={animatedIndex}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          onPress={onPressBackdrop}
        />
      ),
      [animatedIndex, onPressBackdrop],
    );

    return (
      <>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.handleIndicatorStyle}
          animateOnMount
          enableDynamicSizing
          enablePanDownToClose
          contentHeight={keyboardHeight}
          handleStyle={styles.handleStyle}
          onDismiss={handleOnDismiss}
          backgroundStyle={
            isDark
              ? styles.bottomSheetContainerDark
              : styles.bottomSheetContainer
          }>
          <BottomSheetView>
            <View style={styles.contentContainer}>
              <View style={GlobalStyles.row}>
                <Text
                  fontSize={fontNormalize(20)}
                  weight="Medium"
                  color={schema === 'dark' ? 'white' : 'black'}>
                  {t('common.coaches')}
                </Text>
              </View>
              <Separator thickness={12} />
              {currentCoaches.coachSelected && (
                <CoachListItem
                  itemCoach={currentCoaches.coachSelected}
                  index={'crr'}
                  onPressBackdrop={onPressBackdrop}
                />
              )}

              {coachList.map((item, index) => (
                <CoachListItem
                  key={index}
                  itemCoach={item}
                  index={index}
                  onPressBackdrop={onPressBackdrop}
                />
              ))}
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  }),
);

const CoachListItem: React.FC<CoachListItemProps> = ({
  itemCoach,
  index,
  onPressBackdrop,
}) => {
  const dispatch = useDispatch();
  const schema = useColorScheme();
  const currentCoaches = useSelector(x => x.coaches);

  const coachList = React.useMemo(
    () => [
      ...(currentCoaches.coachSelected
        ? currentCoaches.coaches.filter(
            x => x.id !== currentCoaches.coachSelected?.id,
          )
        : currentCoaches.coaches),
    ],
    [currentCoaches],
  );

  const profilePicture = React.useMemo(() => {
    if (!itemCoach?.coach.profile_picture_blob) {
      return null;
    }
    return itemCoach?.coach.profile_picture_blob;
  }, [itemCoach?.coach.profile_picture_blob]);

  const fullName = `${itemCoach.coach?.firstName} ${itemCoach.coach?.lastName}`;
  const isSelected = index === 'crr';

  const onPress = () => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onPressBackdrop();
    dispatch(coachesActions.selectCoachAction(itemCoach));
    dispatch(planningActions.getPlanningSuccessAction([]));
  };

  const itemCoachStyle = {
    ...(schema === 'dark' ? styles.itemCoachDark : styles.itemCoach),
    borderBottomWidth:
      (typeof index === 'number' &&
        coachList &&
        index !== coachList.length - 1) ||
      typeof index === 'string'
        ? 1
        : 0,
  };

  return (
    <TouchableOpacity
      key={index}
      activeOpacity={0.9}
      disabled={isSelected}
      style={itemCoachStyle}
      onPress={onPress}>
      <View style={GlobalStyles.row}>
        <View style={styles.initials}>
          {profilePicture ? (
            <FastImage
              source={{uri: profilePicture}}
              resizeMode="contain"
              style={styles.profilePicture}
            />
          ) : (
            <Text color="white">{getInitials(fullName)}</Text>
          )}
        </View>
        <Text
          style={margin.ml12}
          color={
            isSelected
              ? EStyleSheet.value('$colors_danger')
              : EStyleSheet.value(
                  schema === 'dark' ? '$colors_white' : '$colors_primary',
                )
          }>
          {fullName}
        </Text>
      </View>
      {index === 'crr' && (
        <View style={styles.iconSelected}>
          <Icon name="check" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const itemCoachDefault = {
  ...GlobalStyles.rowSb,
  ...padding.pv10,
  borderBottomColor: 'rgba(0,0,0,0.1)',
  borderBottomWidth: 0,
} as const;

const styles = StyleSheet.create({
  bottomSheetContainer: {backgroundColor: 'white'},
  bottomSheetContainerDark: {backgroundColor: '#0F1214'},
  contentContainer: {
    ...padding.ph20,
    ...padding.pb18,
  },
  iconSelected: {
    ...GlobalStyles.center,
    borderRadius: 100,
    height: rWidth(20),
    width: rWidth(20),
    backgroundColor: '$colors_danger',
  },
  initials: {
    ...GlobalStyles.center,
    borderRadius: 100,
    height: rWidth(33),
    width: rWidth(33),
    backgroundColor: '$colors_inputColorDark',
  },
  itemCoach: itemCoachDefault,
  itemCoachDark: {
    ...itemCoachDefault,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  profilePicture: {
    borderRadius: 100,
    height: rWidth(33),
    width: rWidth(33),
  },
});

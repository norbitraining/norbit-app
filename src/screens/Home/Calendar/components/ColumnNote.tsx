import React from 'react';
import {
  useColorScheme,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';

import {StyleSheet, fontNormalize, rWidth} from 'utils';
import {GlobalStyles} from 'theme/globalStyle';
import {margin, padding} from 'theme/spacing';
import {
  PlanningColumn,
  getRecordByPlanningColumn,
  planningActions,
} from 'store/reducers/planning';
import {useDispatch} from 'react-redux';
import {useSelector} from 'store/reducers/rootReducers';
import Text from 'components/Text';
import {Svg} from 'assets/svg';
import {trigger} from 'react-native-haptic-feedback';
import ContainerMessage from './ContainerMessage';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import EStyleSheet from 'react-native-extended-stylesheet';
import {WithTranslation, withTranslation} from 'react-i18next';

interface ColumnNoteProps extends WithTranslation {
  column: PlanningColumn;
  planningId: number;
}

export default withTranslation()(
  React.memo<ColumnNoteProps>(function ColumnNote({t, column, planningId}) {
    const dispatch = useDispatch();
    const schema = useColorScheme();
    const [keyboardHeight] = useKeyboardHeight();

    const isLoadingRecord = useSelector(x => x.planning.isLoadingRecord);

    const handleRecordByPlanningColumn = React.useMemo(
      () => getRecordByPlanningColumn(planningId, column.id),
      [column.id, planningId],
    );
    const records = useSelector(handleRecordByPlanningColumn);
    const record = React.useMemo(() => records?.[0] || null, [records]);

    const animatedIndex = useSharedValue(0);

    const sendingRequest = React.useRef<boolean>(false);

    const isDark = React.useMemo(() => schema === 'dark', [schema]);

    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

    const handleSaveNote = React.useCallback(
      (value: string) => {
        sendingRequest.current = true;
        dispatch(
          (record?.id
            ? planningActions.updatePlanningColumnRecordAction
            : planningActions.finishPlanningColumnAction)({
            recordId: record?.id,
            planningId,
            planningColumnId: column.id,
            note: value,
          }),
        );
      },
      [column.id, dispatch, planningId, record],
    );

    const handleOpenModal = () => {
      animatedIndex.value = withTiming(0);
      bottomSheetModalRef.current?.present();
    };

    const handleCloseModal = () => {
      bottomSheetModalRef.current?.close();
    };

    const handleOnDismiss = () => {
      Keyboard.dismiss();
    };

    const handleBlur = () => {
      handleCloseModal();
    };
    const onPressBackdrop = React.useCallback(() => {
      animatedIndex.value = withTiming(-1);
      handleOnDismiss();
    }, [animatedIndex]);

    React.useEffect(() => {
      if (isLoadingRecord || !sendingRequest.current) {
        return;
      }
      onPressBackdrop();
      handleCloseModal();
      sendingRequest.current = false;
    }, [onPressBackdrop, isLoadingRecord]);

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
        <View style={[GlobalStyles.row, margin.mt10]}>
          {record?.note ? (
            <ContainerMessage
              label={t('common.myNote')}
              value={record?.note || ''}
              onPressEdit={handleOpenModal}
            />
          ) : (
            <TouchableOpacity
              onPress={handleOpenModal}
              style={styles.buttonAddNote}
              activeOpacity={0.7}>
              <Icon
                name="edit"
                size={18}
                style={margin.mr10}
                color={
                  schema === 'dark'
                    ? 'white'
                    : EStyleSheet.value('$colors_primary')
                }
              />
              <View>
                <Text
                  fontSize={fontNormalize(16)}
                  color={
                    schema === 'dark'
                      ? 'white'
                      : EStyleSheet.value('$colors_primary')
                  }>
                  {t('button.addNote')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
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
                  {record?.note ? t('button.editNote') : t('button.addNote')}
                </Text>

                <Icon
                  name="edit-2"
                  size={18}
                  style={margin.ml12}
                  color={schema === 'dark' ? 'white' : 'black'}
                />
              </View>

              <FormComponent
                defaultValue={record?.note || ''}
                onBlur={handleBlur}
                onSave={handleSaveNote}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  }),
);

const FormComponent: React.FC<{
  onBlur: () => void;
  onSave: (value: string) => void;
  defaultValue: string;
}> = React.memo(({onBlur, onSave, defaultValue}) => {
  const isLoadingRecord = useSelector(x => x.planning.isLoadingRecord);
  const schema = useColorScheme();
  const isDark = React.useMemo(() => schema === 'dark', [schema]);

  const [value, setValue] = React.useState<string>('');

  const handleSave = () => {
    trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    onSave(value);
  };

  return (
    <View style={[GlobalStyles.rowSb, styles.formContainer]}>
      <View style={GlobalStyles.flex}>
        <BottomSheetTextInput
          autoFocus
          onChangeText={setValue}
          defaultValue={defaultValue}
          onBlur={onBlur}
          textAlignVertical="center"
          style={isDark ? styles.textInputDark : styles.textInput}
          multiline
        />
      </View>
      <TouchableOpacity
        onPress={handleSave}
        style={[margin.ml15, GlobalStyles.center]}>
        {isLoadingRecord ? (
          <View style={styles.contentLoader}>
            <ActivityIndicator color="#E1251B" />
          </View>
        ) : (
          <Svg.SendSvg width={26} height={26} />
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonAddNote: {
    ...margin.mb5,
    ...margin.ml7,
    ...GlobalStyles.center,
    ...GlobalStyles.row,
    height: rWidth(30),
  },
  contentNotes: {
    ...margin.mt10,
    ...padding.p10,
    backgroundColor: '#15191C',
    borderRadius: 5,
  },
  bottomSheetContainer: {backgroundColor: 'white'},
  bottomSheetContainerDark: {backgroundColor: '#0F1214'},
  contentContainer: {
    ...padding.ph20,
    ...padding.pb18,
  },
  contentLoader: {
    height: 26,
    width: 26,
  },
  formContainer: {
    ...margin.mt20,
  },
  textInput: {
    ...padding.pt10,
    ...padding.pb10,
    ...padding.ph12,
    ...GlobalStyles.center,
    minHeight: rWidth(40),
    maxHeight: rWidth(80),
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  textInputDark: {
    ...padding.pt10,
    ...padding.pb10,
    ...padding.ph12,
    ...GlobalStyles.center,
    minHeight: rWidth(40),
    maxHeight: rWidth(80),
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#3D3D3D',
    color: 'white',
  },
});

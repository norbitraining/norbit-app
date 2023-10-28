import React from 'react';
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {StyleSheet, fontNormalize, rWidth} from 'utils';
import {GlobalStyles} from 'theme/globalStyle';
import {margin} from 'theme/spacing';
import {
  PlanningColumn,
  getRecordByPlanningColumn,
  planningActions,
} from 'store/reducers/planning';
import {useDispatch} from 'react-redux';
import {useSelector} from 'store/reducers/rootReducers';
import EStyleSheet from 'react-native-extended-stylesheet';

interface ButtonCheck {
  column: PlanningColumn;
  onFinishColumn: () => void;
  planningId: number;
}

export default React.memo<ButtonCheck>(function ButtonCheck({
  column,
  onFinishColumn,
  planningId,
}) {
  const dispatch = useDispatch();
  const scheme = useColorScheme();

  const isLoadingRecord = useSelector(x => x.planning.isLoadingRecord);

  const handleRecordByPlanningColumn = React.useMemo(
    () => getRecordByPlanningColumn(planningId, column.id),
    [column.id, planningId],
  );
  const records = useSelector(handleRecordByPlanningColumn);
  const record = React.useMemo(() => records?.[0] || null, [records]);

  const refAction = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (isLoadingRecord && refAction.current) {
      return;
    }
    refAction.current = false;
  }, [isLoadingRecord]);

  const handlePressConfirm = React.useCallback(() => {
    refAction.current = true;
    dispatch(
      (record?.id
        ? planningActions.updatePlanningColumnRecordAction
        : planningActions.finishPlanningColumnAction)({
        recordId: record?.id,
        planningId,
        planningColumnId: column.id,
        isFinish: record?.id ? !record.isFinish : true,
      }),
    );
    (!record?.isFinish || !record?.id) && onFinishColumn();
  }, [column.id, dispatch, planningId, record, onFinishColumn]);

  const handlePress = React.useCallback(() => {
    Alert.alert(
      record?.isFinish
        ? `¿Quieres borrar tu registro en "${column.columnName}"?`
        : `¿Finalizaste el bloque "${column.columnName}"?`,
      '',
      [
        {
          onPress: handlePressConfirm,
          text: 'Si',
        },
        {
          text: 'No',
        },
      ],
    );
  }, [column.columnName, handlePressConfirm, record]);

  const buttonStyles = React.useMemo(
    () => [
      record?.isFinish ? styles.buttonChecked : styles.buttonUnChecked,
      scheme === 'dark' && !record?.isFinish && styles.buttonDark,
      scheme === 'dark' && record?.isFinish && styles.buttonCheckedDark,
    ],
    [scheme, record],
  );

  if (isLoadingRecord && refAction.current) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="small"
          color={scheme === 'dark' ? 'white' : 'black'}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={buttonStyles}>
      <Icon
        name="check"
        size={fontNormalize(11)}
        style={margin.mt3}
        color={EStyleSheet.value(
          scheme === 'dark' && !record?.isFinish
            ? '$colors_primary'
            : scheme === 'dark'
            ? '$colors_primary'
            : '$colors_white',
        )}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  buttonDark: {
    backgroundColor: '#4B4B4B',
  },
  loading: {
    width: rWidth(17),
    height: rWidth(17),
  },
  buttonChecked: {
    ...GlobalStyles.center,
    width: rWidth(17),
    height: rWidth(17),
    backgroundColor: '#293442',
    borderRadius: 4,
  },
  buttonCheckedDark: {
    backgroundColor: '#9DB0C6',
  },
  buttonUnChecked: {
    ...GlobalStyles.center,
    width: rWidth(17),
    height: rWidth(17),
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
  },
});

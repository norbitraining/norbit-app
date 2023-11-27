import {PayloadAction} from '@reduxjs/toolkit';
import {
  IPlanning,
  PlanningRecord,
  planningActions,
} from 'store/reducers/planning';
import {all, put, takeLatest} from 'redux-saga/effects';
import PlanningServices from 'services/planning-services';
import {onError, safe} from 'utils/functions-saga';
import {appSelect} from 'store/reducers/rootReducers';
import _ from 'lodash';
import {coachesActions} from 'store/reducers/coaches';

function* getPlanningSaga(
  action: PayloadAction<{
    date: string;
  }>,
) {
  const currentCoachSelected = yield* appSelect(
    state => state.coaches.coachSelected,
  );

  const data: {result: IPlanning[]} = yield PlanningServices.getPlanning(
    action.payload.date,
    currentCoachSelected?.coach.id,
  );
  const planningList = data.result;

  yield put(planningActions.getPlanningSuccessAction(planningList));
  yield put(coachesActions.getCoachesAction());
}

function* finishPlanningColumnSaga(
  action: PayloadAction<{
    planningId: number;
    planningColumnId: number;
    isFinish?: boolean;
    note?: string;
  }>,
) {
  const {result}: {result: {recordId: number}} =
    yield PlanningServices.finishPlanningColumn(action.payload);
  const currentPlanningList = yield* appSelect(
    state => state.planning.planningList,
  );

  const indexPlanning = currentPlanningList.findIndex(
    x => x.id === action.payload.planningId,
  );
  if (indexPlanning === -1) {
    yield put(planningActions.planningColumnRecordSuccessAction());
    return;
  }

  const indexPlanningColumn = currentPlanningList[indexPlanning].data.findIndex(
    x => x.id === action.payload.planningColumnId,
  );

  if (indexPlanningColumn === -1) {
    yield put(planningActions.planningColumnRecordSuccessAction());
    return;
  }

  const record = {
    id: result.recordId,
    isFinish: action.payload?.isFinish,
    note: action.payload?.note,
  };

  yield put(
    planningActions.planningRecordUpdateSuccessAction({
      planningIndex: indexPlanning,
      planningColumnIndex: indexPlanningColumn,
      record,
    }),
  );
}

function* updatePlanningColumnRecordSaga(
  action: PayloadAction<{
    recordId: number;
    planningId: number;
    planningColumnId: number;
    isFinish?: boolean;
    note?: string;
    time?: string;
  }>,
) {
  yield PlanningServices.updatePlanningColumnRecord({
    ...action.payload,
    ...(typeof action.payload.isFinish === 'boolean' &&
      !action.payload.isFinish && {
        note: '',
      }),
  });
  const currentPlanningList = yield* appSelect(
    state => state.planning.planningList,
  );

  const newPlanningList = [...currentPlanningList];

  const planningIndex = newPlanningList.findIndex(
    x => x.id === action.payload.planningId,
  );
  if (planningIndex === -1) {
    yield put(planningActions.planningColumnRecordSuccessAction());
    return;
  }

  const planningColumnIndex = newPlanningList[planningIndex].data.findIndex(
    x => x.id === action.payload.planningColumnId,
  );

  if (planningColumnIndex === -1) {
    yield put(planningActions.planningColumnRecordSuccessAction());
    return;
  }

  const cleanUpdate = _.omitBy(
    {
      isFinish: action.payload.isFinish,
      note: action.payload.note,
      time: action.payload.time,
    },
    _.isNil,
  );

  const record: PlanningRecord = {
    ...(newPlanningList[planningIndex].data[planningColumnIndex].record?.[0] ||
      {}),
    ...cleanUpdate,
  };

  yield put(
    planningActions.planningRecordUpdateSuccessAction({
      planningIndex,
      planningColumnIndex,
      record,
    }),
  );
}

export default all([
  takeLatest(
    planningActions.getPlanningAction.type,
    safe(onError(planningActions.planningFailed), getPlanningSaga),
  ),
  takeLatest(
    planningActions.finishPlanningColumnAction.type,
    safe(onError(planningActions.planningFailed), finishPlanningColumnSaga),
  ),
  takeLatest(
    planningActions.updatePlanningColumnRecordAction.type,
    safe(
      onError(planningActions.planningFailed),
      updatePlanningColumnRecordSaga,
    ),
  ),
]);

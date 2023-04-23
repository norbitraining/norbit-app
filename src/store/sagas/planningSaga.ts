import {PayloadAction} from '@reduxjs/toolkit';
import {IPlanning, planningActions} from 'store/reducers/planning';
import {all, put, takeLatest} from 'redux-saga/effects';
import PlanningServices from 'services/planning-services';
import {onError, safe} from 'utils/functions-saga';

function* getPlanningSaga(
  action: PayloadAction<{
    date: string;
  }>,
) {
  const data: {result: IPlanning[]} = yield PlanningServices.getPlanning(
    action.payload.date,
  );
  const planningList = data.result;

  yield put(planningActions.getPlanningSuccessAction(planningList));
}

export default all([
  takeLatest(
    planningActions.getPlanningAction.type,
    safe(onError(planningActions.planningFailed), getPlanningSaga),
  ),
]);

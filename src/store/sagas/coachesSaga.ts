import {all, put, takeLatest} from 'redux-saga/effects';

import {onError, safe} from 'utils/functions-saga';

import CoachServices from 'services/coach-services';
import {ICoachesRequest, coachesActions} from 'store/reducers/coaches';
import {appSelect} from 'store/reducers/rootReducers';

function* getCoachesSaga() {
  const data: {result: ICoachesRequest[]} = yield CoachServices.getCoaches();

  const currentCoachSelected = yield* appSelect(
    state => state.coaches.coachSelected,
  );

  yield put(coachesActions.getCoachesSuccessAction(data.result));
  if (!data.result.length) {
    return;
  }
  const updateCoachSelected = currentCoachSelected
    ? data.result.find(x => x.id === currentCoachSelected.id) || data.result[0]
    : data.result[0];
  if (
    JSON.stringify(updateCoachSelected) === JSON.stringify(currentCoachSelected)
  ) {
    return;
  }
  yield put(coachesActions.selectCoachAction(updateCoachSelected));
}

export default all([
  takeLatest(
    coachesActions.getCoachesAction.type,
    safe(onError(coachesActions.coachesFailed), getCoachesSaga),
  ),
]);

import {all, call, put, takeLatest} from 'redux-saga/effects';

import {onError, safe} from 'utils/functions-saga';

import CoachServices from 'services/coach-services';
import {ICoachesRequest, coachesActions} from 'store/reducers/coaches';
import {appSelect} from 'store/reducers/rootReducers';

function readBlobAsBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function* getCoachesSaga() {
  const data: {result: ICoachesRequest[]} = yield call(
    CoachServices.getCoaches,
  );

  const currentCoachSelected: ICoachesRequest | null = yield appSelect(
    state => state.coaches.coachSelected,
  );
  const oldCoachList: ICoachesRequest[] = yield appSelect(
    state => state.coaches.coaches,
  );

  const oldCoachMap = new Map(
    oldCoachList.map(coach => [coach.coach.id, coach]),
  );
  const newCoachList: ICoachesRequest[] = [];

  for (const item of data.result) {
    const oldCoach = oldCoachMap.get(item.coach.id);

    const currentCoach = item.coach;

    if (!oldCoach) {
      if (!item.coach?.path_photo) {
        newCoachList.push(item);
        continue;
      }

      const {data: dataBlob} = yield call(
        CoachServices.getCoachProfilePicture,
        currentCoach.id,
        currentCoach.path_photo,
      );

      const base64String: string = yield call(
        readBlobAsBase64,
        dataBlob as Blob,
      );
      newCoachList.push({
        ...item,
        coach: {
          ...item.coach,
          profile_picture_blob: base64String,
        },
      });
      continue;
    }

    const _oldCoach = oldCoach.coach;

    if (
      (_oldCoach.path_photo === currentCoach.path_photo &&
        _oldCoach.profile_picture_blob) ||
      !currentCoach.path_photo
    ) {
      newCoachList.push({
        ...oldCoach,
        ...item,
        coach: {
          ..._oldCoach,
          ...item.coach,
        },
      });
      continue;
    }

    const {data: dataBlob} = yield call(
      CoachServices.getCoachProfilePicture,
      currentCoach.id,
      currentCoach.path_photo,
    );

    const base64String: string = yield call(readBlobAsBase64, dataBlob as Blob);
    newCoachList.push({
      ...oldCoach,
      ...item,
      coach: {
        ...oldCoach.coach,
        ...item.coach,
        profile_picture_blob: base64String,
      },
    });
  }

  yield put(coachesActions.getCoachesSuccessAction(newCoachList));

  if (newCoachList.length === 0) {
    return;
  }

  const updatedCoachSelected = currentCoachSelected
    ? newCoachList.find(x => x.id === currentCoachSelected.id) || data.result[0]
    : newCoachList[0];

  if (
    JSON.stringify(updatedCoachSelected) !==
    JSON.stringify(currentCoachSelected)
  ) {
    yield put(coachesActions.selectCoachAction(updatedCoachSelected));
  }
}

export default all([
  takeLatest(
    coachesActions.getCoachesAction.type,
    safe(onError(coachesActions.coachesFailed), getCoachesSaga),
  ),
]);

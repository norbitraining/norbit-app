import {Middleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'store/reducers/rootReducers';
import {rootSaga} from 'store/sagas/rootSaga';
import {configureStore} from '@reduxjs/toolkit';
import {log} from 'utils';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sagaMiddleware = createSagaMiddleware({
  onError(e) {
    log('saga error', e);
  },
});

let actionsTypeLoggerEnabled = false;
let actionsPayloadLoggerEnabled = false;
const loggerMiddleware: Middleware = _ => next => action => {
  if (actionsTypeLoggerEnabled || actionsPayloadLoggerEnabled) {
    log('----Store logger---');
  }

  if (actionsTypeLoggerEnabled) {
    log(action.type);
  }

  if (actionsPayloadLoggerEnabled) {
    log('---Payload---');
    log(action.payload);
  }

  if (actionsTypeLoggerEnabled || actionsPayloadLoggerEnabled) {
    log('////Store logger---');
  }

  next(action);
};

const reducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    blacklist: [''],
  },
  rootReducer,
);

const store = configureStore({
  reducer,
  middleware(getDefaultMiddleware) {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: false,
    });

    return [loggerMiddleware].concat(defaultMiddleware).concat(sagaMiddleware);
  },
});

sagaMiddleware.run(rootSaga);

export default store;

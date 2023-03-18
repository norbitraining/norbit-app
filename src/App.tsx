import React from 'react';
import './i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Provider} from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
import store from 'store';
import Router from 'router';
import {ESTheme} from './theme';

import {AlertProvider} from 'context/alertContext';

const persistor = persistStore(store);

const App = () => {
  EStyleSheet.build(ESTheme);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <Router />
        </AlertProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

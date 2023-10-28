import React from 'react';
import './i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
import {ESTheme} from './theme';
import store from 'store';
import Router from 'router';

import {AlertProvider} from 'context/alertContext';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const persistor = persistStore(store);

const App = () => {
  EStyleSheet.build(ESTheme);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <AlertProvider>
              <Router />
            </AlertProvider>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

import React from 'react';
import {useEffect} from 'react';
import RNSplashScreen from 'react-native-splash-screen';

const SplashScreen = () => {
  useEffect(() => {
    RNSplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  return <></>;
};

export default SplashScreen;

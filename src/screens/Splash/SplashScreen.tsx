import React from 'react';
import {useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';

const SplashScreen = () => {
  useEffect(() => {
    BootSplash.hide({fade: true}); //hides the splash screen on app load.
  }, []);

  return <></>;
};

export default SplashScreen;

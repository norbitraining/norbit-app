import React from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';

function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  function onKeyboardDidShow(e: KeyboardEvent) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  React.useEffect(() => {
    Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return [keyboardHeight];
}

export default useKeyboardHeight;

import React, {createContext, useContext, useState} from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message';

const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */

  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
};

interface IAlertContext {
  alert: string | null;
  alertText: string | null;
  success: (text: string) => void;
  error: (text: string) => void;
  clear: () => void;
}

const initialData: IAlertContext = {
  alert: null,
  alertText: null,
  success: () => {},
  error: () => {},
  clear: () => {},
};

export const AlertContext = createContext<IAlertContext>(initialData);

export const useAlertContext = (): IAlertContext =>
  useContext<IAlertContext>(AlertContext);

export interface ProviderProps {
  children?: React.ReactNode;
}

const STATES = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const AlertProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = props => {
  const [alert, setAlert] = useState<string | null>(null);
  const [alertText, setAlertText] = useState<string | null>(null);
  const success = (text: string) => {
    setAlertText(text);
    setAlert(STATES.SUCCESS);
  };
  const error = (text: string) => {
    setAlertText(text);
    setAlert(STATES.ERROR);
  };
  const clear = () => {
    setAlertText(null);
    setAlert(null);
  };
  return (
    <AlertContext.Provider
      value={{
        success,
        error,
        clear,
        alert,
        alertText,
      }}>
      <Toast config={toastConfig} />
      {props.children}
    </AlertContext.Provider>
  );
};

export {AlertProvider};
export default AlertContext;

import React, {createContext, useContext, useState} from 'react';

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
      {props.children}
    </AlertContext.Provider>
  );
};

export {AlertProvider};
export default AlertContext;

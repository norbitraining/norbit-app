import React, {createContext, useContext, useRef, useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fontMaker} from 'font';
import Toast, {BaseToast, ToastConfig} from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GlobalStyles} from 'theme/globalStyle';
import {fontNormalize, rWidth, StyleSheet} from 'utils';

const CustomBaseToast = ({toastColor, iconColor, iconName, ...props}: any) => (
  <BaseToast
    {...props}
    style={[
      styles.toast,
      {
        backgroundColor: toastColor,
      },
    ]}
    contentContainerStyle={styles.contentToast}
    text1Style={styles.text1}
    text1Props={{
      numberOfLines: 2,
    }}
    renderLeadingIcon={() => (
      <View style={styles.contentIcon}>
        <View
          style={[
            styles.borderIcon,
            {
              backgroundColor: iconColor,
            },
          ]}>
          <Icon name={iconName} size={20} color="white" />
        </View>
      </View>
    )}
  />
);

const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <CustomBaseToast
      {...props}
      toastColor="#27B124"
      iconColor="#2ECE2A"
      iconName="check"
    />
  ),
  warning: props => (
    <CustomBaseToast
      {...props}
      toastColor="#F19D1E"
      iconColor="#FFAC31"
      iconName="alert"
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <CustomBaseToast
      {...props}
      toastColor="#CC392A"
      iconColor="#EA4037"
      iconName="close"
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
  const insets = useSafeAreaInsets();
  const [alert, setAlert] = useState<string | null>(null);
  const [alertText, setAlertText] = useState<string | null>(null);

  const toastShowRef = useRef<boolean>(false);

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

  const onHideToast = () => {
    toastShowRef.current = false;
  };
  const onShowToast = () => {
    toastShowRef.current = true;
  };

  const onTouchEnd = () => {
    if (!toastShowRef.current) {
      return;
    }
    Toast.hide();
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
      <View style={GlobalStyles.flexible} onTouchEnd={onTouchEnd}>
        {props.children}
        <Toast
          config={toastConfig}
          bottomOffset={insets.bottom}
          topOffset={insets.top}
          autoHide
          onShow={onShowToast}
          onHide={onHideToast}
        />
      </View>
    </AlertContext.Provider>
  );
};

export {AlertProvider};
export default AlertContext;

const styles = StyleSheet.create({
  borderIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  contentToast: {},
  contentIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  toast: {
    borderLeftWidth: 0,
    borderRadius: 100,
    height: rWidth(45),
    minWidth: '75%',
    width: 'auto',
    maxWidth: '90%',
  },
  text1: {
    ...fontMaker({weight: 'Regular'}),
    color: '$colors_white',
    fontSize: fontNormalize(13),
    textAlign: 'center',
    marginHorizontal: 15,
  },
});

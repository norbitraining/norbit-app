import {Dimensions, PixelRatio, Platform} from 'react-native';

export const isAndroid = Platform.OS === 'android';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

type Logger = (...args: any[]) => void;

export let log = null as unknown as Logger;

export const setLogger = (logger: Logger) => {
  log = logger;
};

export var EMPTY_FN = function () {};

const checkIfTablet = (): boolean => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_WIDTH * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
  }
};

const normalize = (size: number, _based: string = 'width') => {
  const isTablet = checkIfTablet();
  const newSize = isTablet ? (size * scale) / 2 : size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2.5;
  }
};

export const rWidth = (width: number): number => {
  return normalize(width, 'width');
};

export const rHeight = (height: number): number => {
  return normalize(height, 'height');
};

export const fontNormalize = (size: number) => {
  return rHeight(size);
};

export const withDefaults = <P, DP>(
  component: React.ComponentType<P>,
  defaultProps: Partial<P>,
) => {
  type Props = Partial<DP> & Omit<P, keyof DP>;
  component.defaultProps = defaultProps;
  return component as React.ComponentType<Props>;
};

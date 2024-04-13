import {Dimensions, PixelRatio, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {LabelError} from './text';
import {PlanningActivityType} from 'store/reducers/planning';
import {useCallback} from 'react';

import i18 from 'i18next';

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

export const getInitials = (fullName: string) => {
  return fullName
    .trim()
    .split(' ')
    .reduce(
      (acc, cur, idx, arr) =>
        acc +
        (arr.length > 1
          ? idx === 0 || idx === arr.length - 1
            ? cur.substring(0, 1)
            : ''
          : cur.substring(0, 2)),
      '',
    )
    .toUpperCase();
};

export const rWidth = (width: number): number => {
  return normalize(width, 'width');
};

export const rHeight = (height: number): number => {
  return normalize(height, 'height');
};

export const fontNormalize = (size: number) => {
  const fontScale = PixelRatio.getFontScale();
  return size * fontScale;
};

export const withDefaults = <P, DP>(
  component: React.ComponentType<P>,
  defaultProps: Partial<P>,
) => {
  type Props = Partial<DP> & Omit<P, keyof DP>;
  component.defaultProps = defaultProps;
  return component as React.ComponentType<Props>;
};

export const normalizeCatchActions = (codeError?: keyof typeof LabelError) => {
  const translateError = LabelError[codeError || 'generic'];
  Toast.show({
    type: 'error',
    text1: i18.t(`errors.${translateError}`) as string,
  });
};

export const getLabelActivityType = (
  activityType: PlanningActivityType,
  rounds?: string,
) => {
  if (activityType === 'none') {
    return '';
  }
  if (activityType === 'emom') {
    return 'Emom';
  }
  if (activityType === 'fortime') {
    return 'Fortime';
  }
  if (activityType === 'amrap') {
    return 'Amrap';
  }
  if (activityType === 'round' && rounds) {
    return rounds.length > 1 || Number(rounds) > 1
      ? 'common.rounds'
      : 'common.round';
  }
  if (activityType === 'tabata') {
    return 'Tabata';
  }
};

export function isDate(dateString: string): boolean {
  const date = new Date(dateString);

  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toString() !== 'Invalid Date'
  );
}

type RefType<T> = React.MutableRefObject<T> | React.RefCallback<T> | null;

export const useSharedRef = <T>(
  refA: RefType<T>,
  refB: RefType<T>,
): React.RefCallback<T> =>
  useCallback(
    (instance: T) => {
      if (typeof refA === 'function') {
        refA(instance);
      } else if (refA) {
        refA.current = instance;
      }
      if (typeof refB === 'function') {
        refB(instance);
      } else if (refB) {
        refB.current = instance;
      }
    },
    [refA, refB],
  );

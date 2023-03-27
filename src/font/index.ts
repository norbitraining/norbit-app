import {Platform} from 'react-native';

export const ExtraBold = 'ExtraBold';
export const Bold = 'Bold';
export const Light = 'Light';
export const Regular = 'Regular';
export const SemiBold = 'SemiBold';
export const Medium = 'Medium';
export const Thin = 'Thin';

export type TypeFontWeight =
  | typeof ExtraBold
  | typeof Bold
  | typeof Light
  | typeof Regular
  | typeof SemiBold
  | typeof Medium
  | typeof Thin;

const fontFamily = 'Roboto';

interface IFontWeightNames {
  ExtraBold: string;
  Bold: string;
  SemiBold: string;
  Medium: string;
  Regular: string;
  Light: string;
  Thin: string;
}

interface IFontWeight {
  weights: IFontWeightNames;
  styles: any;
}

interface IFont {
  Roboto: IFontWeight;
}

// we define available font weight and styles for each font here
const font: IFont = {
  Roboto: {
    weights: {
      ExtraBold: '900',
      Bold: '700',
      SemiBold: '600',
      Medium: '500',
      Regular: '400',
      Light: '300',
      Thin: '100',
    },
    styles: {
      Italic: 'italic',
    },
  },
};

interface Props {
  weight?: TypeFontWeight;
  fontStyle?: string;
  family?: string;
}

// generate styles for a font with given weight and style
export const fontMaker = ({
  weight = Regular,
  fontStyle = 'normal',
  family = fontFamily,
}: Props): any => {
  const {weights} = font[fontFamily];
  return {
    fontFamily: Platform.OS === 'android' ? `${family}-${weight}` : family,
    fontWeight: weights[weight] || weights.Regular,
    fontStyle,
  };
};

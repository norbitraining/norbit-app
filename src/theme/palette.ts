export const ColorPalette = {
  primary: '#0E1113',
  secondary: '#00CC00',
  black: '#000000',
  dark: 'rgba(7, 7, 7, 1)',
  schemeDark: '#12181F',
  inputColorDark: '#181F27',
  darkGray: 'rgba(75, 76, 76, 1)',
  white: '#FFF',
  textOpacity: 'rgba(123, 124, 123, 1)',
  dangerSell: 'rgba(213, 48, 65, 1)',
  whiteOpacity: 'rgba(255, 255, 255, 0.67)',
  progressBarGray: '#6C757D',
  gray: 'rgba(255, 255, 255, 0.25)',
  dangerTab: '#CC392A',
  danger: '#EA4037',
  success: '#2ECE2A',
  tabColor: '#333333',
  tabDark: '#386BF6',
};

export type Palette = {
  readonly [K in keyof typeof ColorPalette]+?: (typeof ColorPalette)[K];
};

const createPalette = (palette: Palette): Palette => {
  return {
    ...ColorPalette,
    ...palette,
  };
};

export default createPalette;

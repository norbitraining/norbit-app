import createPalette, {Palette} from './palette';
export interface Theme {
  colors: Palette;
}

export interface ThemeInput {
  palette?: Palette;
}

const createTheme = (options: ThemeInput): Theme => {
  const {palette: paletteInput = {}} = options || {};

  const colors = createPalette(paletteInput);

  return {
    colors,
  };
};

export default createTheme;

export interface Palette {
  black: string;
  primary: string;
  white: string;
}

export type PaletteType = {
  readonly [K in keyof Palette]+?: Palette[K];
};

const createPalette = (palette: PaletteType): Palette => {
  const {black = '#000000', primary = 'green', white = '#FFF'} = palette;

  return {
    white,
    black,
    primary,
  };
};

export default createPalette;

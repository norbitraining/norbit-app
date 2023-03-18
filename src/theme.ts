import createTheme, {Theme as ThemeProps} from './theme/index';
import {get, mapKeys, reduce, size} from 'lodash';
export type {ThemeProps as Theme};

const themeLight = createTheme({});
const themeDark = createTheme({});

const GenerateThemeObject = ({theme}: {theme: ThemeProps}) => ({
  light: {
    ...theme,
    ...themeLight,
  },
  dark: {
    ...theme,
    ...themeDark,
  },
});

const ESThemeMap = Object.keys(themeDark).map(key => {
  const items = get(themeDark, key);
  if (size(items) > 0) {
    return mapKeys(items, (_, itemKey) => `$${key}_${itemKey}`);
  }
  return {};
});

export const ESTheme = reduce(
  ESThemeMap,
  (sum, val) => {
    return {...sum, ...val};
  },
  {},
);

export default GenerateThemeObject;

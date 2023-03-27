import {ViewStyle, TextStyle, ImageStyle} from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import {ESTheme} from 'theme';

type StyleProps = Partial<ViewStyle | TextStyle | ImageStyle>;

export const StyleSheet = {
  create(styles: {[className: string]: StyleProps}) {
    EStyleSheet.build(ESTheme);
    return EStyleSheet.create(styles);
  },
};

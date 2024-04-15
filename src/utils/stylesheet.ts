import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ESTheme} from 'theme';

type StyleProps = Partial<ViewStyle | TextStyle | ImageStyle>;
EStyleSheet.build(ESTheme);

export const StyleSheet = {
  create(styles: {[className: string]: StyleProps}) {
    return EStyleSheet.create(styles);
  },
  value(style: string) {
    return EStyleSheet.value(style);
  },
};

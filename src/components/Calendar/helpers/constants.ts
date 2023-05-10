import {Dimensions, StyleSheet} from 'react-native';
import {GlobalStyles} from 'theme/globalStyle';

export const screenWidth = Dimensions.get('screen').width;
export const itemWidth = screenWidth / 7;
export const swipeThreshold = 0.25 * screenWidth;
export const swipeSpeed = 0.2;

export const colors = {
  white: '#ffff',
  sunday: '#E17F7F',
  saturday: '#7FB9E1',
  defaultWeekColor: '#7E7E7E',
  defaultBg: 'lightblue',
  shadowColor: '#000',
  black: 'black',
};

export const styles = StyleSheet.create({
  eachDay: {
    ...GlobalStyles.center,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'transparent',
    minWidth: 35,
    textAlign: 'center',
  },
  shadow: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

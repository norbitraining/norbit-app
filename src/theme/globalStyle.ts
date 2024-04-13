import {StyleSheet} from 'utils/stylesheet';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$colors_dark',
  },
  containerWhite: {
    flex: 1,
    backgroundColor: '$colors_white',
  },
  containerBottomDark: {
    backgroundColor: '$colors_inputColorDark',
  },
  containerBottomDarkCalendar: {backgroundColor: '$colors_inputColorDark'},
  containerBottomWhite: {
    backgroundColor: '#F5F5F5',
  },
  textCapitalize: {textTransform: 'capitalize'},
  textUppercase: {textTransform: 'uppercase'},
  flexible: {
    flex: 1,
  },
  lowercase: {textTransform: 'lowercase'},
  redText: {
    color: 'red',
  },
  flatListDark: {backgroundColor: '$colors_schemeDark'},
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  flex: {flex: 1},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hide: {
    display: 'none',
  },
  underlineText: {textDecorationLine: 'underline'},
});
export {GlobalStyles};

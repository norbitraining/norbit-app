import {StyleSheet} from 'utils/stylesheet';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$colors_dark',
  },
  flexible: {
    flex: 1,
  },
  redText: {
    color: 'red',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
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
  underlineText: {textDecorationLine: 'underline'},
});
export {GlobalStyles};

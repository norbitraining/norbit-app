import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {planningActions} from 'store/reducers/planning';
import CalendarScreen from './CalendarScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      getPlanningAction: planningActions.getPlanningAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CalendarScreen);

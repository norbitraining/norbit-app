import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import CalendarScreen from './CalendarScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({}, dispatch);
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CalendarScreen);

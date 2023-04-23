import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';

import SettingsScreen from './SettingsScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({}, dispatch);
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SettingsScreen);

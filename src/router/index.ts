import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import Router from './Router';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({}, dispatch);
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Router);

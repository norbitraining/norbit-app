import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {userActions} from 'store/reducers/user';
import ForgotPasswordScreen from './ForgotPasswordScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      forgotPasswordAction: userActions.forgotPasswordAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ForgotPasswordScreen);

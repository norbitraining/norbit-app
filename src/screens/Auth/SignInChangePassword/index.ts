import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {userActions} from 'store/reducers/user';
import SignInChangePasswordScreen from './SignInChangePassword';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      changePasswordAuthenticatedAction:
        userActions.changePasswordAuthenticatedAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SignInChangePasswordScreen);

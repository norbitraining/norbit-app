import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {userActions} from 'store/reducers/user';
import SignInScreen from './SignInScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      signInAction: userActions.signInAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SignInScreen);

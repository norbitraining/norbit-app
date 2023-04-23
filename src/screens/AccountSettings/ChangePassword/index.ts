import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {userActions} from 'store/reducers/user';
import ChangePasswordScreen from './ChangePassword';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      changePasswordSettingsAction: userActions.changePasswordSettingsAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ChangePasswordScreen);

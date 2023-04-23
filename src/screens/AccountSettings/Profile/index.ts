import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {userActions} from 'store/reducers/user';
import ProfileScreen from './ProfileScreen';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      updateProfileAction: userActions.updateProfileAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ProfileScreen);

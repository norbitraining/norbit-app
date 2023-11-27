import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';

import {coachesActions} from 'store/reducers/coaches';

import Router from './Router';

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      getCoachesAction: coachesActions.getCoachesAction,
    },
    dispatch,
  );
}

const mapStateToProps = () => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Router);

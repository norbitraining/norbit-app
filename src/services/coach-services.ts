import API, {VERSION} from './api';

const CoachServices = {
  getCoaches: () => {
    return API.get(`/${VERSION}/user/coach-list`);
  },
};

export default CoachServices;

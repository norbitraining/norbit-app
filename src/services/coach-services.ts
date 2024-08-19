import axios from 'axios';
import API, {VERSION} from './api';
import env from 'config/env';

const CoachServices = {
  getCoaches: () => {
    return API.get(`/${VERSION}/user/coach-list`);
  },
  getCoachProfilePicture: async (coachId: number, pathPhoto: string) => {
    const token = await API.getAuthorization();

    return axios.get(`${env.WEB_URL}/images/uploads/${coachId}/${pathPhoto}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });
  },
};

export default CoachServices;

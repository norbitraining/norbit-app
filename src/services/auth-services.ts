import API from './api';

export const logInService = (data: any) => {
  return API.post('/sign-in', data);
};

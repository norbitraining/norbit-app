import API, {VERSION} from './api';

const AuthServices = {
  logInService: (data: {email: string; password: string}) => {
    return API.post(`/public/${VERSION}/sign-in-app`, data);
  },
  changePassword: (data: {password: string}) => {
    return API.post(`/${VERSION}/reset-password`, data);
  },
  setAuthorization: (token: string) => {
    API.setAuthorization(token);
  },
};

export default AuthServices;

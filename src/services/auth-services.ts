import {IUserRequest} from 'store/reducers/user';
import API, {VERSION} from './api';

const AuthServices = {
  logInService: (data: {email: string; password: string}) => {
    return API.post(`/public/${VERSION}/sign-in-app`, data);
  },
  changePassword: (data: {password: string}) => {
    return API.post(`/${VERSION}/reset-password`, data);
  },
  changePasswordSettings: (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return API.post(`/${VERSION}/reset-password-app`, data);
  },
  updateProfile: (data: IUserRequest) => {
    return API.post(`/${VERSION}/update-user`, data);
  },
  forgotPassword: (data: {email: string}) => {
    return API.post(`/public/${VERSION}/forgot-password`, data);
  },
  setAuthorization: (token: string) => {
    API.setAuthorization(token);
  },
};

export default AuthServices;

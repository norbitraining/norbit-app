import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from './rootReducers';

export type UserRole = 'superadmin' | 'admin' | 'coach' | 'athlete';

export type HeightMeasurement = 'cm' | 'ft';
export type WeightMeasurement = 'kg' | 'lb';

export interface IUserRequest {
  id?: string;
  id_country?: string;
  id_role?: number;
  id_coach?: number;
  role?: UserRole;
  first_name?: string;
  password?: string;
  old_password?: string;
  last_name?: string;
  path_photo?: string;
  weight?: string;
  athlete?: IUserRequest;
  height?: string;
  isNew?: boolean;
  height_measurement?: HeightMeasurement;
  weight_measurement?: WeightMeasurement;
  gender?: number;
  blocked?: boolean;
  email?: string;
  deleted?: string;
  birthday?: Date | string;
  create_at?: Date;
  update_at?: Date;
}

// Define a type for the slice state
export interface IUser {
  user: IUserRequest | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Define the initial state using that type
const initialState: IUser = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    userAction: (state, action: PayloadAction<{userId: string}>) => {
      action.payload.userId;
    },
    userSuccessAction: (state, action: PayloadAction<IUserRequest>) => {
      state.user = action.payload;
    },
    signInAction: (
      state,
      action: PayloadAction<{
        email: string;
        password: string;
      }>,
    ) => {
      action.payload.email;
      action.payload.password;
      state.isLoading = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<IUserRequest | undefined>) => {
      action.payload && (state.user = action.payload);
      state.isLoading = false;
      state.isLoggedIn = true;
      state.error = null;
    },
    updateProfileAction: (state, action: PayloadAction<IUserRequest>) => {
      action.payload.first_name;
      action.payload.last_name;
      action.payload.birthday;
      action.payload.gender;
      action.payload.height;
      action.payload.height_measurement;
      action.payload.weight;
      action.payload.weight_measurement;
      state.isLoading = true;
    },
    signInCleanState: state => {
      state.isLoading = false;
      state.error = null;
    },
    resendEmailAction: state => {
      state.isLoading = true;
    },
    resendEmailSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    resendForgotPasswordAction: (
      state,
      action: PayloadAction<{
        email: string;
      }>,
    ) => {
      action.payload.email;
      state.isLoading = true;
    },
    resendForgotPasswordSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    forgotPasswordAction: (
      state,
      action: PayloadAction<{
        email: string;
      }>,
    ) => {
      action.payload.email;
      state.isLoading = true;
    },
    updateProfileSuccess: (
      state,
      action: PayloadAction<IUserRequest | undefined>,
    ) => {
      action.payload && (state.user = action.payload);
      state.isLoading = false;
      state.error = null;
    },
    forgotPasswordSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    changePasswordSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    changePasswordSettingsAction: (
      state,
      action: PayloadAction<{currentPassword: string; newPassword: string}>,
    ) => {
      action.payload.currentPassword;
      action.payload.newPassword;
      state.isLoading = true;
    },
    changePasswordAuthenticatedAction: (
      state,
      action: PayloadAction<{password: string}>,
    ) => {
      action.payload.password;
      state.isLoading = true;
    },
    changePasswordSettingsSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    userFailed: state => {
      state.isLoading = false;
    },
    setLogoutUser: state => {
      state.isLoading = true;
      state.error = null;
    },
    logoutUserSuccess: state => {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const userActions = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from './rootReducers';

// Define a type for the slice state
interface IUser {
  user: any;
}

// Define the initial state using that type
const initialState: IUser = {
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload.user;
    },
  },
});

export const {setUser} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;

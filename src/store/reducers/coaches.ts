import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearAllAction} from './user';

export interface ICoachesRequest {
  id?: string;
  blocked?: boolean;
  coach: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
  };
}

// Define a type for the slice state
export interface ICoaches {
  coaches: ICoachesRequest[];
  coachSelected: ICoachesRequest | null;
  error: Error | null;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: ICoaches = {
  coaches: [],
  coachSelected: null,
  isLoading: false,
  error: null,
};

export const coachesSlice = createSlice({
  name: 'coaches',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  extraReducers: builder => builder.addCase(clearAllAction, () => initialState),
  reducers: {
    getCoachesAction: state => {
      state.isLoading = true;
    },
    getCoachesSuccessAction: (
      state,
      action: PayloadAction<ICoachesRequest[]>,
    ) => {
      state.coaches = action.payload;
      state.isLoading = false;
    },
    selectCoachAction: (state, action: PayloadAction<ICoachesRequest>) => {
      state.coachSelected = action.payload;
    },
    coachesFailed: state => {
      state.isLoading = false;
    },
  },
});

export const coachesActions = coachesSlice.actions;

export default coachesSlice.reducer;

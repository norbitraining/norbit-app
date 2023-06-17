import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type PlanningActivityType =
  | 'none'
  | 'round'
  | 'fortime'
  | 'emom'
  | 'amrap'
  | 'tabata';

export interface IPlanning {
  id: number;
  idPlanning: number;
  date: string;
  data: PlanningColumn[];
}

export interface PlanningColumn {
  id: number;
  planningColumnId: number;
  columnName: string;
  ord: number;
  cards: PlanningCard[];
}

export interface PlanningCard {
  id: number;
  planningColumnDetailId: number;
  selectedActivityType: PlanningActivityType;
  comment: any;
  value1: string;
  value2: string;
  value3: string;
  ord: number;
  exerciseList: ExerciseList[];
}

export interface ExerciseList {
  idTemp: number;
  planningColumnDetailFeatureId: number;
  ord: number;
  weight: string;
  reps: string;
  rounds: any;
  distance: any;
  time: any;
  exercise: Exercise;
}

export interface Exercise {
  idExercise: number;
  exerciseName: string;
  videoUrl: string;
}

// Define a type for the slice state
export interface IPlanningReducer {
  planningList: IPlanning[];
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: IPlanningReducer = {
  planningList: [],
  isLoading: false,
};

export const planningSlice = createSlice({
  name: 'planning',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getPlanningAction: (state, action: PayloadAction<{date: string}>) => {
      state.isLoading = true;
      action.payload.date;
    },
    getPlanningSuccessAction: (state, action: PayloadAction<IPlanning[]>) => {
      state.isLoading = false;
      state.planningList = action.payload;
    },
    planningFailed: state => {
      state.isLoading = false;
    },
  },
});

export const planningActions = planningSlice.actions;

export default planningSlice.reducer;

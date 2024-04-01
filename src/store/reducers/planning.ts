import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearAllAction} from './user';

const PREFIX = 'planning';

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

export interface PlanningRecord {
  id: number;
  isFinish?: boolean;
  note?: string | null;
  time?: string | null;
}

export interface PlanningColumn {
  id: number;
  planningColumnId: number;
  columnName: string;
  ord: number;
  record: PlanningRecord[];
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
  personalizedExercise?: {exercise_name: string; video_url: string}[] | null;
}

// Define a type for the slice state
export interface IPlanningReducer {
  planningList: IPlanning[];
  isLoading: boolean;
  isLoadingRecord: boolean;
}

// Define the initial state using that type
const initialState: IPlanningReducer = {
  planningList: [],
  isLoading: false,
  isLoadingRecord: false,
};

export const planningSlice = createSlice({
  name: 'planning',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  extraReducers: builder => builder.addCase(clearAllAction, () => initialState),
  reducers: {
    getPlanningAction: (state, action: PayloadAction<{date: string}>) => {
      state.isLoading = true;
      action.payload.date;
    },
    finishPlanningColumnAction: (
      state,
      action: PayloadAction<{
        planningId: number;
        planningColumnId: number;
        isFinish?: boolean;
        note?: string;
      }>,
    ) => {
      state.isLoadingRecord = true;
      action.payload.planningId;
      action.payload.planningColumnId;
      action.payload.isFinish;
    },
    updatePlanningColumnRecordAction: (
      state,
      action: PayloadAction<{
        recordId: number;
        planningId: number;
        planningColumnId: number;
        isFinish?: boolean;
        note?: string;
        time?: string;
      }>,
    ) => {
      state.isLoadingRecord = true;
      action.payload.recordId;
    },
    planningColumnRecordSuccessAction: state => {
      state.isLoadingRecord = false;
    },
    planningRecordUpdateSuccessAction: (
      state,
      action: PayloadAction<{
        planningIndex: number;
        planningColumnIndex: number;
        record: PlanningRecord;
      }>,
    ) => {
      state.isLoading = false;
      state.isLoadingRecord = false;
      state.planningList[action.payload.planningIndex].data[
        action.payload.planningColumnIndex
      ].record = [action.payload.record];
    },
    getPlanningSuccessAction: (state, action: PayloadAction<IPlanning[]>) => {
      state.isLoading = false;
      state.isLoadingRecord = false;
      state.planningList = action.payload;
    },
    planningFailed: state => {
      state.isLoading = false;
      state.isLoadingRecord = false;
    },
  },
});

interface GlobalState {
  [PREFIX]: IPlanningReducer;
}

export const getRecordByPlanningColumn =
  (planningId: number, columnId: number) =>
  ({planning: {planningList}}: GlobalState): PlanningRecord[] => {
    const indexPlanning = planningList.findIndex(x => x.id === planningId);
    if (indexPlanning === -1) {
      return [];
    }

    const indexPlanningColumn = planningList[indexPlanning].data.findIndex(
      x => x.id === columnId,
    );

    if (indexPlanningColumn === -1) {
      return [];
    }

    return planningList[indexPlanning].data[indexPlanningColumn].record;
  };

export const planningActions = planningSlice.actions;

export default planningSlice.reducer;

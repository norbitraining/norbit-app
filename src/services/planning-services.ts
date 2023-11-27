import API, {VERSION} from './api';

const PlanningServices = {
  getPlanning: (date: string, coachId?: number) => {
    return API.get(
      `/${VERSION}/panel/planning/planning-by-athlete?date=${date}&coachId=${coachId}`,
    );
  },
  finishPlanningColumn: (data: {
    planningId: number;
    planningColumnId: number;
    isFinish?: boolean;
    note?: string;
  }) => {
    return API.post(`/${VERSION}/planning/create-record`, data);
  },
  updatePlanningColumnRecord: (data: {
    recordId: number;
    isFinish?: boolean;
    note?: string;
    time?: string;
  }) => {
    return API.put(`/${VERSION}/planning/update-record`, data);
  },
};

export default PlanningServices;

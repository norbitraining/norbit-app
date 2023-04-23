import API, {VERSION} from './api';

const PlanningServices = {
  getPlanning: (date: string) => {
    return API.get(
      `/${VERSION}/panel/planning/planning-by-athlete?date=${date}`,
    );
  },
};

export default PlanningServices;

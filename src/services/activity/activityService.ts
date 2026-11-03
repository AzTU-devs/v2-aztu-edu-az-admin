import apiClient from "../../util/apiClient";
import type {
  ActivityFilters,
  ActivityFiltersResponse,
  ActivityItem,
  ActivityListQuery,
  ActivityListResponse,
  Paginated,
} from "../../types/rbac";

const activityService = {
  list: async (query: ActivityListQuery = {}): Promise<Paginated<ActivityItem>> => {
    const response = await apiClient.get<ActivityListResponse>("/api/activity", {
      params: query,
    });
    return response.data.data;
  },

  getFilters: async (): Promise<ActivityFilters> => {
    const response = await apiClient.get<ActivityFiltersResponse>("/api/activity/filters");
    return response.data.data;
  },
};

export default activityService;

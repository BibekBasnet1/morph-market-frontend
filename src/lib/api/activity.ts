import api from "./client";
import type { ActivityLog, ActivityStatistics, ActivityFilters, FilterOptions } from "../../types/activity";

interface ActivityResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

interface StatisticsResponse {
  success: boolean;
  message: string;
  data: ActivityStatistics;
}

interface FilterOptionsResponse {
  success: boolean;
  message: string;
  data: FilterOptions;
}

export const ActivityService = {
  async getActivities(filters?: ActivityFilters): Promise<ActivityResponse> {
    const res = await api.get('/activity-logs', { params: filters });
    return res.data;
  },

  async getActivityById(id: number): Promise<{ success: boolean; data: ActivityLog }> {
    const res = await api.get(`/activity-logs/${id}`);
    return res.data;
  },

  async getStatistics(): Promise<StatisticsResponse> {
    const res = await api.get('/activity-logs/statistics');
    return res.data;
  },

  async getFilterOptions(): Promise<FilterOptionsResponse> {
    const res = await api.get('/activity-logs/filters');
    return res.data;
  },
};
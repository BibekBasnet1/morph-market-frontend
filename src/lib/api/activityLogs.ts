import api from "./client";

export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  event: string | null;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string;
  causer_id: number;
  causer: {
    id: number;
    name: string;
    email: string;
  };
  properties: Record<string, any>;
  changes?: {
    old: Record<string, any>;
    new: Record<string, any>;
  };
  batch_uuid: string | null;
  created_at: string;
}

export interface ActivityLogsResponse {
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

export const ActivityLogService = {
  async getBuyerLogs(page: number = 1): Promise<ActivityLogsResponse> {
    const res = await api.get("/activity-logs", {
      params: { page, per_page: 15 },
    });
    return res.data;
  },
};

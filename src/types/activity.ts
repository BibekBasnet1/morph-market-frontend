export interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  event: string;
  causer_type: string | null;
  causer_id: number | null;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityStatistics {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
  by_event: Record<string, number>;
  by_log_name: Record<string, number>;
}

export interface ActivityFilters {
  search?: string;
  log_name?: string;
  event?: string;
  subject_type?: string;
  subject_id?: number;
  causer_id?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface FilterOptions {
  log_names: string[];
  events: string[];
}
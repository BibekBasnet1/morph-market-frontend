import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityService } from "../../../lib/api/activity";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import Spinner from "../../ui/spinner";
import Select from "../../ui/select";
import { 
  Activity, 
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
  Calendar,
  Trash2,
  Edit,
  Plus
} from "lucide-react";
import type { ActivityLog } from "../../../types/activity";

const getActivityConfig = (event: string) => {
  const configMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
    'created': { 
      icon: <Plus className="h-4 w-4" />, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    'updated': { 
      icon: <Edit className="h-4 w-4" />, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    'deleted': { 
      icon: <Trash2 className="h-4 w-4" />, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    'restored': { 
      icon: <Activity className="h-4 w-4" />, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
  };
  return configMap[event] || { 
    icon: <Activity className="h-4 w-4" />, 
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  };
};

const getRelativeTime = (date: string): string => {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return activityDate.toLocaleDateString();
};

interface ActivityItemProps {
  log: ActivityLog;
}

const ActivityItem = ({ log }: ActivityItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasProperties = log.properties && Object.keys(log.properties).length > 0;
  const config = getActivityConfig(log.event);

  return (
    <div className="flex gap-4 p-4 rounded-lg border border-border dark:border-border bg-card dark:bg-card hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className={`h-8 w-8 rounded-full ${config.bgColor} flex items-center justify-center ${config.color}`}>
          {config.icon}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground dark:text-foreground">
              {log.description}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-xs capitalize">
                {log.event}
              </Badge>
              {log.log_name && (
                <Badge variant="secondary" className="text-xs">
                  {log.log_name}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {getRelativeTime(log.created_at)}
              </span>
            </div>
          </div>
          
          {hasProperties && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex-shrink-0"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {expanded && hasProperties && (
          <div className="mt-3 p-3 rounded bg-muted/50 dark:bg-muted/50 border border-border dark:border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Details:</p>
            <pre className="text-xs text-foreground dark:text-foreground overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(log.properties, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityTab = () => {
  const [search, setSearch] = useState("");
  const [logNameFilter, setLogNameFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities', search, logNameFilter, eventFilter, page],
    queryFn: async () => {
      const response = await ActivityService.getActivities({
        search: search || undefined,
        log_name: logNameFilter === 'all' ? undefined : logNameFilter,
        event: eventFilter === 'all' ? undefined : eventFilter,
        page,
        per_page: perPage,
      });
      return response;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['activity-statistics'],
    queryFn: async () => {
      const response = await ActivityService.getStatistics();
      return response.data;
    },
  });

  const { data: filterOptionsData } = useQuery({
    queryKey: ['activity-filter-options'],
    queryFn: async () => {
      const response = await ActivityService.getFilterOptions();
      return response.data;
    },
  });

  const logNameOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Types' }];
    if (filterOptionsData?.log_names) {
      filterOptionsData.log_names.forEach(name => {
        options.push({
          value: name,
          label: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ')
        });
      });
    }
    return options;
  }, [filterOptionsData]);

  const eventOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Events' }];
    if (filterOptionsData?.events) {
      filterOptionsData.events.forEach(event => {
        options.push({
          value: event,
          label: event.charAt(0).toUpperCase() + event.slice(1)
        });
      });
    }
    return options;
  }, [filterOptionsData]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (type: 'logName' | 'event', value: string) => {
    if (type === 'logName') {
      setLogNameFilter(value);
    } else {
      setEventFilter(value);
    }
    setPage(1);
  };

  if (activitiesLoading && !activitiesData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const totalPages = activitiesData?.meta?.last_page || 1;

  return (
    <div className="space-y-6 w-full">
      {/* Statistics Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <p className="text-2xl font-bold text-foreground dark:text-foreground">
                    {statsData.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold text-foreground dark:text-foreground">
                    {statsData.today}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground dark:text-foreground">
                    {statsData.this_week}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground dark:text-foreground">
                    {statsData.this_month}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-card dark:bg-card border-border dark:border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-background dark:bg-background border-input dark:border-input text-foreground dark:text-foreground"
              />
            </div>

            <div className="w-full sm:w-[180px]">
              <Select
                placeholder="Type"
                value={logNameFilter}
                options={logNameOptions}
                onChange={(value) => handleFilterChange('logName', value)}
              />
            </div>

            <div className="w-full sm:w-[180px]">
              <Select
                placeholder="Event"
                value={eventFilter}
                options={eventOptions}
                onChange={(value) => handleFilterChange('event', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="rounded-xl border border-border dark:border-border bg-card dark:bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Recent Activity</h3>
          {activitiesData?.meta && (
            <p className="text-sm text-muted-foreground">
              Showing {activitiesData.meta.from}-{activitiesData.meta.to} of {activitiesData.meta.total}
            </p>
          )}
        </div>

        {activitiesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : activitiesData?.data && activitiesData.data.length > 0 ? (
          <div className="space-y-3">
            {activitiesData.data.map((log) => (
              <ActivityItem key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activities found</p>
            {(search || logNameFilter !== 'all' || eventFilter !== 'all') && (
              <Button
                variant={'outline'}
                onClick={() => {
                  setSearch("");
                  setLogNameFilter("all");
                  setEventFilter("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTab;
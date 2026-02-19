import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ActivityLogService, type ActivityLog } from "../../lib/api/activityLogs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Package, ShoppingCart, CreditCard, FileText, Plus, Edit, Trash2, Clock, ArrowRight } from "lucide-react";
import Spinner from "../../components/ui/spinner";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const getIconForLogType = (logName: string) => {
  switch (logName.toLowerCase()) {
    case "product":
      return <Package className="w-5 h-5" />;
    case "cart":
      return <ShoppingCart className="w-5 h-5" />;
    case "payment":
      return <CreditCard className="w-5 h-5" />;
    case "order":
    case "orderitem":
      return <FileText className="w-5 h-5" />;
    case "inventory":
      return <Package className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getEventIcon = (event: string | null) => {
  switch (event?.toLowerCase()) {
    case "created":
      return <Plus className="w-4 h-4 text-green-500" />;
    case "updated":
      return <Edit className="w-4 h-4 text-blue-500" />;
    case "deleted":
      return <Trash2 className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const getEventColor = (event: string | null) => {
  switch (event?.toLowerCase()) {
    case "created":
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    case "updated":
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    case "deleted":
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
  }
};

const getEventBadgeVariant = (
  event: string | null
): "default" | "secondary" => {
  switch (event?.toLowerCase()) {
    case "created":
      return "default";
    case "updated":
    case "deleted":
      return "secondary";
    default:
      return "secondary";
  }
};

const ActivityLogItem = ({ log }: { log: ActivityLog }) => {
  const formattedDate = formatDate(log.created_at);
  const formattedTime = formatTime(log.created_at);

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${getEventColor(
        log.event
      )}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className=" text-sm flex-shrink-0 mt-1 p-2 bg-white dark:bg-gray-700 rounded-lg">
          {getIconForLogType(log.log_name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {log.description}
              </p>
            </div>
            {log.event && (
              <Badge variant={getEventBadgeVariant(log.event)} className="flex-shrink-0">
                <span className="flex items-center gap-1">
                  {/* {getEventIcon(log.event)} */}
                  {log.event.charAt(0).toUpperCase() + log.event.slice(1)}
                </span>
              </Badge>
            )}
          </div>

          {/* Subject Type & ID */}
          {log.subject_type && (
            <div className="mb-2">
              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                {log.subject_type}
              </span>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>{formattedDate} at {formattedTime}</span>
          </div>

          {/* Properties Summary */}
          {/* {log.properties && log.log_name === "product" && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <details className="cursor-pointer">
                <summary className="hover:text-gray-900 dark:hover:text-gray-200">
                  View details
                </summary>
                <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(
                    log.properties?.attributes || log.properties,
                    null,
                    2
                  )}
                </pre>
              </details>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

const PREVIEW_LIMIT = 3;

export const BuyerActivityLogs = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["buyer-activity-logs"],
    queryFn: () => ActivityLogService.getBuyerLogs(1),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 dark:text-red-400 py-12">
            Failed to load activity logs
          </div>
        </CardContent>
      </Card>
    );
  }

  const logs = (data?.data || []).slice(0, PREVIEW_LIMIT);
  const total = data?.meta?.total ?? 0;

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex text-lg dark:text-gray-300 items-center gap-2">
            <Clock className="w-5 h-5" />
            Activity Logs
          </CardTitle>
          {total > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => navigate("/activity-logs")}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No activity logs yet
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerActivityLogs;
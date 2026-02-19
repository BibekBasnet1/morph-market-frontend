import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityLogService } from "../../lib/api/activityLogs";
import { Button } from "../../components/ui/button";
import Spinner from "../../components/ui/spinner";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Package, ShoppingCart, CreditCard, FileText, Plus, Edit, Trash2 } from "lucide-react";

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

const ActivityLogsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["buyer-activity-logs", page],
    queryFn: () => ActivityLogService.getBuyerLogs(page),
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Activity Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track all your account activities and changes
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center text-red-600 dark:text-red-400">
            Failed to load activity logs. Please try again later.
          </div>
        )}

        {/* Logs List */}
        {!isLoading && !error && (
          <>
            {logs.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No activity logs yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`border rounded-lg p-4 transition-all ${getEventColor(
                      log.event
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg">
                        {getIconForLogType(log.log_name)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {log.description}
                            </p>
                            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {log.causer.name} ({log.causer.email})
                            </p> */}
                          </div>
                          {log.event && (
                            <Badge
                              variant={getEventBadgeVariant(log.event)}
                              className="flex-shrink-0"
                            >
                              <span className="flex items-center gap-1">
                                {log.event.charAt(0).toUpperCase() +
                                  log.event.slice(1)}
                              </span>
                            </Badge>
                          )}
                        </div>

                        {/* Subject Type & ID */}
                        {log.subject_type && (
                          <div className="mb-2">
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                              {log.subject_type}
                            </span>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {formatDate(log.created_at)} at{" "}
                            {formatTime(log.created_at)}
                          </span>
                        </div>

                        {/* Properties Summary */}
                        {/* {log.properties &&
                          (log.log_name === "product" ||
                            log.log_name === "inventory") && (
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              <details className="cursor-pointer">
                                <summary className="hover:text-gray-900 dark:hover:text-gray-200">
                                  View details
                                </summary>
                                <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-48">
                                  {JSON.stringify(
                                    log.properties?.attributes ||
                                      log.properties,
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
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {meta.from} to {meta.to} of {meta.total} activities
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {meta.current_page} of {meta.last_page}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    disabled={page === meta.last_page}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;

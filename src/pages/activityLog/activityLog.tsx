import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, CheckCircle, Info, AlertTriangle, Monitor, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

// ---------------- types ----------------
export type ActivityLog = {
  id: number;
  user_id: number;
  user_role: "buyer" | "seller" | "admin";
  action: string;
  description: string;
  entity_type?: "product" | "order" | "payment" | "store";
  entity_id?: number | null;
  metadata?: Record<string, any>;
  device: "Web" | "Mobile" | "API";
  created_at: string;
  status?: "success" | "info" | "critical";
};

// ---------------- helpers ----------------
const statusConfig: Record<string, any> = {
  success: { icon: CheckCircle, color: "text-green-600", badge: "SUCCESS" },
  info: { icon: Info, color: "text-blue-600", badge: "INFO" },
  critical: { icon: AlertTriangle, color: "text-red-600", badge: "CRITICAL" },
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const formatDateHeader = (date: Date) => {
  if (isToday(date)) return `Today, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}`;
  if (isYesterday(date)) return `Yesterday, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}`;

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};


const deviceIcon = (device: ActivityLog["device"]) => {
  if (device === "Mobile") return Smartphone;
  return Monitor;
};

// ---------------- mock api (replace with real one) ----------------
async function fetchActivities(): Promise<ActivityLog[]> {
  return [
    {
      id: 1,
      user_id: 5,
      user_role: "buyer",
      action: "listing_purchased",
      description: "Purchased 'Pied Ball Python – Subadult Female' for $1,250.00",
      entity_type: "order",
      entity_id: 88,
      device: "Web",
      created_at: "2026-01-28T08:14:00Z",
      status: "success",
    },
    {
      id: 2,
      user_id: 5,
      user_role: "seller",
      action: "listing_price_updated",
      description: "Changed price for 'Ghost Ball Python' from $350 to $320",
      entity_type: "product",
      entity_id: 12,
      device: "Web",
      created_at: "2026-01-28T05:05:00Z",
      status: "info",
    },
    {
      id: 3,
      user_id: 5,
      user_role: "buyer",
      action: "failed_login",
      description: "Invalid password attempt from a new device",
      device: "Mobile",
      created_at: "2026-01-27T11:58:00Z",
      status: "critical",
    },
  ];
}

// ---------------- page ----------------
export default function ActivityLogPage() {
  const [search, setSearch] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: fetchActivities,
  });

const filtered = data
  .filter((log) => {
    const matchesSearch = log.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || log.status === status;
    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const groupedLogs = filtered.reduce<Record<string, ActivityLog[]>>((acc, log) => {
  const date = new Date(log.created_at);
  const key = formatDateHeader(date);

  if (!acc[key]) acc[key] = [];
  acc[key].push(log);

  return acc;
}, {});


  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity Log & Audit Trail</h1>
          <p className="text-sm text-muted-foreground">
            Track your account actions, listing updates, and security events
          </p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      {/* filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search logs by keyword..."
          value={search}
          onChange={(e:any) => setSearch(e.target.value)}
        />
        {/* <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select> */}
        <select name="status" id="status">
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="info">Info</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* activity list */}
        <div className="lg:col-span-2 space-y-6">
  {Object.entries(groupedLogs).map(([dateLabel, logs]) => (
    <div key={dateLabel} className="space-y-4">
      {/* Date Header */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span>{dateLabel}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Logs */}
      {logs.map((log) => {
        const Icon = statusConfig[log.status || "info"].icon;
        const DeviceIcon = deviceIcon(log.device);

        return (
          <Card key={log.id}>
            <CardContent className="p-4 flex gap-4">
              <Icon className={`h-5 w-5 mt-1 ${statusConfig[log.status || "info"].color}`} />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                  </div>
                  <Badge variant="outline">
                    {statusConfig[log.status || "info"].badge}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <DeviceIcon className="h-3 w-3" /> {log.device}
                  </span>
                  <span className="capitalize">{log.user_role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  ))}
</div>


        {/* right sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" /> Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>MacBook Pro · Chrome</span>
                <Badge className="bg-green-600">current</Badge>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>iPhone 15 · Safari</span>
                {/* <Button size="sm" className="text-red-500 px-0">Terminate</Button> */}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">View All Sessions</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Security Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div>
                <p className="text-2xl font-semibold">42</p>
                <p className="text-xs text-muted-foreground">Actions (30d)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-red-600">1</p>
                <p className="text-xs text-muted-foreground">Blocked</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

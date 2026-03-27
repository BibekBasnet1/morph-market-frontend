import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { OrderService, type OwnOrder } from "../../lib/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { ChevronLeft, ChevronRight, PackageOpen, Search, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import Select from "../../components/ui/select";
import { useDebounce } from "../../hooks/useDebounce";

const MyOrder = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All statuses" },
      { value: "pending_payment", label: "Pending payment" },
      { value: "paid", label: "Paid" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "canceled", label: "Canceled" },
      { value: "cancelled", label: "Cancelled" },
      { value: "refunded", label: "Refunded" },
      { value: "payment_failed", label: "Payment failed" },
    ],
    []
  );

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["own-orders", page, debouncedSearch, status],
    queryFn: () =>
      OrderService.getOwnOrders(page, {
        search: debouncedSearch.trim() || undefined,
        status: status || undefined,
      }),
  });

  const ordersData = orders?.data?.data || [];
  const currentPage = orders?.data?.current_page ?? page;
  const lastPage = orders?.data?.last_page ?? 1;
  const total = orders?.data?.total ?? ordersData.length;
  const pageSize = orders?.data?.per_page ?? 10;
  const from = orders?.data?.from ?? (ordersData.length ? (currentPage - 1) * pageSize + 1 : 0);
  const to = orders?.data?.to ?? (ordersData.length ? from + ordersData.length - 1 : 0);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoneyFromCents = (value: number) => {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n / 100);
  };

  const orderTotalCents = (o: OwnOrder) =>
    (o.items || []).reduce((sum, it) => sum + (Number(it.total) || 0), 0);

  const itemsCount = (o: OwnOrder) =>
    (o.items || []).reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);

  const itemsLabel = (o: OwnOrder) => {
    const names = (o.items || [])
      .map((it) => it.product?.name)
      .filter((v): v is string => Boolean(v));
    if (!names.length) return "—";
    const first = names[0]!;
    const remaining = Math.max(0, names.length - 1);
    return remaining ? `${first} +${remaining}` : first;
  };

  const statusBadge = (statusValue?: string) => {
    const s = (statusValue || "").toLowerCase();
    if (s === "paid") {
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          Paid
        </Badge>
      );
    }
    if (s === "shipped") {
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
          Shipped
        </Badge>
      );
    }
    if (s === "delivered") {
      return (
        <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300">
          Delivered
        </Badge>
      );
    }
    if (s === "processing") {
      return (
        <Badge className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300">
          Processing
        </Badge>
      );
    }
    if (s === "pending_payment") {
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          Pending payment
        </Badge>
      );
    }
    if (s === "canceled" || s === "cancelled") {
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          Canceled
        </Badge>
      );
    }
    if (s === "refunded") {
      return (
        <Badge className="border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/40 dark:bg-teal-950/40 dark:text-teal-300">
          Refunded
        </Badge>
      );
    }
    if (s === "payment_failed") {
      return (
        <Badge className="border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          Payment failed
        </Badge>
      );
    }
    const label = s.replaceAll("_", " ").trim() || "—";
    return (
      <Badge className="border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 sm:px-6 py-8">
      <div className="mx-auto space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track every purchase you’ve made.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge className="border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {total} total
            </Badge>
          </div>
        </div>

        <Card className="border-gray-200/70 dark:border-gray-800 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold dark:text-white">All Orders</CardTitle>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {ordersData.length ? (
                  <span>
                    Showing {from}–{to} of {total}
                  </span>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by order number..."
                  className="h-11 pl-9 pr-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="md:col-span-4">
                <Select
                  searchable={false}
                  value={status}
                  onChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                  options={statusOptions}
                  className="bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 dark:bg-gray-900 dark:text-white">
                      <TableHead className="whitespace-nowrap">Order Number</TableHead>
                      <TableHead className="whitespace-nowrap">Items</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Qty</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Total</TableHead>
                      <TableHead className="hidden lg:table-cell whitespace-nowrap">Order Date</TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">Ship To</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-56" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-44" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Failed to load orders</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Try refreshing the page.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : ordersData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3">
                              <PackageOpen className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No orders yet</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md">
                              Once you place an order, it will appear here.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersData.map((o: OwnOrder) => (
                        <TableRow
                          key={o.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                        >
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                            {o.order_number}
                          </TableCell>
                          <TableCell className="text-gray-800 dark:text-gray-200">
                            <div className="min-w-0">
                              <div className="truncate font-medium">{itemsLabel(o)}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {o.items?.length ? `${o.items.length} item line${o.items.length === 1 ? "" : "s"}` : "—"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-gray-700 dark:text-gray-300">
                            {itemsCount(o)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">
                            {formatMoneyFromCents(orderTotalCents(o))}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {formatDate(o.order_date)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-400">
                            <div className="min-w-0">
                              <div className="truncate">{o.shipping_address?.line1 ?? "—"}</div>
                              <div className="truncate text-xs mt-0.5">{o.shipping_address?.city ?? "—"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{statusBadge(o.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page <span className="font-semibold text-gray-900 dark:text-gray-100">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">{lastPage}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1 || isLoading}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={currentPage >= lastPage || isLoading}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOrder;

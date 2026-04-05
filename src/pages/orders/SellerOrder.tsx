import { useQuery } from "@tanstack/react-query";
import { OrderService, type Order } from "../../lib/api/orders";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { ChevronLeft, ChevronRight, Eye, PackageOpen, Search, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import Select from "../../components/ui/select";
import { useDebounce } from "../../hooks/useDebounce";
import { Modal } from "../../components/ui/modal";

const SellerOrder = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All statuses" },
      { value: "pending_payment", label: "Pending payment" },
      { value: "paid", label: "Paid" },
      { value: "shipped", label: "Shipped" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["seller-orders", page, debouncedSearch, status],
    queryFn: () =>
      OrderService.getCustomerOrders(page, {
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

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
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
    if (s === "pending_payment") {
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
          Pending payment
        </Badge>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          Cancelled
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

  const qtyBadge = (qty?: number | string) => {
    const n = Number(qty);
    if (qty == null || isNaN(n)) return <span className="text-gray-400">—</span>;

    if (n <= 2) {
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 tabular-nums min-w-[2rem] justify-center">
          {n}
        </Badge>
      );
    }
    if (n <= 5) {
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300 tabular-nums min-w-[2rem] justify-center">
          {n}
        </Badge>
      );
    }
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300 tabular-nums min-w-[2rem] justify-center">
        {n}
      </Badge>
    );
  };

  const orderDisplayTotal = (o: Order) =>
    o.order_total_formatted ?? o.total_formatted ?? "—";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 sm:px-6 py-8">
      <div className="mx-auto space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Orders
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage customer orders for your listings.
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
                    onClick={() => setSearch("")}
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
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="hidden md:table-cell whitespace-nowrap">Email</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Items</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Total</TableHead>
                    <TableHead className="hidden lg:table-cell whitespace-nowrap">Order Date</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-56" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Failed to load orders</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Try refreshing the page.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : ordersData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3">
                            <PackageOpen className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No orders yet</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md">
                            When customers place orders for your products, they'll show up here.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ordersData.map((o: Order) => (
                      <TableRow
                        key={o.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {o.order_number}
                        </TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">
                          <div className="min-w-0">
                            <div className="truncate font-medium">{o.customer?.name ?? "—"}</div>
                            <div className="md:hidden text-xs text-gray-500 dark:text-gray-400 truncate">
                              {o.customer?.email ?? "—"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-400">
                          {o.customer?.email ?? "—"}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            {qtyBadge(o.item_count)}
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100">
                          {orderDisplayTotal(o)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(o.order_date)}
                        </TableCell>
                        <TableCell>{statusBadge(o.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setViewOrder(o)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                        </TableCell>
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

        <Modal
          isOpen={viewOrder != null}
          onClose={() => setViewOrder(null)}
          className="max-w-2xl rounded-2xl"
        >
          {viewOrder && (
            <div className="p-6 sm:p-8 pt-12 sm:pt-14">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Order details
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 font-mono">
                  {viewOrder.order_number}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {statusBadge(viewOrder.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(viewOrder.order_date)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/40 p-4 mb-6">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Customer
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{viewOrder.customer?.name ?? "—"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{viewOrder.customer?.email ?? "—"}</p>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Order total</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {orderDisplayTotal(viewOrder)}
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Items</p>
              {viewOrder.items && viewOrder.items.length > 0 ? (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80 dark:bg-gray-900 hover:bg-gray-50/80 dark:hover:bg-gray-900">
                        <TableHead className="text-white">Product</TableHead>
                        <TableHead className="text-right w-20 text-white">Qty</TableHead>
                        <TableHead className="text-right hidden sm:table-cell text-white">Unit</TableHead>
                        <TableHead className="text-right text-white">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items.map((line) => (
                        <TableRow key={line.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            <div className="min-w-0">
                              <div className="truncate">{line.product_name ?? `Product #${line.product_id}`}</div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              {qtyBadge(line.quantity)}
                            </div>
                          </TableCell>

                          <TableCell className="text-right hidden sm:table-cell text-gray-700 dark:text-gray-300 tabular-nums">
                            {line.price_formatted ?? "—"}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                            {line.total_formatted ?? line.subtotal_formatted ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 py-6 text-center rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                  No items in this response.
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SellerOrder;

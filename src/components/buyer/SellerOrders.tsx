import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrderService, type Order } from "../../lib/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  AlertCircle,
  ReceiptText,
  ArrowRight,
} from "lucide-react";
import Spinner from "../../components/ui/spinner";
import { useNavigate } from "react-router-dom";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
const formatCurrency = (value: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    parseFloat(value)
  );

// ─── Status Config ────────────────────────────────────────────────────────────

type StatusKey =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const statusConfig: Record<
  StatusKey,
  { label: string; color: string; bg: string; border: string; Icon: React.ElementType }
> = {
  pending_payment: {
    label: "Pending Payment",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    Icon: CreditCard,
  },
  paid: {
    label: "Paid",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    Icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    Icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    Icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    Icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    Icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    color: "text-gray-700 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-900/20",
    border: "border-gray-200 dark:border-gray-700",
    Icon: AlertCircle,
  },
};

const getStatusConfig = (status: string) =>
  statusConfig[status as StatusKey] ?? {
    label: status.replace(/_/g, " "),
    color: "text-gray-700 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
    Icon: Package,
  };

// ─── Order Total ──────────────────────────────────────────────────────────────

const getOrderTotal = (order: Order) => {
  const total = order.items.reduce((sum, item) => sum + parseFloat(item.total), 0);
  return formatCurrency(total.toString());
};

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const { label, color, bg, border, Icon } = getStatusConfig(order.status);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${border}`}>
      {/* Header */}
      <div className={`px-5 py-4 ${bg}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <ReceiptText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {order.order_number}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatDate(order.order_date)} at {formatTime(order.order_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${color} ${bg} border ${border}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          </div>
        </div>

        {/* Summary Row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 dark:border-white/5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {getOrderTotal(order)}
          </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full px-5 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-1 border-t border-gray-100 dark:border-gray-700"
      >
        {expanded ? "Hide items" : "View items"}
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            expanded ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {/* Items */}
      {expanded && (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/60 bg-white dark:bg-gray-800/30">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="px-5 py-3 flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Product #{item.product_id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatCurrency(item.price)}
                    {parseFloat(item.tax) > 0 && (
                      <span className="ml-2 text-gray-400">
                        +{formatCurrency(item.tax)} tax
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100 flex-shrink-0">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, lastPage, total, from, to, onPageChange }: PaginationProps) => (
  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Showing {from}–{to} of {total} orders
    </p>
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
        {currentPage} / {lastPage}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const SellerOrders = () => {
  const [page, setPage] = useState(1);
const navigate = useNavigate();


  const { data, isLoading, error } = useQuery({
    queryKey: ["buyer-orders", page],
    queryFn: () => OrderService.getSellerOrders(page),
    placeholderData: (prev) => prev,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className=" mx-auto h-full">
      <Card className="border border-gray-200 h-full bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex justify-between dark:text-gray-300 items-center gap-2">
            <div className="flex gap-2 items-center">

            <ShoppingBag className="w-5 h-5" />
            My Orders
            </div>
                        <Button
              variant="ghost"
              size="sm"
              className="text-sm w-[100px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => navigate("/orders")}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            
          </CardTitle>
{meta && (
              <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                {meta.total} total
              </span>
            )}
        </CardHeader>

        <CardContent className="pt-6">
          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Spinner />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load orders</p>
              <p className="text-sm text-gray-500">Please try again later.</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-300">No orders yet</p>
              <p className="text-sm text-gray-400">Your orders will appear here once placed.</p>
            </div>
          )}

          {/* Orders List */}
          {!isLoading && !error && orders.length > 0 && (
            <>
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <Pagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  total={meta.total}
                  from={(meta.current_page - 1) * meta.per_page + 1}
                  to={Math.min(meta.current_page * meta.per_page, meta.total)}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerOrders;
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { FilterState, PaginationState } from "../../../types";
import { DataTable } from "../../../components/common/DataTable";
import { Input } from "../../../components/ui/input";
import Select from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Search, Eye, Store as StoreIcon } from "lucide-react";
import type { ColumnDef } from "../../../components/common/DataTable";
import Spinner from "../../../components/ui/spinner";
import type { User } from "../../../types/SellerOrBuyers";
import { BuyerOrSellerList } from "../../../lib/api/buyerandseller";

const SellersListPage = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      header: "Seller",
      render: (seller) => (
        <div className="dark:text-white">
          <p className="font-medium">{seller.name}</p>
          <p className="text-sm text-muted-foreground">{seller.email}</p>
        </div>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (seller) => (
        <span className="text-sm dark:text-white">@{seller.username}</span>
      ),
    },
    {
      key: "stores",
      header: "Stores",
      render: (seller) => {
        const storeCount = seller.stores?.length || 0;
        const activeStores = seller.stores?.filter(s => s.is_active).length || 0;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{activeStores}/{storeCount}</span>
            <span className="text-xs text-muted-foreground">active</span>
          </div>
        );
      },
    },
    {
      key: "verification",
      header: "Store Status",
      render: (seller) => {
        const verifiedStores = seller.stores?.filter(s => s.is_verified).length || 0;
        const totalStores = seller.stores?.length || 0;

        if (totalStores === 0) {
          return <Badge variant="secondary">No Stores</Badge>;
        }

        if (verifiedStores === totalStores) {
          return <Badge variant="default">All Verified</Badge>;
        }

        if (verifiedStores > 0) {
          return <Badge variant="outline">{verifiedStores}/{totalStores} Verified</Badge>;
        }

        return <Badge variant="secondary">Pending</Badge>;
      },
    },
    {
      key: "total_sales",
      header: "Total Sales",
      render: (seller) => {
        const totalSales = seller.stores?.reduce((sum, store) => sum + (store.total_sales || 0), 0) || 0;
        return <span className="font-medium">{totalSales}</span>;
      },
    },
    {
      key: "rating",
      header: "Avg Rating",
      render: (seller) => {
        const stores = seller.stores || [];
        if (stores.length === 0) return <span className="text-muted-foreground">-</span>;

        const totalRating = stores.reduce((sum, store) => sum + parseFloat(store.rating || '0'), 0);
        const avgRating = (totalRating / stores.length).toFixed(1);

        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{avgRating}</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
        );
      },
    },
    {
      key: "email_verified",
      header: "Email",
      render: (seller) => (
        <Badge variant={seller.email_verified ? "default" : "secondary"} className="text-xs">
          {seller.email_verified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      render: (seller) => new Date(seller.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (seller) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${seller.id}/review`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {seller.stores && seller.stores.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/admin/sellers/${seller.id}/stores`)}
            >
              <StoreIcon className="h-4 w-4 mr-1" />
              Stores
            </Button>
          )}
        </div>
      ),
    },
  ];

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await BuyerOrSellerList.getBuyerOrSeller('seller');
      return response.data;
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { filteredSellers, paginatedSellers } = useMemo(() => {
    if (!data?.data) {
      return { filteredSellers: [], paginatedSellers: [] };
    }

    let result = data.data;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (seller) =>
          seller.name.toLowerCase().includes(search) ||
          seller.email.toLowerCase().includes(search) ||
          seller.username.toLowerCase().includes(search)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((seller) => {
        if (filters.status === "active") {
          return seller.stores?.some(s => s.is_verified) || false;
        }
        if (filters.status === "inactive") {
          return !seller.stores?.some(s => s.is_verified);
        }
        return true;
      });
    }

    const paginated = result.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    );

    return { filteredSellers: result, paginatedSellers: paginated };
  }, [data, filters, pagination.page, pagination.pageSize]);

  const updatedPagination = useMemo(
    () => ({
      ...pagination,
      total: filteredSellers.length,
    }),
    [pagination.page, pagination.pageSize, filteredSellers.length]
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (isError) {
    return (
      <div className="space-y-6 dark:text-white">
        <div>
          <h1 className="text-3xl font-bold">Sellers</h1>
          <p className="text-muted-foreground">Manage and view all sellers</p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-medium">Error loading sellers</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Sellers</h1>
        <p className="text-muted-foreground">Manage and view all sellers</p>
      </div>

      {/* Stats Cards (Optional) */}
      {!isLoading && data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Sellers</p>
            <p className="text-2xl font-bold">{data.data.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Active Stores</p>
            <p className="text-2xl font-bold">
              {data.data.reduce((sum, seller) =>
                sum + (seller.stores?.filter(s => s.is_active && s.is_verified).length || 0), 0
              )}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold">
              {data.data.reduce((sum, seller) =>
                sum + (seller.stores?.reduce((s, store) => s + store.total_sales, 0) || 0), 0
              )}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Pending Verification</p>
            <p className="text-2xl font-bold">
              {data.data.reduce((sum, seller) =>
                sum + (seller.stores?.filter(s => !s.is_verified && s.is_draft).length || 0), 0
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-[180px]">
          <Select
            placeholder="Status"
            defaultValue="all"
            options={[
              { value: "all", label: "All Sellers" },
              { value: "active", label: "Active (Verified)" },
              { value: "inactive", label: "Inactive/Pending" },
            ]}
            onChange={(value) => handleFilterChange("status", value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <DataTable
          data={paginatedSellers as any}
          columns={columns as any}
          isLoading={false}
          pagination={updatedPagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default SellersListPage;
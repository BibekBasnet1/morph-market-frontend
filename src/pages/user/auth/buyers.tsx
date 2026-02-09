import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { FilterState, PaginationState } from "../../../types";
import { DataTable } from "../../../components/common/DataTable";
import { Input } from "../../../components/ui/input";
import Select from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Search, Eye, UserCheck } from "lucide-react";
import type { ColumnDef } from "../../../components/common/DataTable";
import Spinner from "../../../components/ui/spinner";
import type { User } from "../../../types/SellerOrBuyers";
import { BuyerOrSellerList } from "../../../lib/api/buyerandseller";
import { useMemo } from "react";

const BuyersListPage = () => {
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
      header: "Name",
      render: (user) => (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "username",
      header: "Username",
      render: (user) => user.username,
    },
    {
      key: "stores",
      header: "Store Applications",
      render: (user) => {
        const storeCount = user.stores?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <span>{storeCount}</span>
            {storeCount > 0 && (
              <Badge variant="default" className="text-xs">
                Applied
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "email_verified",
      header: "Verified",
      render: (user) => (
        <Badge variant={user.email_verified ? "default" : "secondary"}>
          {user.email_verified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Joined",
      render: (user) => new Date(user.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`${user.id}/review`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {user.stores && user.stores.length > 0 && (
            <Button
              variant="default" // ✅ Changed from 'primary' to 'default'
              size="sm"
              onClick={() => navigate(`/admin/buyers/${user.id}/review?action=convert`)}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Convert
            </Button>
          )}
        </div>
      ),
    },
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['buyers'],
    queryFn: async () => {
      const response = await BuyerOrSellerList.getBuyerOrSeller('buyer');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { filteredBuyers, paginatedBuyers } = useMemo(() => {
    if (!data?.data) {
      return { filteredBuyers: [], paginatedBuyers: [] };
    }

    let result = data.data;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (buyer) =>
          buyer.name.toLowerCase().includes(search) ||
          buyer.email.toLowerCase().includes(search) ||
          buyer.username.toLowerCase().includes(search)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((buyer) => {
        if (filters.status === "active") return buyer.email_verified;
        if (filters.status === "inactive") return !buyer.email_verified;
        return true;
      });
    }

    const paginated = result.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    );

    return { filteredBuyers: result, paginatedBuyers: paginated };
  }, [data, filters, pagination.page, pagination.pageSize]);

  const updatedPagination = useMemo(
    () => ({
      ...pagination,
      total: filteredBuyers.length,
    }),
    [pagination.page, pagination.pageSize, filteredBuyers.length]
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Buyers</h1>
          <p className="text-muted-foreground">Manage and view all buyers</p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-medium">Error loading buyers</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buyers</h1>
        <p className="text-muted-foreground">Manage and view all buyers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buyers..."
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
              { value: "all", label: "All Status" },
              { value: "active", label: "Verified" },
              { value: "inactive", label: "Unverified" },
            ]}
            onChange={(value) => handleFilterChange("status", value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <DataTable
          data={paginatedBuyers}
          columns={columns}
          isLoading={false}
          pagination={updatedPagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default BuyersListPage;
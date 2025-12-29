import { useEffect, useState } from "react";
import { generateMockSellers, mockApiDelay } from "../../../lib/mockData";
import type { Seller, FilterState, PaginationState } from "../../../types";
import { DataTable } from "../../../components/common/DataTable";
import { Input } from "../../../components/ui/input";
import Select from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Search } from "lucide-react";
import type { ColumnDef } from "../../../components/common/DataTable";
import Spinner from "../../../components/ui/spinner";

const columns: ColumnDef<Seller>[] = [
  {
    key: "name",
    header: "Seller",
    render: (seller) => (
      <div>
        <p className="font-medium">{seller.name}</p>
        <p className="text-sm text-muted-foreground">{seller.email}</p>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (seller) => seller.phone,
  },
  {
    key: "totalSales",
    header: "Sales",
    render: (seller) => seller.totalSales,
  },
//   {
//     key: "totalEarned",
//     header: "Total Earned",
//     render: (seller) => `$${seller.totalEarned.toLocaleString()}`,
//   },
  {
    key: "status",
    header: "Status",
    render: (seller) => (
      <Badge
        variant={
          seller.status === "active"
            ? "default"
            : seller.status === "inactive"
            ? "secondary"
            : "destructive"
        }
      >
        {seller.status}
      </Badge>
    ),
  },
  {
    key: "joinedAt",
    header: "Joined",
    render: (seller) =>
      new Date(seller.joinedAt).toLocaleDateString(),
  },
];

const SellersPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      await mockApiDelay(500);
      const data = generateMockSellers(100);
      setSellers(data);
      setFilteredSellers(data);
      setPagination((prev) => ({ ...prev, total: data.length }));
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = sellers;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (seller) =>
          seller.name.toLowerCase().includes(search) ||
          seller.email.toLowerCase().includes(search)
      );
    }

    if (filters.status !== "all") {
      result = result.filter(
        (seller) => seller.status === filters.status
      );
    }

    setFilteredSellers(result);
    setPagination((prev) => ({
      ...prev,
      total: result.length,
      page: 1,
    }));
  }, [filters, sellers]);

  const paginatedSellers = filteredSellers.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sellers</h1>
        <p className="text-muted-foreground">
          Manage and view all sellers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="pl-9"
          />
        </div>

        <div className="w-[180px]">
          <Select
            placeholder="Status"
            defaultValue="all"
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "suspended", label: "Suspended" },
            ]}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value,
              }))
            }
          />
        </div>
      </div>
{isLoading ? (
  <div className="flex h-64 items-center justify-center">
    <Spinner />
  </div>
) : (
  <DataTable
    data={paginatedSellers}
    columns={columns}
    isLoading={false}
    pagination={pagination}
    onPageChange={(page) =>
      setPagination((prev) => ({ ...prev, page }))
    }
  />
)}
    </div>
  );
};

export default SellersPage;

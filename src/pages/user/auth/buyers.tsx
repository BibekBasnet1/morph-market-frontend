import { useEffect, useState } from "react";
import { generateMockBuyers, mockApiDelay } from "../../../lib/mockData";
import type { Buyer, FilterState, PaginationState } from "../../../types";
import { DataTable } from "../../../components/common/DataTable";
import { Input } from "../../../components/ui/input";
import Select from "../../../components/ui/select"; // ✅ your custom Select
import { Badge } from "../../../components/ui/badge";
import { Search } from "lucide-react";
import type { ColumnDef } from "../../../components/common/DataTable";
import Spinner from "../../../components/ui/spinner";

const columns: ColumnDef<Buyer>[] = [
  {
    key: "name",
    header: "Name",
    render: (buyer) => (
      <div>
        <p className="font-medium">{buyer.name}</p>
        <p className="text-sm text-muted-foreground">{buyer.email}</p>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (buyer) => buyer.phone,
  },
  {
    key: "totalOrders",
    header: "Orders",
    render: (buyer) => buyer.totalOrders,
  },
  {
    key: "totalSpent",
    header: "Total Spent",
    render: (buyer) => `$${buyer.totalSpent.toLocaleString()}`,
  },
  {
    key: "status",
    header: "Status",
    render: (buyer) => (
      <Badge
        variant={
          buyer.status === "active"
            ? "default"
            : buyer.status === "inactive"
            ? "secondary"
            : "destructive"
        }
      >
        {buyer.status}
      </Badge>
    ),
  },
  {
    key: "joinedAt",
    header: "Joined",
    render: (buyer) => new Date(buyer.joinedAt).toLocaleDateString(),
  },
];

const BuyersPage = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]);
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
      const data = generateMockBuyers(100);
      setBuyers(data);
      setFilteredBuyers(data);
      setPagination((prev) => ({ ...prev, total: data.length }));
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = buyers;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (buyer) =>
          buyer.name.toLowerCase().includes(search) ||
          buyer.email.toLowerCase().includes(search)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((buyer) => buyer.status === filters.status);
    }

    setFilteredBuyers(result);
    setPagination((prev) => ({
      ...prev,
      total: result.length,
      page: 1,
    }));
  }, [filters, buyers]);

  const paginatedBuyers = filteredBuyers.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buyers</h1>
        <p className="text-muted-foreground">
          Manage and view all buyers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buyers..."
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

        {/* ✅ Custom Select */}
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
{/* Data Table */}
{isLoading ? (
  <div className="flex h-64 items-center justify-center">
    <Spinner />
  </div>
) : (
  <DataTable
    data={paginatedBuyers}
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

export default BuyersPage;

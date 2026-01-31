import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { DataTable } from "../../components/common/DataTable";
import type { ColumnDef } from "../../components/common/DataTable";
import type { InventoryItem, Product, ProductFilters } from "../../types";
import { InventoryService } from "../../lib/api";
import { CategoryService } from "../../lib/api";
import { GenderService } from "../../lib/api/attributes/gender";
import { MaturityService } from "../../lib/api/attributes/maturity";
import { OriginService } from "../../lib/api/attributes/origin";
import { DietService } from "../../lib/api/attributes/diet";
import { ProductService } from "../../lib/api/products";
import { Badge } from "../../components/ui/badge";
import Spinner from "../../components/ui/spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Switch from "../../components/ui/switch";
import Select from "../../components/ui/select";
import { Card, CardContent } from "../../components/ui/card";
import { MoreVertical, Plus, Filter, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

const InventoryPage = () => {
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: inventoriesRaw, isLoading } = useQuery({
    queryKey: ["inventories"],
    queryFn: InventoryService.getAll,
  });

  // The API can return either an array or a pagination wrapper: { data: [...] }
  let inventoryList: InventoryItem[] = [];

  if (Array.isArray(inventoriesRaw)) {
    inventoryList = inventoriesRaw as InventoryItem[];
  } else if (inventoriesRaw && Array.isArray((inventoriesRaw as any).data)) {
    inventoryList = (inventoriesRaw as any).data as InventoryItem[];
  }

  // Ensure `id` is a string for keying and consistency
  const normalized = inventoryList.map((it) => ({ ...(it as any), id: String((it as any).id) })) as InventoryItem[];

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAllPublic,
  });

  const { data: genders = [] } = useQuery({
    queryKey: ["genders"],
    queryFn: GenderService.getAllPublic,
  });

  const { data: maturities = [] } = useQuery({
    queryKey: ["maturities"],
    queryFn: MaturityService.getAllPublic,
  });

  const { data: origins = [] } = useQuery({
    queryKey: ["origins"],
    queryFn: OriginService.getAllPublic,
  });

  const { data: diets = [] } = useQuery({
    queryKey: ["diets"],
    queryFn: DietService.getAllPublic,
  });

const updateProductMutation = useMutation({
  mutationFn: async ({ item, active }: { item: InventoryItem; active: boolean }) => {
    const formData = new FormData();

    // Required fields for inventory update
    formData.append("store_id", String((item as any).store_id || ""));
    formData.append("product_id", String(item.product?.id || ""));
    formData.append("price", String((item as any).price || item.product?.price || 0));
    formData.append("stock", String((item as any).stock || 0));
    formData.append("active", active ? "1" : "0");

    return InventoryService.update(item.id, formData);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["inventories"] });
  },
});



  const [isAdvancedView, setIsAdvancedView] = useState(false);

  const [filters, setFilters] = useState<ProductFilters>({});
  const debouncedSearch = useDebounce(filters.search, 1000);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const updateFilters = (payload: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...payload }));
  };

  const clearFilters = () => setFilters({});

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );



  const filtered = useMemo(() => {
    let result = normalized;

    // Apply search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((it) => {
        return (
          String(it.product?.name ?? "").toLowerCase().includes(q) ||
          String((it as any).sku ?? "").toLowerCase().includes(q) ||
          String(it.product?.category?.name ?? "").toLowerCase().includes(q)
        );
      });
    }

    // Apply category filter
    if (filters.category_id) {
      result = result.filter((it) => it.product?.category?.id === filters.category_id);
    }

    // Apply gender filter
    if (filters.gender_id) {
      result = result.filter((it) => it.product?.gender?.id === filters.gender_id);
    }

    // Apply maturity filter
    if (filters.maturity_level_id) {
      result = result.filter((it) => it.product?.maturity_level?.id === filters.maturity_level_id);
    }

    if (filters.origin_id) {
      result = result.filter((it) => it.product?.origin?.id === filters.origin_id);
    }

    // Apply diet filter
    if (filters.diet_id) {
      result = result.filter((it) => it.product?.diet?.id === filters.diet_id);
    }

    // Apply price filters
    if (filters.price_min !== undefined) {
      result = result.filter((it) => {
        const price = (it as any).sale_price || (it as any).price || it.product?.price;
        return price && Number(price) >= filters.price_min!;
      });
    }

    if (filters.price_max !== undefined) {
      result = result.filter((it) => {
        const price = (it as any).sale_price || (it as any).price || it.product?.price;
        return price && Number(price) <= filters.price_max!;
      });
    }

    return result;
  }, [normalized, debouncedSearch, filters]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const totalItems = normalized.length;
  const available = normalized.filter((it) => (it as any).active).length;
  const recentlySold = normalized.filter((it) => (it as any).status === "sold" || !(it as any).active).length;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Inventory
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your active listings and reptile collection.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="text-gray-900 dark:text-gray-100" variant="ghost" size="sm" onClick={() => setIsAdvancedView((v) => !v)}>
            {isAdvancedView ? "Card View" : "Advanced View"}
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/add-listing')}>
            <Plus className="mr-2" /> Add New Listing
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4
                dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalItems}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+12 this month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4
                dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{available}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{Math.round((available / Math.max(1, totalItems)) * 100)}% of total inventory</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4
                dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Recently Sold</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{recentlySold}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Last 7 days</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 bg-white
                 dark:border-gray-700 dark:bg-gray-900">
        <CardContent className="p-4 space-y-4">

          {/* Primary Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search products..."
              className="w-full md:w-72"
              value={filters.search ?? ""}
              onChange={(e) =>
                updateFilters({ search: e.target.value || undefined })
              }
            />

            <Select
              placeholder="Category"
              options={categories.map((c: any) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              value={filters.category_id?.toString() ?? ""}
              onChange={(v) => updateFilters({ category_id: v ? Number(v) : undefined })}
            />

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                className="w-24"
                value={filters.price_min ?? ""}
                onChange={(e) =>
                  updateFilters({
                    price_min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max price"
                className="w-24"
                value={filters.price_max ?? ""}
                onChange={(e) =>
                  updateFilters({
                    price_max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              More filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-white px-2 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showMoreFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-4">
              <Select
                placeholder="Gender"
                options={genders.map((g: any) => ({
                  value: g.id.toString(),
                  label: g.name,
                }))}
                value={filters.gender_id?.toString() ?? ""}
                onChange={(v) => updateFilters({ gender_id: v ? Number(v) : undefined })}
              />

              <Select
                placeholder="Maturity"
                options={maturities.map((m: any) => ({
                  value: m.id.toString(),
                  label: m.name,
                }))}
                value={filters.maturity_level_id?.toString() ?? ""}
                onChange={(v) => updateFilters({ maturity_level_id: v ? Number(v) : undefined })}
              />

              <Select
                placeholder="Origin"
                options={origins.map((o: any) => ({
                  value: o.id.toString(),
                  label: o.name,
                }))}
                value={filters.origin_id?.toString() ?? ""}
                onChange={(v) =>
                  updateFilters({ origin_id: v ? Number(v) : undefined })
                }
              />

              <Select
                placeholder="Diet"
                options={diets.map((d: any) => ({
                  value: d.id.toString(),
                  label: d.name,
                }))}
                value={filters.diet_id?.toString() ?? ""}
                onChange={(v) =>
                  updateFilters({ diet_id: v ? Number(v) : undefined })
                }
              />

              <Button
                variant="ghost"
                className="md:col-span-4 justify-self-end"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex dark:text-gray-100 flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            let displayValue = value;

            // Map filter keys to corresponding options arrays
            switch (key) {
              case "category_id":
                displayValue = categories.find(c => c.id === value)?.name ?? value;
                break;
              case "gender_id":
                displayValue = genders.find(g => g.id === value)?.name ?? value;
                break;
              case "maturity_level_id":
                displayValue = maturities.find(m => m.id === value)?.name ?? value;
                break;
              case "origin_id":
                displayValue = origins.find(o => o.id === value)?.name ?? value;
                break;
              case "diet_id":
                displayValue = diets.find(d => d.id === value)?.name ?? value;
                break;
              default:
                displayValue = value;
            }

            return (
              <span
                key={key}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-muted"
              >
                {key.replace("_", " ")}: {displayValue}
                <button onClick={() => updateFilters({ [key]: undefined })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Listings or Table */}
      <div className="dark:text-white">
        {isAdvancedView ? (
          <DataTable data={filtered} columns={(
            [
              {
                key: "product",
                header: "Product",
                render: (item: InventoryItem) => (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.product?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-800
                          flex items-center justify-center
                          text-xs text-gray-500 dark:text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product?.description}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "price",
                header: "Price",
                render: (item: InventoryItem) => {
                  const price = (item as any).sale_price || (item as any).price || item.product?.price;
                  return price ? `$${Number(price).toLocaleString()}` : "N/A";
                },
              },
              {
                key: "status",
                header: "Status",
                render: (item: InventoryItem) => (
                  <Badge variant={(item as any).active ? "default" : "destructive"}>{(item as any).active ? "Available" : "Unavailable"}</Badge>
                ),
              },
              {
                key: "visibility",
                header: "Visibility",
                render: (item: InventoryItem) => ((item as any).visibility ? (item as any).visibility : "private"),
              },
            ] as ColumnDef<InventoryItem>[]
          )} />
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No listings found</div>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-md border
                border-gray-200 bg-white p-4
                dark:border-gray-700 dark:bg-gray-900">
                  <div className="w-28 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.product?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.product?.name}</p>
                       <p className="text-sm text-gray-600 dark:text-gray-400">ID: {(item as any).sku ?? `BP-${item.id}`}{(item.product?.category?.name) ? ` • ${item.product.category?.name}` : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{((item as any).sale_price || (item as any).price) ? `$${Number((item as any).sale_price || (item as any).price).toLocaleString()}` : '—'}</p>
                        <div className="mt-2 flex items-center gap-3 justify-end">
                          <Badge variant={(item as any).active ? 'default' : 'destructive'}>{(item as any).active ? 'AVAILABLE' : 'SOLD'}</Badge>
                          <Switch
                            checked={Boolean((item as any).active)}
                            disabled={updateProductMutation.isPending}
                            onChange={(checked) => {
                              updateProductMutation.mutate({
                                item: item,
                                active: checked,
                              });
                            }}
                          />
                          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                            <MoreVertical />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
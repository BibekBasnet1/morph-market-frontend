import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Select from "../components/ui/select";

import { ProductService } from "../lib/api/products";
import { CategoryService } from "../lib/api";
import { GenderService } from "../lib/api/attributes/gender";
import { MaturityService } from "../lib/api/attributes/maturity";
import { OriginService } from "../lib/api/attributes/origin";
import { DietService } from "../lib/api/attributes/diet";
import type { ProductFilters } from "../types";
import { useDebounce } from "../hooks/useDebounce";


/* ----------------------------- Component ----------------------------- */

const AllProductsPage = () => {
const [filters, setFilters] = useState<ProductFilters>({});
const debouncedSearch = useDebounce(filters.search, 1000);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [page, setPage] = useState(1);

  const updateFilters = (payload: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...payload }));
  };

  const clearFilters = () => setFilters({});

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  /* ----------------------------- Queries ----------------------------- */

const {
  data,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ["products", page, { ...filters, search: debouncedSearch }],
  queryFn: () =>
    ProductService.getAll({
      page,
       filters: { ...filters, search: debouncedSearch },
    }),
    placeholderData: (prev) => prev,
    enabled: debouncedSearch !== undefined,
});

const products = data?.data ?? [];
// const lastPage = data?.last_page ?? 1;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const { data: genders = [] } = useQuery({
    queryKey: ["genders"],
    queryFn: GenderService.getAll,
  });

  const { data: maturities = [] } = useQuery({
    queryKey: ["maturities"],
    queryFn: MaturityService.getAll,
  });

  const { data: origins = [] } = useQuery({
    queryKey: ["origins"],
    queryFn: OriginService.getAll,
  });

  const { data: diets = [] } = useQuery({
    queryKey: ["diets"],
    queryFn: DietService.getAll,
  });

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-12 text-gray-900 dark:text-gray-100">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-sm text-muted-foreground">
          Browse and filter available products
        </p>
      </div>

      {/* Filters */}
      <Card className="dark:border-none">
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
              onChange={(v) =>
                updateFilters({ category_id: Number(v) })
              }
            />

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min price"
                className="w-24"
                onChange={(e) =>
                  updateFilters({
                    price_min: Number(e.target.value) || undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max price"
                className="w-24"
                onChange={(e) =>
                  updateFilters({
                    price_max: Number(e.target.value) || undefined,
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
                onChange={(v) =>
                  updateFilters({ gender_id: Number(v) })
                }
              />

              <Select
                placeholder="Maturity"
                options={maturities.map((m: any) => ({
                  value: m.id.toString(),
                  label: m.name,
                }))}
                onChange={(v) =>
                  updateFilters({ maturity_level_id: Number(v) })
                }
              />

              <Select
                placeholder="Origin"
                options={origins.map((o: any) => ({
                  value: o.id.toString(),
                  label: o.name,
                }))}
                onChange={(v) =>
                  updateFilters({ origin_id: Number(v) })
                }
              />

              <Select
                placeholder="Diet"
                options={diets.map((d: any) => ({
                  value: d.id.toString(),
                  label: d.name,
                }))}
                onChange={(v) =>
                  updateFilters({ diet_id: Number(v) })
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
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <span
                  key={key}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-muted"
                >
                  {key.replace("_", " ")}: {value}
                  <button onClick={() => updateFilters({ [key]: undefined })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading products...
        </p>
      )}

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: any) => (
          <Card
            key={product.id}
            className="hover:shadow-md transition cursor-pointer dark:border-gray-600"
          >
            <CardContent className="p-4">

              <div className="aspect-video bg-muted rounded mb-3 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm">
                   <img
                    src={"https://placehold.co/600x400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  </div>
                )}
              </div>

              <h3 className="font-medium truncate">{product.name}</h3>

              <p className="text-sm text-muted-foreground">
                {product.category?.name ?? "Uncategorized"}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {product.gender && (
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                    {product.gender.name}
                  </span>
                )}

                {product.diet && (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                    {product.diet.name}
                  </span>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;

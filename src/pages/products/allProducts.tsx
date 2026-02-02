import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Trash2, Edit, Plus, Table as TableIcon, Grid as GridIcon } from "lucide-react";
import { ProductService } from "../../lib/api/products";
import { Modal } from "../../components/ui/modal";

const AllProductsPage = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"card" | "table">("card"); // toggle view

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => ProductService.getAll({ page }),
    placeholderData: (prev) => prev,
  });

  const products = data?.data ?? [];
  const currentPage = data?.current_page ?? 1;
  const lastPage = data?.last_page ?? 1;

  const deleteMutation = useMutation({
    mutationFn: ProductService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  return (
    <div className="space-y-6 p-10 mx-auto text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setView(view === "card" ? "table" : "card")}
          >
            {view === "card" ? <TableIcon className="h-4 w-4 mr-1" /> : <GridIcon className="h-4 w-4 mr-1" />}
            {view === "card" ? "Table View" : "Card View"}
          </Button>
          <Link to="/products/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading products...</p>}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            No products added yet.
          </p>
          <Link to="/products/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </Link>
        </div>
      )}

      {/* Card View */}
      {view === "card" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800">
              <CardContent className="p-4">
                {/* Image */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md mb-3 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Category: {product.category?.name ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Origin: {product.origin?.name ?? "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Diet:{" "}
                    {product?.diet ? (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.diet.name}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.gender && (
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {product.gender.name}
                      </span>
                    )}
                    {product.maturity_level && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.maturity_level.name}
                      </span>
                    )}
                    {product?.tag && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.tag.name}
                      </span>
                    )}
                    {product?.traits && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.traits.map((t: any) => t.name).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link to={`/products/edit/${product.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Origin
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Diet
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Traits
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product: any) => (
                <tr key={product.id}>
                  <td className="px-4 py-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category?.name ?? "N/A"}</td>
                  <td className="px-4 py-2">{product.origin?.name ?? "N/A"}</td>
                  <td className="px-4 py-2">
                    {product?.diet ? (
                      <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {product.diet.name}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {product?.traits?.map((t: any) => t.name).join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <Link to={`/products/edit/${product.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {lastPage}
        </span>

        <Button
          disabled={currentPage === lastPage}
          onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
        >
          Next
        </Button>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        className="max-w-md p-6 bg-white dark:bg-gray-900"
      >
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Delete Product
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this product?
          <br />
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AllProductsPage;

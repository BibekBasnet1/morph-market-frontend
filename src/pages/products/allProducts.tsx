import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Trash2, Edit, Plus } from "lucide-react";
import { ProductService } from "../../lib/api/products";
import { Modal } from "../../components/ui/modal";

const AllProductsPage = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAll,
  });

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

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link to="/products/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* List */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading products...</p>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
       {products?.map(product => (
  <Card key={product.id}>
    <CardContent className="p-4">
      <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden">
        {product?.image ? (
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">{product?.name}</h3>

        <p className="text-sm text-muted-foreground">
          Category: {product?.category?.name ?? "N/A"}
        </p>

        <p className="text-sm text-muted-foreground">
          Origin: {product?.origin?.name ?? "N/A"}
        </p>

        <p className="text-sm text-muted-foreground">
          Diet: {product?.diet && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {product?.diet?.name}
            </span>
          )}
        </p>

        <div className="flex items-center gap-2">
          {product?.gender && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {product?.gender?.name}
            </span>
          )}

          {product.maturity_level && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
              {product.maturity_level.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Link to={`/products/edit/${product.id}`}>
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
))}

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={closeDeleteModal}
        className="max-w-md p-6"
      >
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
          Delete Product
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this product?
          <br />
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={confirmDelete}
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
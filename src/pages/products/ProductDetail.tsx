import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../../lib/api/products";
import { CartService } from "../../lib/api/cart";
import type { Product } from "../../types";
import type { AddToCartPayload } from "../../types/CartTypes";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "react-hot-toast";

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  /* ---------------- Product Query ---------------- */
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug,
  });


  /* ---------------- Add to Cart ---------------- */
  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      CartService.create(payload),
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  if (isLoading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (isError || !product) {
    return <p className="p-6">Product not found</p>;
  }

  /* ---------------- Helpers ---------------- */

  const isGuestUser = (): boolean => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      return !auth?.user || !auth?.token;
    } catch {
      return true;
    }
  };

  const getFinalPrice = (pricing: any): number => {
    if (pricing.sale_price && pricing.sale_price > 0) {
      return pricing.sale_price;
    }
    if (pricing.discount_price) {
      return pricing.discount_price;
    }
    return pricing.price;
  };

  const addToLocalCart = ({
    product,
    price,
  }: {
    product: Product;
    price: number;
  }) => {
    const existing = JSON.parse(
      localStorage.getItem("cart-products") || "[]"
    );

    const existingItemIndex = existing.findIndex(
      (item: any) => item.product_id === product.id
    );

    if (existingItemIndex !== -1) {
      existing[existingItemIndex].quantity += 1;
      existing[existingItemIndex].updated_at = new Date().toISOString();
    } else {
      existing.push({
        id: Date.now(),
        user_id: null,
        product_id: product.id,
        product_slug: product.slug,
        quantity: 1,
        price,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product,
      });
    }

    localStorage.setItem("cart-products", JSON.stringify(existing));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      {/* ---------- Header ---------- */}
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={product.image ?? "https://placehold.co/600x400"}
          alt={product.name}
          className="rounded-lg w-full object-cover"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Gender:</strong> {product.gender}</p>
            <p><strong>Maturity:</strong> {product.maturity_level}</p>
            <p><strong>Origin:</strong> {product.origin}</p>
            <p><strong>Diet:</strong> {product.diet ?? "—"}</p>
            <p><strong>Tag:</strong> {product.tag}</p>
          </div>
        </div>
      </div>

      {/* ---------- Specifications ---------- */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <p>
              Length: {product.specifications?.length}{" "}
              {product.specifications?.length_unit}
            </p>
            <p>Weight: {product.specifications?.weight} g</p>
            <p>Birth Date: {product.specifications?.birth_date}</p>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Availability ---------- */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Available From</h2>

          {/* {product.availability.map((item: any) => {
            const price = getFinalPrice(item.pricing);

            return (
              <div
                key={`${item.store.slug}-${product.id}`}
                className="border rounded p-4 flex flex-col md:flex-row justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">{item.store.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Rating: {item.store.rating} ⭐
                  </p>
                  {item.store.verified && (
                    <span className="text-xs text-green-600">
                      Verified Seller
                    </span>
                  )}
                </div>

                <div className="text-right space-y-2">
                  <p className="font-semibold">${price}</p>
                  <p className="text-xs">Stock: {item.stock}</p>

                  <div className="flex gap-2 justify-end">
                    <Button size="sm" disabled={!item.in_stock}>
                      Buy Now
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!item.in_stock || addToCartMutation.isPending}
                      onClick={() => {
                        if (isGuestUser()) {
                          addToLocalCart({ product, price });
                          toast.success("Added to cart");
                          return;
                        }

                        addToCartMutation.mutate({
                          product_id: product.id,
                          quantity: 1,
                        });
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;

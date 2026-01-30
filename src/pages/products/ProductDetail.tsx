import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../../lib/api/products";
import { CartService } from "../../lib/api/cart";
// import type { Product } from "../../types";
import type { AddToCartPayload } from "../../types/CartTypes";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "react-hot-toast";
import type { Pricing, ProductDetails } from "../../types/ProductDetailsType";
import { Compass } from "lucide-react";

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  /* ---------------- Product Query ---------------- */
const {
  data: product,
  isLoading,
  isError,
} = useQuery<ProductDetails>({
  queryKey: ["product", slug],
  queryFn: () => ProductService.getBySlug(slug!),
  enabled: !!slug,
});

  const renderValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return value;
};



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

const getFinalPrice = (pricing: Pricing): number => {
  if (pricing.sale_price && pricing.sale_price > 0) {
    return pricing.sale_price;
  }

  if (pricing.discount_price && pricing.discount_price > 0) {
    return pricing.discount_price;
  }

  return pricing.price;
};


const addToLocalCart = ({
  product,
  price,
}: {
  product: ProductDetails;
  price: number;
}) => {
  const existing: any[] = JSON.parse(
    localStorage.getItem("cart-products") || "[]"
  );

  const index = existing.findIndex(
    (item) => item.product_id === product.id
  );

  if (index !== -1) {
    existing[index].quantity += 1;
    existing[index].updated_at = new Date().toISOString();
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

const handleAddToCart = () => {
  const availability = product.availability?.[0];
  if (!availability) return;

  const price = getFinalPrice(availability.pricing);

  const payload: AddToCartPayload = {
    product_id: product.id,
    quantity: 1,
  };

  if (isGuestUser()) {
    addToLocalCart({ product, price });
    toast.success("Added to cart");
    return;
  }

  addToCartMutation.mutate(payload);
};



  /* ---------------- UI ---------------- */

 return (
  <div className="p-10 mx-auto py-10 px-4">
    <div className="grid lg:grid-cols-3 gap-10">

      {/* ================= LEFT SIDE ================= */}
      <div className="lg:col-span-2 space-y-10">

        {/* Image & Thumbnails */}
        <div>
          <img
            src={product.image ?? "https://placehold.co/800x500"}
            alt={product.name}
            className="w-full h-[420px] object-cover rounded-xl"
          />

          {/* <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg bg-gray-200"
              />
            ))}
          </div> */}
        </div>

        {/* Overview */}
        <section>
          <div className=" flex justify-between">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-sm text-gray-500 italic">
            "{renderValue(product.description)}"
          </p>
          </div>
          <div>
            <Link
            to={`/products/${product.slug}/details`}
            className="text-sm text-primary font-medium hover:underline"
          >
            View more details →
          </Link>

          </div>
        </section>

        {/* Technical Specifications */}
        {/* <section className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Technical Specifications</h2>
          </div>

          <div className="grid border p-4 rounded sm:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">SKU</p>
              <p className="font-medium">{renderValue(product.sku)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{renderValue(product.category)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Traits</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">
                {product.traits?.join(", ") || "N/A"}
              </span>
            </div>

            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="font-medium">
                {product.specifications?.weight
                  ? `${product.specifications.weight} g`
                  : "N/A"}
              </p>
            </div>
          </div>
        </section> */}

        {/* Lineage & Origin */}
        {/* <section className="bg-emerald-50 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-lg text-primary ">Lineage & Origin</h3>

          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 text-md mb-1">Provenance</p>
              <p className="font-medium flex items-center gap-2">
                <Compass /> <span>Origin: {renderValue(product.origin)}</span>
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">
                Morph Identification
              </p>
              <p className="font-medium">
                Genetic markers consistent with documented{" "}
                <strong>{product.traits?.join(", ")}</strong> lineage patterns.
              </p>
            </div>
          </div>
        </section> */}

      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="space-y-6">

        {/* Purchase Box */}
        {product.availability?.[0] && (() => {
          const item = product.availability[0];
          const price = getFinalPrice(item.pricing);

          return (
            <div className="border rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-start">

              <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Recently Listed
              </span>

              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              </div>

              <h1 className="text-2xl font-semibold">{product.name}</h1>

              <p className="text-xs text-muted-foreground">
                Ref: {product.sku}
              </p>

              <div>
                <p className="text-3xl font-bold">₹{price}</p>

                {item.pricing.has_discount && (
                  <p className="text-sm text-green-600">
                    Discount valid until{" "}
                    {item.pricing.discount_period?.end}
                  </p>
                )}
              </div>

              <Button className="w-full">Purchase Now</Button>
              <Button variant="outline" className="w-full">
                Contact Breeder
              </Button>
            </div>
          );
        })()}

        {/* Breeder Info */}
        <div className="border rounded-xl p-6 space-y-4">
          <p className="text-xs text-muted-foreground">
            BREEDER INFORMATION
          </p>

          <div>
            <p className="font-semibold">
              {product.availability?.[0]?.store?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              ⭐ {product.availability?.[0]?.store?.rating} rating
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Response Time</p>
              <p className="font-medium">~2 Hours</p>
            </div>

            <div>
              <p className="text-muted-foreground">Verified Sales</p>
              <p className="font-medium">1,200+</p>
            </div>
          </div>

          <a href={`/store/${product.availability?.[0]?.store?.slug}`} className="text-primary font-medium text-sm">
            Visit Store Profile →
          </a>
        </div>

      </div>
    </div>
  </div>
);

};

export default ProductDetailsPage;

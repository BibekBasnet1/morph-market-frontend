import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../../lib/api/products";
import type { ProductDetails } from "../../types/ProductDetailsType";
import { Button } from "../../components/ui/button";
import { useState } from 'react';
import { Star, Clock, Shield } from 'lucide-react';
import PaymentMethodsModal from '../../components/payments/PaymentMethodsModal';
import { useAddToCart } from "../../hooks/useAddToCart";
import { useAuth } from "../../contexts/AuthContext";

const ProductDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { handleAddToCart, addToCartMutation } = useAddToCart();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Helper function to safely get string value from object or string
  const getStringValue = (value: any): string => {
    if (!value) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value.name) return value.name;
    return "N/A";
  };

  const getFinalPrice = (pricing: any): number => {
  if (pricing.sale_price && pricing.sale_price > 0) {
    return pricing.sale_price;
  }

  if (pricing.discount_price && pricing.discount_price > 0) {
    return pricing.discount_price;
  }

  return pricing.price;
};

  if (isLoading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (isError || !product) {
    return <p className="p-6">Product not found</p>;
  }

  /* ---------------- Helpers ---------------- */

  const modalItems = product?.availability?.[0]
    ? [{ product_id: product.id, store_id: product.availability[0].store.id, quantity: 1, product_name: product.name, price: getFinalPrice(product.availability[0].pricing) }]
    : [];

  const mainImageUrl = selectedImage || product?.image_urls?.thumbnail?.url || product?.image;
  const galleryImages = product?.image_urls?.gallery || product?.gallery || [];



  /* ---------------- UI ---------------- */

 return (
  <div className="p-10 mx-auto dark:text-white py-10 px-4">
    <div className="grid lg:grid-cols-3 gap-10">

      {/* ================= LEFT SIDE ================= */}
      <div className="lg:col-span-2 space-y-10">

        {/* Image & Thumbnails */}
        <div>
          <img
            src={mainImageUrl ?? "https://placehold.co/800x500"}
            alt={product.name}
            className="w-full h-[420px] object-cover rounded-xl"
          />

          {/* Gallery Thumbnails */}
          {galleryImages && galleryImages.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {galleryImages.map((img: any, i: number) => {
                const imageUrl = typeof img === "string" ? img : img?.url;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      selectedImage === imageUrl ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Gallery ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

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
          <div className="flex justify-between flex-col space-y-3">
          <h2 className="text-lg font-semibold">Overview</h2>
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
              <p className="font-medium">{getStringValue(product.category)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Traits</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">
                {Array.isArray(product.traits) ? product.traits.map((t: any) => getStringValue(t)).join(", ") : getStringValue(product.traits) || "N/A"}
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
                <Compass /> <span>Origin: {getStringValue(product.origin)}</span>
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">
                Morph Identification
              </p>
              <p className="font-medium">
                Genetic markers consistent with documented{" "}
                <strong>{Array.isArray(product.traits) ? product.traits.map((t: any) => getStringValue(t)).join(", ") : getStringValue(product.traits)}</strong> lineage patterns.
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
                onClick={() => handleAddToCart({ product, price })}
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
                <p className="text-3xl font-bold">${price}</p>

                {item.pricing.has_discount && (
                  <p className="text-sm text-green-600">
                    Discount valid until{" "}
                    {item.pricing.discount_period?.end}
                  </p>
                )}
              </div>

              <Button className="w-full" onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else {
                  setShowPayment(true);
                }
              }}>Purchase Now</Button>
              <Button variant="outline" className="w-full">
                Contact Breeder
              </Button>
            </div>
          );
        })()}

        <PaymentMethodsModal
          isOpen={Boolean(showPayment)}
          onClose={() => setShowPayment(false)}
          items={modalItems}
        />

        {/* Breeder Info */}
        <div className="border rounded-xl p-6 space-y-6">
          <p className="text-xs text-muted-foreground">
            BREEDER INFORMATION
          </p>

          {/* Store Name */}
          <div>
            <p className="font-semibold text-lg">
              {product.availability?.[0]?.store?.name}
            </p>
            {product.availability?.[0]?.store?.brand_name && (
              <p className="text-sm text-muted-foreground">
                {product.availability?.[0]?.store?.brand_name}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {product.availability?.[0]?.store?.rating || 0} rating
            </span>
          </div>

          {/* Verified Badge */}
          {product.availability?.[0]?.store?.verified && (
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Verified Seller</span>
            </div>
          )}

          {/* Response Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Response Time</p>
              <p className="font-medium">~2 Hours</p>
            </div>
          </div>

          {/* Store Link */}
          <a href={`/store/${product.availability?.[0]?.store?.slug}`} className="block text-center bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition">
            Visit Store Profile →
          </a>
        </div>

      </div>
    </div>
  </div>
);

};

export default ProductDetailsPage;

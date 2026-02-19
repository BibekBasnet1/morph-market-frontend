import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star, Clock, Shield } from "lucide-react";
import { ProductService } from "../../lib/api/products";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAddToCart } from "../../hooks/useAddToCart";

const ProductDetailsImmersivePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details-immersive", slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { handleAddToCart, addToCartMutation } = useAddToCart();

  // Helper function to safely get string value from object or string
  const getStringValue = (value: any): string => {
    if (!value) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value.name) return value.name;
    return "N/A";
  };

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  const availability = product.availability?.[0];
  const pricing = availability?.pricing;

  const getFinalPrice = (pricing: any): number => {
    if (pricing?.sale_price && pricing.sale_price > 0) {
      return pricing.sale_price;
    }
    if (pricing?.discount_price && pricing.discount_price > 0) {
      return pricing.discount_price;
    }
    return pricing?.price || 0;
  };

  const price = getFinalPrice(pricing);

  const mainImageUrl = selectedImage || product.image_urls?.thumbnail?.url || product.image;
  const galleryImages = product.image_urls?.gallery || product.gallery || [];
  
  // Combine all images for full screen view
  const allImages = [mainImageUrl, ...galleryImages.map((img: any) => typeof img === "string" ? img : img?.url)].filter(Boolean);
  
  const handleOpenFullScreen = (imageUrl?: string) => {
    if (imageUrl) {
      const currentIndex = allImages.indexOf(imageUrl);
      setFullScreenImageIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      const currentIndex = allImages.indexOf(mainImageUrl);
      setFullScreenImageIndex(currentIndex >= 0 ? currentIndex : 0);
    }
    setIsFullScreen(true);
  };

  const handleNextImage = () => {
    setFullScreenImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setFullScreenImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const SpecChip = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-1">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="min-h-screen text-foreground dark:bg-gray-900 dark:text-white">
      {/* Hero */}
      <div className="relative h-[72vh] cursor-pointer group">
        <img
          src={mainImageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition"
        />
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition" />
        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-lg">
            <p className="text-sm font-medium">Click to view full screen</p>
          </div>
        </div> */}

        <div className="relative z-10 max-w-7xl mx-auto h-full px-10 flex items-end pb-16">
          <div className="dark:bg-gray-700 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full max-w-4xl">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Certified Listing
              </p>
              <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {availability?.store?.name}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${pricing?.sale_price ?? pricing?.price}
                </p>
                {pricing?.sale_price && (
                  <p className="text-xs line-through text-muted-foreground">
                    ${pricing.price}
                  </p>
                )}
              </div>
              <Button onClick={() => handleAddToCart({ product, price })} size="lg" className="px-6">
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-background rounded-t-3xl -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-10 py-16 grid lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "No description provided."}
              </p>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Technical Specifications
              </h2>

              <div className="grid sm:grid-cols-4 gap-4">
                <SpecChip label="Category" value={getStringValue(product.category)} />
                <SpecChip
                  label="Traits"
                  value={Array.isArray(product.traits) ? product.traits.map((t: any) => getStringValue(t)).join(", ") : getStringValue(product.traits) || "N/A"}
                />
                <SpecChip
                  label="Weight"
                  value={
                    product.specifications?.weight
                      ? `${product.specifications.weight} g`
                      : "N/A"
                  }
                />
              </div>
            </section>

            {/* Lineage & Origin */}
            <section className="rounded-2xl bg-muted/40 p-6">
              <h3 className="font-semibold mb-2">Lineage & Origin</h3>
              <p className="text-sm text-muted-foreground">
                Origin: {getStringValue(product.origin)}
              </p>
            </section>

            {/* Store Policy */}
            {availability?.store?.policy && (
              <section className="rounded-2xl bg-muted/40 p-6">
                <h3 className="font-semibold mb-3">Store Policy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {availability.store.policy}
                </p>
              </section>
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <p className="text-xs uppercase text-muted-foreground">
                  Breeder Information
                </p>
                
                {/* Store Name */}
                <div>
                  <p className="font-semibold text-lg">
                    {availability?.store?.name}
                  </p>
                  {availability?.store?.brand_name && (
                    <p className="text-sm text-muted-foreground">
                      {availability.store.brand_name}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {availability?.store?.rating || 0} rating
                  </span>
                </div>

                {/* Verified Badge */}
                {availability?.store?.verified && (
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
                <Link
                  to={`/store/${availability?.store?.slug}`}
                  className="block text-center bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Visit Store Profile →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery */}
        {galleryImages && galleryImages.length > 0 && (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Immersive Gallery</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages?.map((img: any, i: number) => {
                  const imageUrl = typeof img === "string" ? img : img?.url;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOpenFullScreen(imageUrl)}
                      className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <img
                        src={imageUrl}
                        className="w-full h-52 object-cover hover:opacity-80 transition"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Immersive View */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <img
              src={allImages[fullScreenImageIndex]}
              alt={`Image ${fullScreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-sm">
              {fullScreenImageIndex + 1} / {allImages.length}
            </div>
          )}

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-96 px-4">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setFullScreenImageIndex(idx)}
                  className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all border-2 ${
                    fullScreenImageIndex === idx ? "border-white" : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsImmersivePage;

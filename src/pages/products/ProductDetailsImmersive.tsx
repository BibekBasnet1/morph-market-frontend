import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star, Clock, Shield, MapPin, Tag, Weight, Grid2x2, Dna, ArrowLeft } from "lucide-react";
import { ProductService } from "../../lib/api/products";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { Badge } from "../../components/ui/badge";

const SpecChip = ({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon && <span className="text-primary">{icon}</span>}
      <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{value || "N/A"}</p>
  </div>
);

const ProductDetailsImmersivePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details-immersive", slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { handleAddToCart, addToCartMutation } = useAddToCart();
  const { carts, removeFromCart, removing } = useCart();

  const getStringValue = (value: any): string => {
    if (!value) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value.name) return value.name;
    return "N/A";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }
  if (!product) return <div className="p-10">Product not found</div>;

  const availability = product.availability?.[0];
  const pricing = availability?.pricing;

  const getFinalPrice = (pricing: any): number => {
    if (pricing?.sale_price && pricing.sale_price > 0) return pricing.sale_price;
    if (pricing?.discount_price && pricing.discount_price > 0) return pricing.discount_price;
    return pricing?.price || 0;
  };

  const price = getFinalPrice(pricing);
  const hasDiscount = pricing?.sale_price && pricing.sale_price < pricing.price;

  const mainImageUrl = selectedImage || product.image_urls?.thumbnail?.url || product.image;
  const galleryImages = product.image_urls?.gallery || product.gallery || [];
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

  const handleNextImage = () => setFullScreenImageIndex((prev) => (prev + 1) % allImages.length);
  const handlePrevImage = () => setFullScreenImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const inCart = carts.some((c) => c.product_id === product.id);

  const traits = Array.isArray(product.traits)
    ? product.traits.map((t: any) => getStringValue(t))
    : product.traits ? [getStringValue(product.traits)] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-foreground">
      
      <div className="relative h-[70vh] min-h-[480px]">
        <img
          src={mainImageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 dark:text-white text-black" />
          <span className="dark:text-white text-black">Back</span>
        </button>

        <button
          onClick={() => handleOpenFullScreen()}
          className="absolute top-6 right-6 z-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium transition"
        >
          <span className="dark:text-white text-black">View Full Screen</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 max-w-7xl mx-auto">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] uppercase tracking-widest">
                  Certified Listing
                </Badge> */}
                {availability?.store?.verified && (
                  <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] uppercase tracking-widest">
                    Verified Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 dark:text-slate-400">{availability?.store?.name}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  ${pricing?.sale_price ?? pricing?.price}
                </p>
                {hasDiscount && (
                  <p className="text-xs line-through text-muted-foreground">${pricing.price}</p>
                )}
              </div>
              <Button
                variant={inCart ? "destructive" : "primary"}
                onClick={() => {
                  if (inCart) { removeFromCart(product.id); return; }
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
                    return;
                  }
                  handleAddToCart({ product, price });
                }}
                size="lg"
                className="px-7 rounded-xl font-semibold"
                disabled={addToCartMutation.isPending || (removing && inCart)}
              >
                {addToCartMutation.isPending ? "Adding..." : removing && inCart ? "Removing..." : inCart ? "Remove from Cart" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {galleryImages.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
          <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedImage(null)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${!selectedImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img src={product.image_urls?.thumbnail?.url || product.image} className="w-full h-full object-cover" alt="main" />
            </button>
            {galleryImages.map((img: any, i: number) => {
              const url = typeof img === "string" ? img : img?.url;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${selectedImage === url ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt={`gallery ${i}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-primary inline-block" />
              Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm dark:text-white">
              {product.description || "No description provided."}
            </p>
          </section>

          {traits.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary inline-block" />
                Traits
              </h2>
              <div className="flex flex-wrap gap-2">
                {traits.map((t: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-primary inline-block" />
              Technical Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 dark:text-white">
              <SpecChip
                label="Category"
                value={getStringValue(product.category)}
                icon={<Grid2x2 className="w-3.5 h-3.5" />}
              />
              <SpecChip
                label="Weight"
                value={product.specifications?.weight ? `${product.specifications.weight} g` : "N/A"}
                icon={<Weight className="w-3.5 h-3.5" />}
              />
              <SpecChip
                label="Origin"
                value={getStringValue(product.origin)}
                icon={<MapPin className="w-3.5 h-3.5" />}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Lineage & Origin</h3>
            </div>
            <div className="flex items-center gap-2 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">{getStringValue(product.origin)}</p>
            </div>
          </section>

          {availability?.store?.policy && (
            <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Store Policy</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{availability.store.policy}</p>
            </section>
          )}
        </div>

        <div>
          <Card className="sticky top-24 border-gray-200 dark:border-gray-700 shadow-md rounded-2xl overflow-hidden">
            <div className="bg-primary/5 dark:bg-primary/10 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 dark:text-white">
                Breeder Information
              </p>
              <p className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                {availability?.store?.name}
              </p>
              {availability?.store?.brand_name && (
                <p className="text-sm text-muted-foreground mt-0.5 dark:text-white">{availability.store.brand_name}</p>
              )}
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= Math.round(availability?.store?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {availability?.store?.rating || 0} / 5
                </span>
              </div>

              {availability?.store?.verified && (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl px-3 py-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Verified Seller</span>
                </div>
              )}

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0 dark:text-white" />
                <div>
                  <p className="text-[11px] text-muted-foreground dark:text-white">Avg. Response Time</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">~2 Hours</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700" />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground dark:text-white">Price</p>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                    ${pricing?.sale_price ?? pricing?.price}
                  </p>
                  {hasDiscount && (
                    <p className="text-xs line-through text-muted-foreground">${pricing.price}</p>
                  )}
                </div>
              </div>

              <Button
                variant={inCart ? "destructive" : "primary"}
                className="w-full rounded-xl font-semibold"
                onClick={() => {
                  if (inCart) { removeFromCart(product.id); return; }
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
                    return;
                  }
                  handleAddToCart({ product, price });
                }}
                disabled={addToCartMutation.isPending || (removing && inCart)}
              >
                {addToCartMutation.isPending ? "Adding..." : removing && inCart ? "Removing..." : inCart ? "Remove from Cart" : "Add to Cart"}
              </Button>

              <Link
                to={`/stores/${availability?.store?.id}/products`}
                className="block text-center text-sm font-medium text-primary hover:underline py-1 transition"
              >
                Visit Store Profile →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-primary inline-block" />
            Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img: any, i: number) => {
              const imageUrl = typeof img === "string" ? img : img?.url;
              return (
                <button
                  key={i}
                  onClick={() => handleOpenFullScreen(imageUrl)}
                  className="rounded-2xl overflow-hidden group relative shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    alt={`Gallery ${i + 1}`}
                    src={imageUrl}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition rounded-2xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full">
                      View
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-5 right-5 z-10 bg-white/15 hover:bg-white/25 text-white p-2.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center px-16">
            <img
              src={allImages[fullScreenImageIndex]}
              alt={`Image ${fullScreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {allImages.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-medium">
                {fullScreenImageIndex + 1} / {allImages.length}
              </div>
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-sm overflow-x-auto">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setFullScreenImageIndex(idx)}
                    className={`shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${fullScreenImageIndex === idx ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-80"}`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsImmersivePage;
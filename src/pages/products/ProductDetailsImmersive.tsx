import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../../lib/api/products";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const ProductDetailsImmersivePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details-immersive", slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  const availability = product.availability?.[0];
  const pricing = availability?.pricing;

  const SpecChip = ({ label, value }: { label: string; value: any }) => (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium mt-1">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="min-h-screen text-foreground dark:bg-gray-900 dark:text-white">
      {/* Hero */}
      <div className="relative h-[72vh]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

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
              <Button size="lg" className="px-6">
                Secure Selection
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
                <SpecChip label="SKU" value={product.sku} />
                <SpecChip label="Category" value={product.category} />
                <SpecChip
                  label="Traits"
                  value={product.traits?.join(", ") || "N/A"}
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
                Origin: {product.origin || "Unknown"}
              </p>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <p className="text-xs uppercase text-muted-foreground">
                  Breeder Information
                </p>
                <p className="font-semibold text-lg">
                  {availability?.store?.name}
                </p>

                <Button variant="outline" className="w-full">
                  Message Breeder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery */}
        {product.gallery && product.gallery.length > 0 && (
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Immersive Gallery</h3>
                <span className="text-sm text-muted-foreground">
                  High-resolution images
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.gallery?.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className="rounded-2xl object-cover h-52 w-full hover:scale-[1.02] transition"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsImmersivePage;

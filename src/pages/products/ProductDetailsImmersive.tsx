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

  return (
    <div className="min-h-screen bg-[#0f3d2e] text-white">
      {/* Hero */}
      <div className="relative h-[70vh]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-10 py-16 flex flex-col justify-end h-full">
          <p className="text-sm uppercase tracking-wide opacity-80">
            Marketplace · New Species
          </p>
          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center gap-6 mt-6">
            <p className="text-3xl font-semibold">
              ₹{pricing?.sale_price ?? pricing?.price}
            </p>
            <Button size="lg">Secure Selection</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white text-black rounded-t-3xl -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-10 py-16 grid lg:grid-cols-3 gap-10">

          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">
                {product.description || "No description provided."}
              </p>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Technical Specifications
              </h2>

              <div className="grid sm:grid-cols-4 gap-6 text-sm">
                <Spec label="SKU" value={product.sku} />
                <Spec label="Category" value={product.category} />
                <Spec
                  label="Traits"
                  value={product.traits?.join(", ") || "N/A"}
                />
                <Spec
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
            <section className="bg-emerald-50 rounded-xl p-6">
              <h3 className="font-semibold mb-2">Lineage & Origin</h3>
              <p className="text-sm text-muted-foreground">
                Origin: {product.origin || "Unknown"}
              </p>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-muted-foreground">
                  BREEDER INFORMATION
                </p>
                <p className="font-semibold">
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
        <div className="bg-[#0f3d2e] py-16">
          <div className="max-w-7xl mx-auto px-10">
            <h3 className="text-white text-xl font-semibold mb-6">
              Immersive Gallery
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.gallery?.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  className="rounded-xl object-cover h-48 w-full"
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Spec = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
);

export default ProductDetailsImmersivePage;

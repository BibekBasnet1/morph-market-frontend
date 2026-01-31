import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Geckos",
    count: "234 listings",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leopard-gecko-close-up-yellow-spotted-SzKRu4eAlkMcvfKBFTha2wXfhlhqkn.jpg",
  },
  {
    name: "Snakes",
    count: "189 listings",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/ball-python-snake-coiled-beautiful-morph-SGOnk0kgCKE5rD7NvKfHsOuKZC4Cyh.jpg",
  },
  {
    name: "Chameleons",
    count: "87 listings",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/panther-chameleon-colorful-vibrant-blue-green-oJixy8IgQg0pc3U7Nvnt22XveCjSRC.jpg",
  },
  {
    name: "Bearded Dragons",
    count: "156 listings",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bearded-dragon-lizard-orange-close-up-EZNw2uMp2ObnDrmMCAZ36MJ9BX6hG8.jpg",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-24 bg-muted/30 dark:text-white dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">
            Popular Species
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated selection of exceptional reptiles from verified breeders
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer overflow-hidden border border-border/40
                         bg-card shadow-md hover:shadow-xl
                         transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover
                             group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient overlay – tuned for dark & light */}
                <div className="absolute inset-0 bg-gradient-to-t
                                from-black/80 via-black/30 to-transparent
                                dark:from-black/90 dark:via-black/40" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-serif font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {category.count}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

import { Card } from "../../components/ui/card"

const categories = [
  {
    name: "Geckos",
    count: "234 listings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leopard-gecko-close-up-yellow-spotted-SzKRu4eAlkMcvfKBFTha2wXfhlhqkn.jpg",
  },
  {
    name: "Snakes",
    count: "189 listings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/ball-python-snake-coiled-beautiful-morph-SGOnk0kgCKE5rD7NvKfHsOuKZC4Cyh.jpg",
  },
  {
    name: "Chameleons",
    count: "87 listings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/panther-chameleon-colorful-vibrant-blue-green-oJixy8IgQg0pc3U7Nvnt22XveCjSRC.jpg",
  },
  {
    name: "Bearded Dragons",
    count: "156 listings",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bearded-dragon-lizard-orange-close-up-EZNw2uMp2ObnDrmMCAZ36MJ9BX6hG8.jpg",
  },
]

const CategorySection= () =>{
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4 text-balance">
            Popular Species
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse our curated selection of exceptional reptiles from verified breeders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-serif font-semibold text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection;

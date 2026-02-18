import { Card } from "../../components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "../ui/badge"
import { DietService } from "../../lib/api/attributes/diet"

// Fallback images for diets
const dietImages: Record<string, string> = {
  meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=380&fit=crop",
  eggs: "https://images.unsplash.com/photo-1582722872981-82a63300c9c6?w=500&h=380&fit=crop",
  grass: "https://images.unsplash.com/photo-1583693033351-e8f0b3e24c3e?w=500&h=380&fit=crop",
  anything: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=380&fit=crop",
}

export function FeaturedListings() {
  const { data: dietsData = [] } = useQuery({
    queryKey: ["diets"],
    queryFn: DietService.getAllPublic,
  })

  // Handle both array and paginated response
  const diets = Array.isArray(dietsData) ? dietsData : (dietsData?.data || [])

  // Helper to get diet image
  const getDietImage = (diet: any) => {
    return (
      diet?.image_urls?.url ||
      diet?.image_urls?.thumb ||
      dietImages[(diet?.name || "").toLowerCase()] ||
      "https://placehold.co/500x380"
    )
  }

  return (
    <section className="py-24 dark:text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-3 text-balance">
              Popular Diets
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Common diet types for reptiles and amphibians
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diets.slice(0, 6).map((diet: any) => (
            <Card
              key={diet.id}
              className="group overflow-hidden border-0 dark:bg-primary shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={getDietImage(diet)}
                  alt={diet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {diet.status === 1 && (
                  <Badge className="absolute top-3 left-3 bg-green-700 text-white">
                    Active
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-balance">
                  {diet.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

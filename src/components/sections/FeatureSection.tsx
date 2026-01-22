import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Heart, MapPin } from "lucide-react"
import { Badge } from "../ui/badge"

const listings = [
  {
    id: 1,
    title: "High Yellow Leopard Gecko",
    price: "$89",
    location: "California",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leopard-gecko-yellow-morph-spotted-ii2rcAWmMv0RJ3UolI9XzEQ9LfrkuG.jpg",
    breeder: "Gecko Paradise",
    verified: true,
  },
  {
    id: 2,
    title: "Banana Ball Python",
    price: "$249",
    location: "Texas",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/banana-ball-python-yellow-morph-DPWgDG9OwmzLBh4a6fg1YJuuY1yJ7D.jpg",
    breeder: "Elite Serpents",
    verified: true,
  },
  {
    id: 3,
    title: "Ambilobe Panther Chameleon",
    price: "$425",
    location: "Florida",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/panther-chameleon-blue-red-colorful-MWDG1xl9pAXrqIJbhLD0a5VNpiNkAk.jpg",
    breeder: "Chameleon Kingdom",
    verified: true,
  },
  {
    id: 4,
    title: "Citrus Bearded Dragon",
    price: "$175",
    location: "Arizona",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bearded-dragon-orange-citrus-morph-hQNWdWEgXQTZ3mYvafUdfvNkSrpuEt.jpg",
    breeder: "Dragon Den",
    verified: true,
  },
  {
    id: 5,
    title: "Crested Gecko - Harlequin",
    price: "$129",
    location: "Oregon",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/crested-gecko-orange-harlequin-pattern-Wke2RcEKT6yD9kKLF8i1x6Ur24RMTB.jpg",
    breeder: "Crest Breeders Co",
    verified: true,
  },
  {
    id: 6,
    title: "Blue Eye Leucistic Ball Python",
    price: "$399",
    location: "Georgia",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/blue-eyed-leucistic-ball-python-white-ji8lJRg78pI0c0sjuYXt9uOUN8L9eV.jpg",
    breeder: "Python Palace",
    verified: true,
  },
]

export function FeaturedListings() {
  return (
    <section className="py-24 dark:text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-3 text-balance">
              Featured Listings
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Handpicked exceptional specimens from top-rated breeders
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex bg-transparent">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="group overflow-hidden border-0 dark:bg-primary shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full dark:bg-white/0 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-foreground" />
                </button>
                {listing.verified && (
                    <Badge className="absolute top-3 left-3 bg-green-700 text-white">
                      Featured
                    </Badge>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-balance">
                    {listing.title}
                  </h3>
                  <span className="text-xl font-bold text-primary">{listing.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{listing.breeder}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12 md:hidden">
          <Button variant="outline">View All Listings</Button>
        </div>
      </div>
    </section>
  )
}

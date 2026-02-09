
import CategorySection from '../components/sections/CategorySection';
import { FeaturedListings } from '../components/sections/FeatureSection';
import HeroSection from '../components/sections/HeroSection';
import Cta from '../components/sections/Cta';
import BadgesSection from '../components/sections/BadgesSection';

// import { 
//   Search, 
//   Heart, 
//   ShoppingCart, 
//   User, 
//   Menu, 
//   X,
//   Star,
//   Shield,
//   Truck,
//   MessageCircle
// } from 'lucide-react';

// Mock pet data
// const featuredPets = [
//   {
//     id: '1',
//     name: 'Royal Ball Python',
//     species: 'Ball Python',
//     morph: 'Pastel',
//     price: 150,
//     image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=300&fit=crop',
//     seller: 'Exotic Reptiles Co.',
//     rating: 4.9,
//     reviews: 124,
//     featured: true
//   },
//   {
//     id: '2',
//     name: 'Corn Snake - Albino',
//     species: 'Corn Snake',
//     morph: 'Albino',
//     price: 85,
//     image: 'https://images.unsplash.com/photo-1570741066052-817c6de995c8?w=400&h=300&fit=crop',
//     seller: 'Snake Haven',
//     rating: 4.7,
//     reviews: 89,
//     featured: false
//   },
//   {
//     id: '3',
//     name: 'Green Tree Python',
//     species: 'Green Tree Python',
//     morph: 'High Yellow',
//     price: 450,
//     image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop',
//     seller: 'Arboreal Exotics',
//     rating: 5.0,
//     reviews: 67,
//     featured: true
//   },
//   {
//     id: '4',
//     name: 'Boa Constrictor',
//     species: 'Boa Constrictor',
//     morph: 'Colombian Red Tail',
//     price: 275,
//     image: 'https://images.unsplash.com/photo-1585095595205-e68428a9e205?w=400&h=300&fit=crop',
//     seller: 'Reptile Kingdom',
//     rating: 4.8,
//     reviews: 156,
//     featured: false
//   },
//   {
//     id: '5',
//     name: 'Hognose Snake',
//     species: 'Western Hognose',
//     morph: 'Lavender',
//     price: 325,
//     image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=300&fit=crop',
//     seller: 'Unique Morphs',
//     rating: 4.6,
//     reviews: 42,
//     featured: true
//   },
//   {
//     id: '6',
//     name: 'King Snake',
//     species: 'California Kingsnake',
//     morph: 'Banana',
//     price: 120,
//     image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=300&fit=crop',
//     seller: 'West Coast Reptiles',
//     rating: 4.9,
//     reviews: 98,
//     featured: false
//   }
// ];

// const categories = [
//   { name: 'Ball Pythons', count: 234, icon: '🐍' },
//   { name: 'Corn Snakes', count: 156, icon: '🌽' },
//   { name: 'Boas', count: 89, icon: '🌴' },
//   { name: 'Kingsnakes', count: 67, icon: '👑' },
//   { name: 'Tree Pythons', count: 45, icon: '🌲' },
//   { name: 'Hognose', count: 78, icon: '🐽' }
// ];

const Index = () => {

  return (
    <div className="min-h-screen bg-background">

     <HeroSection />

      <BadgesSection/>
      <CategorySection />
      <FeaturedListings/>

      {/* cta */}
      <Cta />
    </div>
  );
};

export default Index;

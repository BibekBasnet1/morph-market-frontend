import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Select from "../components/ui/select";
import { Badge } from '../components/ui/badge';
import { Heart, MapPin, Filter, X } from 'lucide-react';
import { mockReptiles } from '../lib/mockData';
import type { Reptile, ReptileFilters } from '../types';

const AllReptilesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Get initial filters from URL params
  const initialFilters: ReptileFilters = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    sex: searchParams.get('sex') as 'male' | 'female' | 'unknown' || undefined,
    weightMin: searchParams.get('weightMin') ? Number(searchParams.get('weightMin')) : undefined,
    weightMax: searchParams.get('weightMax') ? Number(searchParams.get('weightMax')) : undefined,
    search: searchParams.get('search') || undefined,
  }), [searchParams]);

  const [filters, setFilters] = useState<ReptileFilters>(initialFilters);

  // Filter reptiles based on current filters
  const filteredReptiles = useMemo(() => {
    return mockReptiles.filter(reptile => {
      if (filters.category && reptile.category !== filters.category) return false;
      if (filters.location && !reptile.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.priceMin && reptile.price < filters.priceMin) return false;
      if (filters.priceMax && reptile.price > filters.priceMax) return false;
      if (filters.sex && reptile.sex !== filters.sex) return false;
      if (filters.weightMin && reptile.weight < filters.weightMin) return false;
      if (filters.weightMax && reptile.weight > filters.weightMax) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!reptile.title.toLowerCase().includes(searchTerm) &&
            !reptile.breeder.toLowerCase().includes(searchTerm) &&
            !reptile.traits.some(trait => trait.toLowerCase().includes(searchTerm))) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  // Update URL params when filters change
  const updateFilters = (newFilters: Partial<ReptileFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchParams(new URLSearchParams());
  };

  const categories = [...new Set(mockReptiles.map(r => r.category))];
  const locations = [...new Set(mockReptiles.map(r => r.location))];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            All Reptiles
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing reptiles from verified breeders
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <Input
              placeholder="Search by name, breeder, or traits..."
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    options={[
                      { value: '', label: 'All Categories' },
                      ...categories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    placeholder="All Categories"
                    onChange={(value) => updateFilters({ category: value || undefined })}
                    defaultValue={filters.category || ''}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select
                    options={[
                      { value: '', label: 'All Locations' },
                      ...locations.map(loc => ({ value: loc, label: loc }))
                    ]}
                    placeholder="All Locations"
                    onChange={(value) => updateFilters({ location: value || undefined })}
                    defaultValue={filters.location || ''}
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sex</label>
                  <Select
                    options={[
                      { value: '', label: 'Any Sex' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'unknown', label: 'Unknown' }
                    ]}
                    placeholder="Any Sex"
                    onChange={(value) => updateFilters({ sex: value as 'male' | 'female' | 'unknown' || undefined })}
                    defaultValue={filters.sex || ''}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ''}
                      onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ''}
                      onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Weight Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight Range (g)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.weightMin || ''}
                      onChange={(e) => updateFilters({ weightMin: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.weightMax || ''}
                      onChange={(e) => updateFilters({ weightMax: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredReptiles.length} reptile{filteredReptiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Reptile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReptiles.map((reptile) => (
            <Card
              key={reptile.id}
              className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={reptile.image || "/placeholder.svg"}
                  alt={reptile.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-foreground" />
                </button>
                {reptile.verified && (
                  <Badge className="absolute top-3 left-3 bg-green-400 text-primary-foreground">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-balance">
                    {reptile.title}
                  </h3>
                  <span className="text-xl font-bold text-primary">${reptile.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{reptile.breeder}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {reptile.location}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {reptile.traits.slice(0, 2).map(trait => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                  {reptile.traits.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{reptile.traits.length - 2}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Sex: {reptile.sex}</div>
                  <div>Weight: {reptile.weight}g</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredReptiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No reptiles found matching your criteria.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReptilesPage;
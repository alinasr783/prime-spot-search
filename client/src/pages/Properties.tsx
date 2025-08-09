import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters, { SearchFilters as SearchFiltersType } from "@/components/SearchFilters";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List } from "lucide-react";

const Properties = () => {
  const [location] = useLocation();

  // Parse URL search params with useCallback for memoization
  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      location: params.get("location") || "",
      propertyType: params.get("propertyType") || "",
      priceType: params.get("priceType") || "",
      bedrooms: params.get("bedrooms") || "",
      bathrooms: params.get("bathrooms") || "",
      priceMin: params.get("priceMin") || "",
      priceMax: params.get("priceMax") || "",
    };
  }, []);

  const [filters, setFilters] = useState<SearchFiltersType>(getSearchParams());
  const [appliedFilters, setAppliedFilters] = useState<SearchFiltersType>(getSearchParams());
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const { properties, loading, error } = useProperties(appliedFilters);

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = getSearchParams();
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [location, getSearchParams]);

  const handleFiltersChange = useCallback((newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setShowFilters(false);

    // Update URL without page reload
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.history.pushState({}, '', `${location}?${params.toString()}`);
  }, [filters, location]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(appliedFilters).filter(value => value !== "").length;
  }, [appliedFilters]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Skeleton */}
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
              {/* Properties Grid Skeleton */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <PropertyCard.Skeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              حدث خطأ في تحميل البيانات
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Page Header */}
      <div className="pt-20 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              جميع العقارات المتاحة
            </h1>
            <p className="text-xl text-muted-foreground">
              اكتشف مجموعة واسعة من العقارات المميزة في جميع أنحاء مصر
            </p>
          </div>

          {/* Results Count & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {properties.length} عقار متاح
              </Badge>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="outline" className="text-sm">
                  {getActiveFiltersCount()} فلاتر مطبقة
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 ml-2" />
                فلاتر
              </Button>

              {/* View Type Buttons */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  لا توجد عقارات متطابقة
                </h3>
                <p className="text-muted-foreground mb-6">
                  جرب تعديل الفلاتر أو البحث بمعايير أخرى
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilters({} as SearchFiltersType);
                    setAppliedFilters({} as SearchFiltersType);
                  }}
                >
                  مسح كل الفلاتر
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewType === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    layout={viewType}
                    showFeaturedBadge={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/PropertyCard";

const FeaturedProperties = () => {
  const [, setLocation] = useLocation();
  const { properties, loading, error } = useFeaturedProperties();

  const handleViewAllProperties = () => {
    setLocation('/properties');
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-secondary fill-secondary" />
              <Badge variant="secondary" className="text-lg px-4 py-2">
                العقارات المميزة
              </Badge>
              <Star className="w-6 h-6 text-secondary fill-secondary" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              اكتشف أفضل العقارات
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-1/3 mb-4" />
                  <div className="flex gap-4 mb-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">حدث خطأ أثناء تحميل العقارات</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-secondary fill-secondary" />
            <Badge variant="secondary" className="text-lg px-4 py-2">
              العقارات المميزة
            </Badge>
            <Star className="w-6 h-6 text-secondary fill-secondary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            اكتشف أفضل العقارات
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            مجموعة مختارة من أجود العقارات المتاحة في أفضل الأحياء والمواقع الاستراتيجية
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              showFeaturedBadge={true}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleViewAllProperties}
          >
            عرض جميع العقارات
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
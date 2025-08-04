import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bath, Bed, Square, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  price_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  property_type: string;
  is_featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
  showFeaturedBadge?: boolean;
}

const PropertyCard = ({ property, showFeaturedBadge = false }: PropertyCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Property Image */}
      <div className="relative overflow-hidden">
        <img 
          src={property.images[0] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop"} 
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground font-bold">
            {property.price_type}
          </Badge>
        </div>
        {showFeaturedBadge && property.is_featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground">
              مميز جداً
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Property Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 ml-2" />
            <span>{property.location}</span>
          </div>

          <div className="text-2xl font-bold text-primary mb-4">
            {formatPrice(property.price)}
            <span className="text-sm text-muted-foreground font-normal">
              {property.price_type.includes('شهريًا') ? ' / شهر' : ''}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} غرف</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} حمام</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.area} م²</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="group w-full"
            onClick={handleViewDetails}
          >
            عرض التفاصيل
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
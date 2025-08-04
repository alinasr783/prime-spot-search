import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bath, Bed, Square, Star, ArrowLeft } from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  priceType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  agent: {
    name: string;
    phone: string;
    image: string;
  };
  featured: boolean;
}

const FeaturedProperties = () => {
  // بيانات وهمية للعقارات المميزة المصرية
  const featuredProperties: Property[] = [
    {
      id: "1",
      title: "فيلا فاخرة في القاهرة الجديدة",
      location: "القاهرة الجديدة - التجمع الخامس",
      price: 12500000,
      priceType: "للبيع",
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      agent: {
        name: "",
        phone: "",
        image: ""
      },
      featured: true
    },
    {
      id: "2", 
      title: "شقة عصرية في الإسكندرية",
      location: "الإسكندرية - ستانلي",
      price: 25000,
      priceType: "للإيجار شهريًا",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      image: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=500&h=300&fit=crop",
      agent: {
        name: "",
        phone: "",
        image: ""
      },
      featured: true
    },
    {
      id: "3",
      title: "مكتب تجاري في مدينة نصر",
      location: "القاهرة - مدينة نصر",
      price: 35000,
      priceType: "للإيجار شهريًا",
      bedrooms: 0,
      bathrooms: 2,
      area: 200,
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=500&h=300&fit=crop",
      agent: {
        name: "",
        phone: "",
        image: ""
      },
      featured: true
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          {featuredProperties.map((property) => (
            <Card key={property.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Property Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground font-bold">
                    {property.priceType}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    مميز
                  </Badge>
                </div>
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
                      {property.priceType.includes('شهريًا') ? ' / شهر' : ''}
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
                  <Button variant="outline" size="sm" className="group w-full">
                    عرض التفاصيل
                    <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="hero" size="lg">
            عرض جميع العقارات
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
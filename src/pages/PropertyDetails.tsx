import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProperty } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Bath, 
  Bed, 
  Square, 
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  ArrowLeft,
  Star,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { property, loading, error } = useProperty(id || "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-96 w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                العقار غير موجود
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "لم يتم العثور على العقار المطلوب"}
              </p>
              <Button onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للخلف
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للعقارات
            </Button>
          </nav>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 ml-2" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                  <span className="text-lg text-muted-foreground font-normal">
                    {property.price_type.includes('شهريًا') ? ' / شهر' : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {property.price_type}
                </Badge>
                {property.is_featured && (
                  <Badge className="text-lg px-4 py-2">
                    <Star className="w-4 h-4 ml-1 fill-current" />
                    مميز
                  </Badge>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex items-center gap-6 text-muted-foreground">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span className="font-medium">{property.bedrooms} غرف نوم</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5" />
                <span className="font-medium">{property.bathrooms} حمام</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                <span className="font-medium">{property.area} م²</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {new Date(property.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <img
                  src={property.images[selectedImageIndex] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop"}
                  alt={property.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-1">
                <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                  {property.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=200&h=150&fit=crop"}
                      alt={`${property.title} - ${index + 1}`}
                      className={`w-full h-20 lg:h-24 object-cover rounded cursor-pointer transition-all ${
                        selectedImageIndex === index ? 'ring-2 ring-primary' : 'hover:ring-1 ring-muted'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">وصف العقار</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || "لا يوجد وصف متاح لهذا العقار حاليًا."}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">مميزات العقار</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-4">المرافق والخدمات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-secondary" />
                          <span className="text-muted-foreground">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-6">تواصل مع المسوق</h3>
                  
                  {property.agent_name && (
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">{property.agent_name}</h4>
                      <p className="text-sm text-muted-foreground">مسوق عقاري</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {property.agent_phone && (
                      <Button className="w-full" size="lg">
                        <Phone className="w-5 h-5 ml-2" />
                        اتصل الآن
                      </Button>
                    )}
                    
                    {property.agent_email && (
                      <Button variant="outline" className="w-full" size="lg">
                        <Mail className="w-5 h-5 ml-2" />
                        أرسل رسالة
                      </Button>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 ml-2" />
                        حفظ
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 ml-2" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
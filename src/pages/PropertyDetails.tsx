import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProperty } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactRequestForm } from "@/components/ContactRequestForm";
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
  CheckCircle,
  Building,
  Ruler,
  Car,
  Home,
  MessageSquare,
  Eye,
  Clock
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 bg-muted/30 rounded-lg">
              {property.bedrooms > 0 && (
                <div className="flex flex-col items-center text-center">
                  <Bed className="w-6 h-6 text-primary mb-2" />
                  <span className="font-bold text-lg text-foreground">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">غرف نوم</span>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <Bath className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg text-foreground">{property.bathrooms}</span>
                <span className="text-sm text-muted-foreground">حمام</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Square className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg text-foreground">{property.area}</span>
                <span className="text-sm text-muted-foreground">م²</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Building className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg text-foreground">{property.property_type}</span>
                <span className="text-sm text-muted-foreground">نوع العقار</span>
              </div>
              {property.parking && property.parking > 0 && (
                <div className="flex flex-col items-center text-center">
                  <Car className="w-6 h-6 text-primary mb-2" />
                  <span className="font-bold text-lg text-foreground">{property.parking}</span>
                  <span className="text-sm text-muted-foreground">موقف سيارة</span>
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <Calendar className="w-6 h-6 text-primary mb-2" />
                <span className="font-bold text-lg text-foreground">
                  {new Date(property.created_at).toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })}
                </span>
                <span className="text-sm text-muted-foreground">تاريخ الإعلان</span>
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

              {/* Additional Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">تفاصيل إضافية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-muted-foreground">نوع العقار:</span>
                        <span className="font-medium text-foreground">{property.property_type}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-muted-foreground">المساحة:</span>
                        <span className="font-medium text-foreground">{property.area} متر مربع</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-muted-foreground">عدد غرف النوم:</span>
                        <span className="font-medium text-foreground">{property.bedrooms || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-muted-foreground">عدد الحمامات:</span>
                        <span className="font-medium text-foreground">{property.bathrooms}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {property.floor_number && (
                        <div className="flex justify-between items-center py-2 border-b border-muted">
                          <span className="text-muted-foreground">رقم الطابق:</span>
                          <span className="font-medium text-foreground">{property.floor_number}</span>
                        </div>
                      )}
                      {property.build_year && (
                        <div className="flex justify-between items-center py-2 border-b border-muted">
                          <span className="text-muted-foreground">سنة البناء:</span>
                          <span className="font-medium text-foreground">{property.build_year}</span>
                        </div>
                      )}
                      {property.parking && property.parking > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-muted">
                          <span className="text-muted-foreground">مواقف السيارات:</span>
                          <span className="font-medium text-foreground">{property.parking}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-muted-foreground">حالة العقار:</span>
                        <span className="font-medium text-foreground">{property.special_type || 'عادي'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">الموقع</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="text-lg font-medium text-foreground">{property.location}</p>
                      <p className="text-muted-foreground mt-1">
                        يقع هذا العقار في موقع متميز يوفر سهولة الوصول لجميع الخدمات والمرافق الأساسية.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Company Contact Card */}
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-6">تواصل مع الشركة</h3>
                    
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">شركة إنسباير العقارية</h4>
                          <p className="text-sm text-muted-foreground">خبرة تمتد لأكثر من 10 سنوات</p>
                        </div>
                      </div>
                      
                      {property.agent_name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>المستشار المختص: {property.agent_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-6">
                      <ContactRequestForm 
                        propertyId={property.id} 
                        propertyTitle={property.title}
                      />
                      
                      {property.agent_phone && (
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <a href={`tel:${property.agent_phone}`}>
                            <Phone className="w-5 h-5 ml-2" />
                            {property.agent_phone}
                          </a>
                        </Button>
                      )}
                      
                      {property.agent_email && (
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <a href={`mailto:${property.agent_email}?subject=استفسار عن ${property.title}`}>
                            <Mail className="w-5 h-5 ml-2" />
                            إرسال إيميل
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 ml-2" />
                        حفظ
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: property.title,
                            text: `شاهد هذا العقار الرائع: ${property.title}`,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}>
                        <Share2 className="w-4 h-4 ml-2" />
                        مشاركة
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">معلومات سريعة</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">متاح للمعاينة يومياً</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">رد فوري على الاستفسارات</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">استشارة مجانية</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
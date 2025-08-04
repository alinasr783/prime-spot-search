import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProperty } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactRequestForm } from "@/components/ContactRequestForm";
import inspireLogo from "@/assets/inspire-logo.png";
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
  ArrowRight,
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
      
      <div className="pt-16">
        {/* Property Images - Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] bg-muted overflow-hidden">
          <img
            src={property.images[selectedImageIndex] || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=800&fit=crop"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : property.images.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg h-12 w-12"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSelectedImageIndex(selectedImageIndex < property.images.length - 1 ? selectedImageIndex + 1 : 0)}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg h-12 w-12"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </>
          )}
          
          {/* Image Navigation Overlay */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                {property.images.slice(0, 6).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      selectedImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
                {property.images.length > 6 && (
                  <span className="text-white/70 text-sm px-2">+{property.images.length - 6}</span>
                )}
              </div>
            </div>
          )}

          {/* Back Button Overlay */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.history.back()}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </div>
        </div>

        
        {/* Content Container */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Property Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {property.is_featured && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      <Star className="w-4 h-4 ml-1 fill-current" />
                      مميز
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    {property.price_type}
                  </Badge>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {property.title}
                </h1>
                
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5 ml-2 text-primary" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              
              <div className="lg:text-left">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(property.price)}
                </div>
                <span className="text-muted-foreground">
                  {property.price_type.includes('شهريًا') ? 'شهرياً' : 'إجمالي'}
                </span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {property.bedrooms > 0 && (
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Bed className="w-8 h-8 text-primary mb-3" />
                  <span className="font-bold text-2xl text-foreground">{property.bedrooms}</span>
                  <span className="text-sm text-muted-foreground">غرف نوم</span>
                </div>
              )}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                <Bath className="w-8 h-8 text-secondary mb-3" />
                <span className="font-bold text-2xl text-foreground">{property.bathrooms}</span>
                <span className="text-sm text-muted-foreground">حمام</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Square className="w-8 h-8 text-primary mb-3" />
                <span className="font-bold text-2xl text-foreground">{property.area}</span>
                <span className="text-sm text-muted-foreground">م²</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50 border border-border/50">
                <Building className="w-8 h-8 text-muted-foreground mb-3" />
                <span className="font-bold text-lg text-foreground">{property.property_type}</span>
                <span className="text-sm text-muted-foreground">نوع العقار</span>
              </div>
              {property.parking && property.parking > 0 && (
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-accent/5 border border-accent/10">
                  <Car className="w-8 h-8 text-accent mb-3" />
                  <span className="font-bold text-2xl text-foreground">{property.parking}</span>
                  <span className="text-sm text-muted-foreground">موقف سيارة</span>
                </div>
              )}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/50 border border-border/50">
                <Calendar className="w-8 h-8 text-muted-foreground mb-3" />
                <span className="font-bold text-lg text-foreground">
                  {new Date(property.created_at).toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })}
                </span>
                <span className="text-sm text-muted-foreground">تاريخ الإعلان</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  وصف العقار
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {property.description || "لا يوجد وصف متاح لهذا العقار حاليًا."}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-secondary rounded-full"></div>
                    مميزات العقار
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-accent rounded-full"></div>
                    المرافق والخدمات
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-muted-foreground rounded-full"></div>
                  تفاصيل إضافية
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground font-medium">نوع العقار:</span>
                      <span className="font-semibold text-foreground">{property.property_type}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground font-medium">المساحة:</span>
                      <span className="font-semibold text-foreground">{property.area} متر مربع</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground font-medium">عدد غرف النوم:</span>
                      <span className="font-semibold text-foreground">{property.bedrooms || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground font-medium">عدد الحمامات:</span>
                      <span className="font-semibold text-foreground">{property.bathrooms}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {property.floor_number && (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground font-medium">رقم الطابق:</span>
                        <span className="font-semibold text-foreground">{property.floor_number}</span>
                      </div>
                    )}
                    {property.build_year && (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground font-medium">سنة البناء:</span>
                        <span className="font-semibold text-foreground">{property.build_year}</span>
                      </div>
                    )}
                    {property.parking && property.parking > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="text-muted-foreground font-medium">مواقف السيارات:</span>
                        <span className="font-semibold text-foreground">{property.parking}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground font-medium">حالة العقار:</span>
                      <span className="font-semibold text-foreground">{property.special_type || 'عادي'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  الموقع
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <MapPin className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xl font-semibold text-foreground mb-2">{property.location}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        يقع هذا العقار في موقع متميز يوفر سهولة الوصول لجميع الخدمات والمرافق الأساسية مثل المدارس والمستشفيات ومراكز التسوق ووسائل المواصلات العامة.
                      </p>
                    </div>
                  </div>
                  
                  {/* Google Maps Dynamic Location */}
                  <div className="rounded-xl overflow-hidden border border-border/20 shadow-sm">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz1n_GQjs&q=${encodeURIComponent(property.location + ', مصر')}&zoom=15&maptype=roadmap&language=ar&region=EG`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                      title={`خريطة موقع ${property.location}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Company Contact Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sticky top-4">
                  <h3 className="text-2xl font-bold text-foreground mb-8 text-center">تواصل معنا</h3>
                  
                  <div className="mb-8 text-center">
                    <div className="w-24 h-24 bg-background rounded-full p-3 flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-border/20">
                      <img 
                        src={inspireLogo} 
                        alt="شركة إنسباير العقارية" 
                        className="w-full h-full object-contain dark:invert dark:brightness-0 dark:contrast-100"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">شركة إنسباير العقارية</h4>
                    <p className="text-muted-foreground">شريكك المثالي في عالم العقارات</p>
                    {property.agent_name && (
                      <p className="text-sm text-primary font-medium mt-2">
                        المستشار المختص: {property.agent_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    <ContactRequestForm 
                      propertyId={property.id} 
                      propertyTitle={property.title}
                      trigger={
                        <Button className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                          <MessageSquare className="w-5 h-5 ml-2" />
                          طلب تواصل
                        </Button>
                      }
                    />
                    
                    {property.agent_phone && (
                      <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-2 hover:bg-primary/5" asChild>
                        <a href={`tel:${property.agent_phone}`}>
                          <Phone className="w-5 h-5 ml-2" />
                          {property.agent_phone}
                        </a>
                      </Button>
                    )}
                    
                    {property.agent_email && (
                      <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-2 hover:bg-secondary/5" asChild>
                        <a href={`mailto:${property.agent_email}?subject=استفسار عن ${property.title}`}>
                          <Mail className="w-5 h-5 ml-2" />
                          إرسال إيميل
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border">
                    <Button variant="outline" size="lg" className="flex-1 rounded-xl hover:bg-red-50 hover:border-red-200">
                      <Heart className="w-5 h-5 ml-2" />
                      حفظ
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 rounded-xl hover:bg-blue-50 hover:border-blue-200" onClick={() => {
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
                      <Share2 className="w-5 h-5 ml-2" />
                      مشاركة
                    </Button>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4 text-center">خدماتنا المتميزة</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">متاح للمعاينة يومياً</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">رد فوري على الاستفسارات</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">استشارة مجانية</span>
                    </div>
                  </div>
                </div>
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
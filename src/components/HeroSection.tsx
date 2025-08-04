import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import SearchForm, { SearchFilters } from "./SearchForm";

const HeroSection = () => {
  const handleSearch = (filters: SearchFilters) => {
    console.log("البحث عن:", filters);
    // هنا يمكن إضافة منطق البحث أو التوجيه لصفحة النتائج
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/90 via-primary-light/80 to-secondary/70 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-300"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary-glow/30 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            اعثر على
            <span className="bg-gradient-to-r from-secondary to-warning bg-clip-text text-transparent block">
              عقارك المثالي
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            منصة العقارات الأولى في المملكة العربية السعودية
            <br />
            اكتشف أفضل العقارات للبيع والإيجار في جميع أنحاء المملكة
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" className="group">
              اعثر على عقارك الآن
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
              <Phone className="w-5 h-5 ml-2" />
              تواصل معنا الآن
            </Button>
          </div>
        </div>

        {/* Advanced Search Form */}
        <div className="max-w-6xl mx-auto">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">10,000+</div>
            <div className="text-white/80">عقار متاح</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">5,000+</div>
            <div className="text-white/80">عميل راضي</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">50+</div>
            <div className="text-white/80">مدينة</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">24/7</div>
            <div className="text-white/80">دعم العملاء</div>
          </div>
        </div>
      </div>

      {/* Wave Effect at Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
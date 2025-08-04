import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Home, DollarSign, Bath, Bed } from "lucide-react";

interface SearchFormProps {
  className?: string;
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceType: string;
  bedrooms: string;
  bathrooms: string;
  priceMin: string;
  priceMax: string;
}

const SearchForm = ({ className, onSearch }: SearchFormProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    priceType: "",
    bedrooms: "",
    bathrooms: "",
    priceMin: "",
    priceMax: "",
  });

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const locations = [
    "القاهرة",
    "الجيزة", 
    "الاسكندرية",
    "الشرقية",
    "القليوبية",
    "الدقهلية",
    "البحيرة",
    "المنوفية",
    "الغربية",
    "كفر الشيخ",
    "دمياط",
    "بورسعيد",
    "الاسماعيلية",
    "السويس",
    "شمال سيناء",
    "جنوب سيناء",
    "البحر الأحمر",
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "أسوان",
    "الأقصر",
    "الوادي الجديد",
    "مطروح"
  ];

  const propertyTypes = [
    "شقة",
    "فيلا",
    "استوديو",
    "دوبلكس",
    "بنتهاوس",
    "مكتب",
    "محل تجاري",
    "مستودع",
    "أرض"
  ];

  return (
    <Card className={`p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          ابحث عن عقارك المناسب
        </h2>
        <p className="text-lg text-muted-foreground">
          اكتشف أفضل العقارات في مصر
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* الموقع - الأهم */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            المحافظة
          </label>
          <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="اختر المحافظة" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="text-right">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع العقار */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            نوع العقار
          </label>
          <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="نوع الوحدة" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-right">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع العرض */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            نوع العرض
          </label>
          <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="إيجار أو بيع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="للبيع" className="text-right">للبيع</SelectItem>
              <SelectItem value="للإيجار" className="text-right">للإيجار</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* عدد غرف النوم */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <Bed className="w-5 h-5 text-primary" />
            غرف النوم
          </label>
          <Select value={filters.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="عدد الغرف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-right">1 غرفة</SelectItem>
              <SelectItem value="2" className="text-right">2 غرفة</SelectItem>
              <SelectItem value="3" className="text-right">3 غرف</SelectItem>
              <SelectItem value="4" className="text-right">4 غرف</SelectItem>
              <SelectItem value="5+" className="text-right">5+ غرف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* عدد غرف الحمام */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <Bath className="w-5 h-5 text-primary" />
            غرف الحمام
          </label>
          <Select value={filters.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="عدد الحمامات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-right">1 حمام</SelectItem>
              <SelectItem value="2" className="text-right">2 حمام</SelectItem>
              <SelectItem value="3" className="text-right">3 حمامات</SelectItem>
              <SelectItem value="4+" className="text-right">4+ حمامات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* السعر من */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground">
            السعر من (جنيه)
          </label>
          <Input 
            type="number"
            placeholder="أقل سعر"
            value={filters.priceMin}
            onChange={(e) => handleInputChange("priceMin", e.target.value)}
            className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors"
          />
        </div>

        {/* السعر إلى */}
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground">
            السعر إلى (جنيه)
          </label>
          <Input 
            type="number"
            placeholder="أعلى سعر"
            value={filters.priceMax}
            onChange={(e) => handleInputChange("priceMax", e.target.value)}
            className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="search"
          onClick={handleSearch}
          className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold"
        >
          <Search className="w-5 h-5 ml-2" />
          ابحث الآن
        </Button>
      </div>
    </Card>
  );
};

export default SearchForm;
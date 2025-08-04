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
    "الرياض",
    "جدة", 
    "الدمام",
    "مكة المكرمة",
    "المدينة المنورة",
    "الطائف",
    "تبوك",
    "بريدة",
    "خميس مشيط",
    "الأحساء"
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
    <Card className={`p-6 bg-white/95 backdrop-blur-md shadow-2xl border-0 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* الموقع */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            الموقع
          </label>
          <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className="h-12 text-right">
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع العقار */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Home className="w-4 h-4" />
            نوع العقار
          </label>
          <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
            <SelectTrigger className="h-12 text-right">
              <SelectValue placeholder="نوع الوحدة" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع السعر */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            نوع العرض
          </label>
          <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
            <SelectTrigger className="h-12 text-right">
              <SelectValue placeholder="إيجار أو تمليك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="للبيع">للبيع</SelectItem>
              <SelectItem value="للإيجار">للإيجار</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* عدد الغرف */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Bed className="w-4 h-4" />
            عدد الغرف
          </label>
          <Select value={filters.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
            <SelectTrigger className="h-12 text-right">
              <SelectValue placeholder="عدد الغرف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 غرفة</SelectItem>
              <SelectItem value="2">2 غرفة</SelectItem>
              <SelectItem value="3">3 غرف</SelectItem>
              <SelectItem value="4">4 غرف</SelectItem>
              <SelectItem value="5+">5+ غرف</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* عدد الحمامات */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Bath className="w-4 h-4" />
            عدد الحمامات
          </label>
          <Select value={filters.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
            <SelectTrigger className="h-12 text-right">
              <SelectValue placeholder="عدد الحمامات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 حمام</SelectItem>
              <SelectItem value="2">2 حمام</SelectItem>
              <SelectItem value="3">3 حمامات</SelectItem>
              <SelectItem value="4+">4+ حمامات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* السعر من */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            السعر من (ريال)
          </label>
          <Input 
            type="number"
            placeholder="أقل سعر"
            value={filters.priceMin}
            onChange={(e) => handleInputChange("priceMin", e.target.value)}
            className="h-12 text-right"
          />
        </div>

        {/* السعر إلى */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            السعر إلى (ريال)
          </label>
          <Input 
            type="number"
            placeholder="أعلى سعر"
            value={filters.priceMax}
            onChange={(e) => handleInputChange("priceMax", e.target.value)}
            className="h-12 text-right"
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
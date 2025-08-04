import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, MapPin, Home, DollarSign, Bath, Bed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface Location {
  id: string;
  name: string;
  city: string;
  governorate: string;
}

const SearchForm = ({ className, onSearch }: SearchFormProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    priceType: "",
    bedrooms: "",
    bathrooms: "",
    priceMin: "",
    priceMax: "",
  });

  // Fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data || []);
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

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
    <Card className={`p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          ابحث عن عقارك المناسب
        </h2>
        <p className="text-lg text-muted-foreground">
          اكتشف أفضل العقارات في مصر
        </p>
      </div>

      {/* الموقع - سطر كامل */}
      <div className="mb-8">
        <div className="space-y-3">
          <label className="text-base font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            المنطقة
          </label>
          <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className="h-14 text-right text-lg border-2 border-muted hover:border-primary transition-colors">
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.name} className="text-right">
                  {location.name} - {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* نوع العقار ونوع العرض - سطر واحد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          className="w-full h-14 text-lg font-bold"
        >
          <Search className="w-5 h-5 ml-2" />
          ابحث الآن
        </Button>
      </div>
    </Card>
  );
};

export default SearchForm;
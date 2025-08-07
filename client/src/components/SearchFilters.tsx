import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, DollarSign, Bath, Bed, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
}

const SearchFilters = ({ filters, onFiltersChange, onApplyFilters }: SearchFiltersProps) => {
  const [locations, setLocations] = useState<Location[]>([]);

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
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      location: "",
      propertyType: "",
      priceType: "",
      bedrooms: "",
      bathrooms: "",
      priceMin: "",
      priceMax: "",
    };
    onFiltersChange(resetFilters);
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
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Home className="w-5 h-5 text-primary" />
          تصفية النتائج
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الموقع */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            المنطقة
          </label>
          <Select value={filters.location || "all"} onValueChange={(value) => handleInputChange("location", value === "all" ? "" : value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">جميع المناطق</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.name} className="text-right">
                  {location.name} - {location.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* نوع العقار */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            نوع العقار
          </label>
          <Select value={filters.propertyType || "all"} onValueChange={(value) => handleInputChange("propertyType", value === "all" ? "" : value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="نوع الوحدة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">جميع الأنواع</SelectItem>
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
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            نوع العرض
          </label>
          <Select value={filters.priceType || "all"} onValueChange={(value) => handleInputChange("priceType", value === "all" ? "" : value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="إيجار أو بيع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">جميع الأنواع</SelectItem>
              <SelectItem value="للبيع" className="text-right">للبيع</SelectItem>
              <SelectItem value="للإيجار" className="text-right">للإيجار</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* عدد غرف النوم */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            غرف النوم
          </label>
          <Select value={filters.bedrooms || "all"} onValueChange={(value) => handleInputChange("bedrooms", value === "all" ? "" : value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="عدد الغرف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">أي عدد</SelectItem>
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
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Bath className="w-4 h-4 text-primary" />
            غرف الحمام
          </label>
          <Select value={filters.bathrooms || "all"} onValueChange={(value) => handleInputChange("bathrooms", value === "all" ? "" : value)}>
            <SelectTrigger className="text-right">
              <SelectValue placeholder="عدد الحمامات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-right">أي عدد</SelectItem>
              <SelectItem value="1" className="text-right">1 حمام</SelectItem>
              <SelectItem value="2" className="text-right">2 حمام</SelectItem>
              <SelectItem value="3" className="text-right">3 حمامات</SelectItem>
              <SelectItem value="4+" className="text-right">4+ حمامات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* السعر من - إلى */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">نطاق السعر (جنيه)</label>
          <div className="grid grid-cols-2 gap-3">
            <Input 
              type="number"
              placeholder="أقل سعر"
              value={filters.priceMin}
              onChange={(e) => handleInputChange("priceMin", e.target.value)}
              className="text-right"
            />
            <Input 
              type="number"
              placeholder="أعلى سعر"
              value={filters.priceMax}
              onChange={(e) => handleInputChange("priceMax", e.target.value)}
              className="text-right"
            />
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="space-y-3 pt-4 border-t">
          <Button onClick={onApplyFilters} className="w-full">
            تطبيق الفلاتر
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
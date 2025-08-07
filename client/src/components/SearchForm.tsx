import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, MapPin, DollarSign, Bath, Bed, Building, CalendarCheck, Home, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SearchFormProps {
  className?: string;
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  propertySubType: string;
  priceType: string;
  bedrooms: string;
  bathrooms: string;
  priceMin: string;
  priceMax: string;
  maxDownPayment: string;
  propertyStatus: string;
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
    propertySubType: "",
    priceType: "",
    bedrooms: "",
    bathrooms: "",
    priceMin: "",
    priceMax: "",
    maxDownPayment: "",
    propertyStatus: ""
  });
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const propertySubTypes = [
    "شاليه",
    "تاون هاوس",
    "تاون فيلا",
    "روف"
  ];

  const propertyStatuses = [
    "جاهز",
    "قيد الإنشاء",
    "الجميع"
  ];

  const displayPriceRange = () => {
    if (filters.priceMin && filters.priceMax) {
      return `${filters.priceMin} - ${filters.priceMax} ج.م`;
    } else if (filters.priceMin) {
      return `من ${filters.priceMin} ج.م`;
    } else if (filters.priceMax) {
      return `إلى ${filters.priceMax} ج.م`;
    }
    return "نطاق السعر";
  };

  const PricePopupContent = () => (
    <div className="space-y-4 w-full">
      <h4 className="font-medium text-right mb-4">تحديد نطاق السعر</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1 text-right">السعر الأدنى</label>
          <Input
            type="number"
            placeholder="أدخل السعر الأدنى"
            value={filters.priceMin}
            onChange={(e) => handleInputChange("priceMin", e.target.value)}
            className="h-12 text-right w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1 text-right">السعر الأقصى</label>
          <Input
            type="number"
            placeholder="أدخل السعر الأقصى"
            value={filters.priceMax}
            onChange={(e) => handleInputChange("priceMax", e.target.value)}
            className="h-12 text-right w-full"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1 text-right">أعلى مقدم (اختياري)</label>
          <Input
            type="number"
            placeholder="أدخل أعلى مقدم"
            value={filters.maxDownPayment}
            onChange={(e) => handleInputChange("maxDownPayment", e.target.value)}
            className="h-12 text-right w-full"
          />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          onClick={() => {
            handleInputChange("priceMin", "");
            handleInputChange("priceMax", "");
            handleInputChange("maxDownPayment", "");
          }}
          className="text-primary"
        >
          مسح الكل
        </Button>
        <Button className="bg-primary hover:bg-primary-dark">
          تطبيق
        </Button>
      </div>
    </div>
  );

  return (
    <Card className={`p-4 bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl w-full max-w-6xl mx-auto ${className}`}>
      {/* السطر الأول: الموقع فقط */}
      <div className="mb-4">
        <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
          <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <SelectValue placeholder="جميع المناطق" />
            </div>
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

      {/* السطر الثاني: نوع العقار والنوع التفصيلي للجوال - نوع العرض وحالة المشروع للكمبيوتر */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* للجوال: نوع العقار والنوع التفصيلي في سطر واحد */}
        {isMobile ? (
          <>
            <div>
              <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="النوع" />
                  </div>
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
            <div>
              <Select value={filters.propertySubType} onValueChange={(value) => handleInputChange("propertySubType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="التفاصيل" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {propertySubTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-right">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-1">
              <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="نوع العرض" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="للبيع" className="text-right">للبيع</SelectItem>
                  <SelectItem value="للإيجار" className="text-right">للإيجار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Select value={filters.propertyStatus} onValueChange={(value) => handleInputChange("propertyStatus", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="حالة العقار" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status} value={status} className="text-right">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* السطر الثالث: للكمبيوتر - نوع العقار والنوع التفصيلي، للجوال - نوع العرض وحالة المشروع */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {isMobile ? (
          <>
            <div>
              <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="العرض" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="للبيع" className="text-right">بيع</SelectItem>
                  <SelectItem value="للإيجار" className="text-right">إيجار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filters.propertyStatus} onValueChange={(value) => handleInputChange("propertyStatus", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="الحالة" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status} value={status} className="text-right">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div>
              <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="نوع العقار" />
                  </div>
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
            <div>
              <Select value={filters.propertySubType} onValueChange={(value) => handleInputChange("propertySubType", value)}>
                <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    <SelectValue placeholder="النوع التفصيلي" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {propertySubTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-right">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* السطر الرابع: غرف النوم والحمامات في سطر واحد */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Select value={filters.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-primary" />
                <SelectValue placeholder="غرف النوم" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-right">1</SelectItem>
              <SelectItem value="2" className="text-right">2</SelectItem>
              <SelectItem value="3" className="text-right">3</SelectItem>
              <SelectItem value="4" className="text-right">4</SelectItem>
              <SelectItem value="5+" className="text-right">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filters.bathrooms} onValueChange={(value) => handleInputChange("bathrooms", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-primary" />
                <SelectValue placeholder="الحمامات" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-right">1</SelectItem>
              <SelectItem value="2" className="text-right">2</SelectItem>
              <SelectItem value="3" className="text-right">3</SelectItem>
              <SelectItem value="4+" className="text-right">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* السعر - يستخدم Drawer للجوال و Popover للكمبيوتر */}
      <div className="mb-4">
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span>{displayPriceRange()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4 h-[60vh]">
              <div className="p-4">
                <PricePopupContent />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span>{displayPriceRange()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4" align="end">
              <PricePopupContent />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* زر البحث */}
      <div>
        <Button 
          onClick={handleSearch}
          className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold text-lg"
        >
          <Search className="w-5 h-5 ml-2" />
          بحث
        </Button>
      </div>
    </Card>
  );
};

export default SearchForm;
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, MapPin, DollarSign, Bath, Bed, Building, CalendarCheck, Home, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
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
  const [openPriceDialog, setOpenPriceDialog] = useState(false);
  const [openRoomsDialog, setOpenRoomsDialog] = useState(false);
  const [openPropertyTypeDialog, setOpenPropertyTypeDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredLocations = useMemo(() => {
    if (!locationSearchTerm) return locations;
    const term = locationSearchTerm.toLowerCase();
    return locations.filter(loc => 
      loc.name.toLowerCase().includes(term) || 
      loc.city.toLowerCase().includes(term) ||
      loc.governorate.toLowerCase().includes(term)
    );
  }, [locations, locationSearchTerm]);

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

  const propertyTypes = ["شقة", "فيلا", "استوديو", "دوبلكس", "بنتهاوس", "مكتب", "محل تجاري", "مستودع", "أرض"];
  const propertySubTypes = ["شاليه", "تاون هاوس", "تاون فيلا", "روف"];
  const propertyStatuses = ["جاهز", "قيد الإنشاء"];
  const priceTypes = ["للبيع", "للإيجار"];
  const bedroomOptions = ["1", "2", "3", "4", "5+"];
  const bathroomOptions = ["1", "2", "3", "4+"];

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

  const displayRoomsBathrooms = () => {
    const beds = filters.bedrooms || "نوم";
    const baths = filters.bathrooms || "حمام";
    return `${beds} & ${baths}`;
  };

  const displayPropertyType = () => {
    const type = filters.propertyType || "نوع العقار";
    const subType = filters.propertySubType ? ` (${filters.propertySubType})` : "";
    return `${type}${subType}`;
  };

  const PricePopupContent = () => (
    <div className="space-y-4 w-full p-4">
      <VisuallyHidden>
        <h2>تحديد نطاق السعر</h2>
      </VisuallyHidden>
      <h4 className="font-medium text-right text-lg">تحديد نطاق السعر</h4>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">السعر من</label>
          <Input
            type="number"
            placeholder="أدخل السعر الأدنى"
            value={filters.priceMin}
            onChange={(e) => handleInputChange("priceMin", e.target.value)}
            className="h-12 text-right w-full text-base border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">السعر إلى</label>
          <Input
            type="number"
            placeholder="أدخل السعر الأقصى"
            value={filters.priceMax}
            onChange={(e) => handleInputChange("priceMax", e.target.value)}
            className="h-12 text-right w-full text-base border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">أعلى مقدم (اختياري)</label>
          <Input
            type="number"
            placeholder="أدخل أعلى مقدم"
            value={filters.maxDownPayment}
            onChange={(e) => handleInputChange("maxDownPayment", e.target.value)}
            className="h-12 text-right w-full text-base border-gray-300"
          />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button 
          variant="ghost" 
          onClick={() => {
            handleInputChange("priceMin", "");
            handleInputChange("priceMax", "");
            handleInputChange("maxDownPayment", "");
          }}
          className="text-primary hover:text-primary-dark text-base"
        >
          مسح الكل
        </Button>
        <Button 
          className="bg-primary hover:bg-primary-dark text-base"
          onClick={() => setOpenPriceDialog(false)}
        >
          تطبيق
        </Button>
      </div>
    </div>
  );

  const RoomsPopupContent = () => (
    <div className="space-y-4 w-full p-4">
      <VisuallyHidden>
        <h2>تحديد الغرف والحمامات</h2>
      </VisuallyHidden>
      <h4 className="font-medium text-right text-lg">تحديد الغرف والحمامات</h4>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">غرف النوم</label>
          <div className="grid grid-cols-3 gap-2">
            {bedroomOptions.map((opt) => (
              <Button
                key={`bed-${opt}`}
                variant={filters.bedrooms === opt ? "default" : "outline"}
                onClick={() => handleInputChange("bedrooms", opt)}
                className="h-12"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">الحمامات</label>
          <div className="grid grid-cols-3 gap-2">
            {bathroomOptions.map((opt) => (
              <Button
                key={`bath-${opt}`}
                variant={filters.bathrooms === opt ? "default" : "outline"}
                onClick={() => handleInputChange("bathrooms", opt)}
                className="h-12"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button 
          className="bg-primary hover:bg-primary-dark text-base"
          onClick={() => setOpenRoomsDialog(false)}
        >
          تطبيق
        </Button>
      </div>
    </div>
  );

  const PropertyTypePopupContent = () => (
    <div className="space-y-4 w-full p-4">
      <VisuallyHidden>
        <h2>تحديد نوع العقار</h2>
      </VisuallyHidden>
      <h4 className="font-medium text-right text-lg">تحديد نوع العقار</h4>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">النوع الأساسي</label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <Button
                key={`type-${type}`}
                variant={filters.propertyType === type ? "default" : "outline"}
                onClick={() => handleInputChange("propertyType", type)}
                className="h-12"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2 text-right">النوع التفصيلي</label>
          <div className="grid grid-cols-2 gap-2">
            {propertySubTypes.map((type) => (
              <Button
                key={`subtype-${type}`}
                variant={filters.propertySubType === type ? "default" : "outline"}
                onClick={() => handleInputChange("propertySubType", type)}
                className="h-12"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button 
          className="bg-primary hover:bg-primary-dark text-base"
          onClick={() => setOpenPropertyTypeDialog(false)}
        >
          تطبيق
        </Button>
      </div>
    </div>
  );

  const DesktopLayout = () => (
    <>
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <SelectValue placeholder="جميع المناطق" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[60vh]">
              <div className="p-2">
                <Input
                  placeholder="ابحث عن منطقة..."
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                  className="mb-2"
                />
              </div>
              {filteredLocations.map((location) => (
                <SelectItem key={location.id} value={location.name} className="text-right text-base">
                  {location.name} - {location.city}
                </SelectItem>
              ))}
              {filteredLocations.length === 0 && (
                <div className="text-center py-4 text-gray-500">لا توجد نتائج</div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <SelectValue placeholder="نوع العرض" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {priceTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-right text-base">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-48">
          <Dialog open={openPropertyTypeDialog} onOpenChange={setOpenPropertyTypeDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Home className="w-5 h-5 text-primary" />
                  <span>{displayPropertyType()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <PropertyTypePopupContent />
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-48">
          <Select value={filters.propertyStatus} onValueChange={(value) => handleInputChange("propertyStatus", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <SelectValue placeholder="حالة العقار" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {propertyStatuses.map((status) => (
                <SelectItem key={status} value={status} className="text-right text-base">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Dialog open={openRoomsDialog} onOpenChange={setOpenRoomsDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Bed className="w-5 h-5 text-primary" />
                  <span>{displayRoomsBathrooms()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <RoomsPopupContent />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Dialog open={openPriceDialog} onOpenChange={setOpenPriceDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span>{displayPriceRange()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <PricePopupContent />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <Button 
          onClick={handleSearch}
          className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold text-lg"
        >
          <Search className="w-5 h-5 ml-2" />
          بحث
        </Button>
      </div>
    </>
  );

  const MobileLayout = () => (
    <>
      <div className="mb-4">
        <Select value={filters.location} onValueChange={(value) => handleInputChange("location", value)}>
          <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <SelectValue placeholder="جميع المناطق" />
            </div>
          </SelectTrigger>
          <SelectContent className="max-h-[60vh]">
            <div className="p-2">
              <Input
                placeholder="ابحث عن منطقة..."
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredLocations.map((location) => (
              <SelectItem key={location.id} value={location.name} className="text-right text-base">
                {location.name} - {location.city}
              </SelectItem>
            ))}
            {filteredLocations.length === 0 && (
              <div className="text-center py-4 text-gray-500">لا توجد نتائج</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Dialog open={openPropertyTypeDialog} onOpenChange={setOpenPropertyTypeDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="truncate">{displayPropertyType()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <PropertyTypePopupContent />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog open={openRoomsDialog} onOpenChange={setOpenRoomsDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="truncate">{displayRoomsBathrooms()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <RoomsPopupContent />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Select value={filters.priceType} onValueChange={(value) => handleInputChange("priceType", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <SelectValue placeholder="نوع العرض" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {priceTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-right text-base">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filters.propertyStatus} onValueChange={(value) => handleInputChange("propertyStatus", value)}>
            <SelectTrigger className="h-14 w-full text-right border-2 border-gray-200 hover:border-primary transition-colors text-base">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <SelectValue placeholder="حالة العقار" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {propertyStatuses.map((status) => (
                <SelectItem key={status} value={status} className="text-right text-base">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <Dialog open={openPriceDialog} onOpenChange={setOpenPriceDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="h-14 w-full flex justify-between items-center border-2 border-gray-200 hover:border-primary transition-colors text-base"
            >
              <div className="flex items-center gap-3 text-gray-700">
                <DollarSign className="w-5 h-5 text-primary" />
                <span>{displayPriceRange()}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <PricePopupContent />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Button 
          onClick={handleSearch}
          className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold text-lg"
        >
          <Search className="w-5 h-5 ml-2" />
          بحث
        </Button>
      </div>
    </>
  );

  return (
    <Card className={`p-4 bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl w-full max-w-6xl mx-auto ${className}`}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </Card>
  );
};

export default SearchForm;
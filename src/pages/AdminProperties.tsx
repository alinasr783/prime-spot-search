import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProperties } from '@/hooks/useProperties';
import { useLocations } from '@/hooks/useLocations';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  MapPin,
  Star,
  Eye,
  DollarSign
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';
import { ImageUploader } from '@/components/ImageUploader';

const AdminProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { properties, loading: propertiesLoading } = useProperties();
  const { locations } = useLocations();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    price_type: 'للبيع',
    property_type: 'شقة',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    parking: 0,
    images: [''],
    features: [''],
    amenities: [''],
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    agent_image: '',
    is_featured: false,
    special_type: 'عادي'
  });

  // Check auth
  useEffect(() => {
    const adminData = localStorage.getItem('adminAuth');
    if (!adminData) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      price: '',
      price_type: 'للبيع',
      property_type: 'شقة',
      bedrooms: 0,
      bathrooms: 0,
      area: '',
      parking: 0,
      images: [''],
      features: [''],
      amenities: [''],
      agent_name: '',
      agent_phone: '',
      agent_email: '',
      agent_image: '',
      is_featured: false,
      special_type: 'عادي'
    });
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter empty strings from arrays
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim()),
      features: formData.features.filter(feat => feat.trim()),
      amenities: formData.amenities.filter(amen => amen.trim()),
      price: parseFloat(formData.price),
      area: parseFloat(formData.area)
    };

    try {
      // Here you would typically make an API call to save the property
      console.log('Saving property:', cleanedData);
      
      toast({
        title: editingProperty ? "تم تحديث العقار بنجاح" : "تم إضافة العقار بنجاح",
        description: "تم حفظ البيانات بنجاح",
      });
      
      resetForm();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property) => {
    setFormData({
      ...property,
      images: property.images || [''],
      features: property.features || [''],
      amenities: property.amenities || ['']
    });
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      try {
        // Here you would make an API call to delete the property
        console.log('Deleting property:', propertyId);
        
        toast({
          title: "تم حذف العقار بنجاح",
          description: "تم حذف العقار من النظام",
        });
      } catch (error) {
        toast({
          title: "حدث خطأ",
          description: "فشل في حذف العقار",
          variant: "destructive"
        });
      }
    }
  };

  if (propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
                <img 
                  src={inspireLogo} 
                  alt="شركة إنسباير العقارية" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">إدارة العقارات</h1>
                <p className="text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للوحة التحكم
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showAddForm ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">عنوان العقار</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">الموقع</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الموقع" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} - {location.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Price and Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">السعر</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_type">نوع السعر</Label>
                    <Select value={formData.price_type} onValueChange={(value) => handleInputChange('price_type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="للبيع">للبيع</SelectItem>
                        <SelectItem value="للإيجار">للإيجار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="property_type">نوع العقار</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="شقة">شقة</SelectItem>
                        <SelectItem value="فيلا">فيلا</SelectItem>
                        <SelectItem value="مكتب">مكتب</SelectItem>
                        <SelectItem value="متجر">متجر</SelectItem>
                        <SelectItem value="أرض">أرض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">غرف النوم</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">دورات المياه</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">المساحة (متر مربع)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="parking">مواقف السيارات</Label>
                    <Input
                      id="parking"
                      type="number"
                      value={formData.parking}
                      onChange={(e) => handleInputChange('parking', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>صور العقار</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm">صورة {index + 1}</Label>
                        <ImageUploader
                          bucketName="property-images"
                          folder="properties"
                          currentImageUrl={image}
                          onImageUploaded={(url) => handleArrayChange('images', index, url)}
                          onImageRemoved={() => removeArrayItem('images', index)}
                          buttonText="رفع صورة العقار"
                        />
                      </div>
                    ))}
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayItem('images')}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة صورة جديدة
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label>المميزات</Label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                        placeholder="مثال: مصعد، أمن، حديقة"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('features', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('features')}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة ميزة
                  </Button>
                </div>

                {/* Amenities */}
                <div>
                  <Label>المرافق</Label>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={amenity}
                        onChange={(e) => handleArrayChange('amenities', index, e.target.value)}
                        placeholder="مثال: نادي صحي، مسبح، ملعب"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('amenities', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('amenities')}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مرفق
                  </Button>
                </div>

                {/* Agent Information */}
                <div className="border-t pt-6 mt-6">
                  <Label className="text-lg font-semibold mb-4 block">معلومات الوكيل</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="agent_name">اسم الوكيل</Label>
                      <Input
                        id="agent_name"
                        value={formData.agent_name}
                        onChange={(e) => handleInputChange('agent_name', e.target.value)}
                        placeholder="اسم الوكيل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent_phone">هاتف الوكيل</Label>
                      <Input
                        id="agent_phone"
                        value={formData.agent_phone}
                        onChange={(e) => handleInputChange('agent_phone', e.target.value)}
                        placeholder="رقم الهاتف"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent_email">بريد الوكيل الإلكتروني</Label>
                      <Input
                        id="agent_email"
                        type="email"
                        value={formData.agent_email}
                        onChange={(e) => handleInputChange('agent_email', e.target.value)}
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label>صورة الوكيل</Label>
                    <ImageUploader
                      bucketName="property-images"
                      folder="agents"
                      currentImageUrl={formData.agent_image}
                      onImageUploaded={(url) => handleInputChange('agent_image', url)}
                      onImageRemoved={() => handleInputChange('agent_image', '')}
                      buttonText="رفع صورة الوكيل"
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    {editingProperty ? 'تحديث العقار' : 'إضافة العقار'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {/* Properties List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                {property.images && property.images[0] && (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {property.is_featured && (
                    <Badge className="bg-yellow-500">
                      <Star className="w-3 h-3 ml-1" />
                      مميز
                    </Badge>
                  )}
                  {property.special_type !== 'عادي' && (
                    <Badge variant="secondary">{property.special_type}</Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    {property.price?.toLocaleString()} ج.م
                  </span>
                  <Badge variant="outline">{property.price_type}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(property)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد عقارات</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإضافة عقار جديد</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminProperties;
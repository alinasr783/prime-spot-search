import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocations } from '@/hooks/useLocations';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';
import { ImageUploader } from '@/components/ImageUploader';

const AdminLocations = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { locations, loading } = useLocations();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    governorate: '',
    image_url: '',
    is_active: true
  });

  // Check auth
  useEffect(() => {
    const adminData = localStorage.getItem('adminAuth');
    if (!adminData) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleBack = () => {
    setLocation('/admin/dashboard');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      governorate: '',
      image_url: '',
      is_active: true
    });
    setEditingLocation(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically make an API call to save the location
      console.log('Saving location:', formData);
      
      toast({
        title: editingLocation ? "تم تحديث الموقع بنجاح" : "تم إضافة الموقع بنجاح",
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

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      city: location.city,
      governorate: location.governorate,
      image_url: location.image_url || '',
      is_active: location.is_active
    });
    setEditingLocation(location);
    setShowAddForm(true);
  };

  const handleDelete = async (locationId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموقع؟')) {
      try {
        // Here you would make an API call to delete the location
        console.log('Deleting location:', locationId);
        
        toast({
          title: "تم حذف الموقع بنجاح",
          description: "تم حذف الموقع من النظام",
        });
      } catch (error) {
        toast({
          title: "حدث خطأ",
          description: "فشل في حذف الموقع",
          variant: "destructive"
        });
      }
    }
  };

  const toggleLocationStatus = async (locationId, currentStatus) => {
    try {
      // Here you would make an API call to toggle the location status
      console.log('Toggling location status:', locationId, !currentStatus);
      
      toast({
        title: "تم تحديث حالة الموقع",
        description: `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} الموقع`,
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في تحديث حالة الموقع",
        variant: "destructive"
      });
    }
  };

  const governorates = [...new Set(locations.map(loc => loc.governorate))];
  const activeLocations = locations.filter(loc => loc.is_active);
  const inactiveLocations = locations.filter(loc => !loc.is_active);

  if (loading) {
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
                <img 
                  src={inspireLogo} 
                  alt="شركة إنسباير العقارية" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة المواقع</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" onClick={handleBack} className="order-2 sm:order-1">
                <ArrowLeft className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">العودة للوحة التحكم</span>
                <span className="sm:hidden">العودة</span>
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="order-1 sm:order-2">
                <Plus className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">إضافة موقع جديد</span>
                <span className="sm:hidden">إضافة موقع</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المواقع</p>
                  <p className="text-2xl font-bold">{locations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المواقع النشطة</p>
                  <p className="text-2xl font-bold">{activeLocations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <EyeOff className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المواقع غير النشطة</p>
                  <p className="text-2xl font-bold">{inactiveLocations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddForm ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {editingLocation ? 'تعديل الموقع' : 'إضافة موقع جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">اسم الموقع</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="مثال: التجمع الخامس"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="مثال: القاهرة الجديدة"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="governorate">المحافظة</Label>
                    <Input
                      id="governorate"
                      value={formData.governorate}
                      onChange={(e) => handleInputChange('governorate', e.target.value)}
                      placeholder="مثال: القاهرة"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>صورة الموقع</Label>
                  <ImageUploader
                    bucketName="location-images"
                    folder="locations"
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => handleInputChange('image_url', url)}
                    onImageRemoved={() => handleInputChange('image_url', '')}
                    buttonText="رفع صورة الموقع"
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active" className="mr-2">الموقع نشط</Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    {editingLocation ? 'تحديث الموقع' : 'إضافة الموقع'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {/* Locations by Governorate */}
        {governorates.map((governorate) => {
          const govLocations = locations.filter(loc => loc.governorate === governorate);
          
          return (
            <Card key={governorate} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  محافظة {governorate}
                  <Badge variant="secondary">{govLocations.length} موقع</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {govLocations.map((location) => (
                    <div 
                      key={location.id} 
                      className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.city}</p>
                        </div>
                        <Badge variant={location.is_active ? "default" : "secondary"}>
                          {location.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(location)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(location.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant={location.is_active ? "secondary" : "default"}
                          onClick={() => toggleLocationStatus(location.id, location.is_active)}
                        >
                          {location.is_active ? (
                            <>
                              <EyeOff className="w-4 h-4 ml-2" />
                              إلغاء تفعيل
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 ml-2" />
                              تفعيل
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {locations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مواقع</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإضافة موقع جديد</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة موقع جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminLocations;
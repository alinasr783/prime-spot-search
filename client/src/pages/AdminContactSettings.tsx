import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContactSettings } from '@/hooks/useContactSettings';
import { 
  ArrowLeft, 
  Save, 
  Phone,
  Mail,
  MapPin,
  Building,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';

const AdminContactSettings = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { settings: contactSettings, loading } = useContactSettings();
  
  const [formData, setFormData] = useState({
    company_name: 'شركة إنسباير العقارية',
    phone: '',
    email: '',
    address: '',
    whatsapp_number: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    youtube_url: ''
  });

  // Check auth
  useEffect(() => {
    const adminData = localStorage.getItem('adminAuth');
    if (!adminData) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  // Load existing settings
  useEffect(() => {
    if (contactSettings && Object.keys(contactSettings).length > 0) {
      setFormData({
        company_name: contactSettings.company_name || 'شركة إنسباير العقارية',
        phone: contactSettings.phone || '',
        email: contactSettings.email || '',
        address: contactSettings.address || '',
        whatsapp_number: contactSettings.whatsapp_number || '',
        facebook_url: contactSettings.facebook_url || '',
        instagram_url: contactSettings.instagram_url || '',
        twitter_url: contactSettings.twitter_url || '',
        linkedin_url: contactSettings.linkedin_url || '',
        youtube_url: contactSettings.youtube_url || ''
      });
    }
  }, [contactSettings]);

  const handleBack = () => {
    setLocation('/admin/dashboard');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically make an API call to save the contact settings
      console.log('Saving contact settings:', formData);
      
      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تحديث بيانات التواصل والشركة",
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">إعدادات التواصل</h1>
                <p className="text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للوحة التحكم
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                معلومات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">اسم الشركة</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">عنوان الشركة</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="العنوان الكامل للشركة"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+20 123 456 7890"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="info@inspire-realestate.com"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  رقم الواتساب
                </Label>
                <Input
                  id="whatsapp_number"
                  type="tel"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  placeholder="+20 123 456 7890"
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="w-5 h-5" />
                وسائل التواصل الاجتماعي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    فيسبوك
                  </Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/inspire-realestate"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    إنستجرام
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/inspire-realestate"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    تويتر
                  </Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/inspire-realestate"
                    dir="ltr"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    لينكد إن
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/company/inspire-realestate"
                    dir="ltr"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="youtube_url" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    يوتيوب
                  </Label>
                  <Input
                    id="youtube_url"
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/@inspire-realestate"
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save className="w-4 h-4 ml-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </form>

        {/* Preview Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>معاينة البيانات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong>اسم الشركة:</strong> {formData.company_name}
              </div>
              
              {formData.address && (
                <div>
                  <strong>العنوان:</strong> {formData.address}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.phone && (
                  <div>
                    <strong>الهاتف:</strong> <span dir="ltr">{formData.phone}</span>
                  </div>
                )}
                
                {formData.email && (
                  <div>
                    <strong>الإيميل:</strong> <span dir="ltr">{formData.email}</span>
                  </div>
                )}
                
                {formData.whatsapp_number && (
                  <div>
                    <strong>الواتساب:</strong> <span dir="ltr">{formData.whatsapp_number}</span>
                  </div>
                )}
              </div>

              {(formData.facebook_url || formData.instagram_url || formData.twitter_url || formData.linkedin_url || formData.youtube_url) && (
                <div>
                  <strong>وسائل التواصل:</strong>
                  <div className="flex gap-2 mt-2">
                    {formData.facebook_url && <Facebook className="w-5 h-5 text-blue-600" />}
                    {formData.instagram_url && <Instagram className="w-5 h-5 text-pink-600" />}
                    {formData.twitter_url && <Twitter className="w-5 h-5 text-blue-400" />}
                    {formData.linkedin_url && <Linkedin className="w-5 h-5 text-blue-700" />}
                    {formData.youtube_url && <Youtube className="w-5 h-5 text-red-600" />}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminContactSettings;
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { 
  Building, 
  MapPin, 
  MessageSquare, 
  Settings, 
  Users,
  BarChart3,
  Plus,
  LogOut,
  Eye,
  Edit,
  TrendingUp,
  Activity
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { totalProperties, newInquiries, featuredProperties, totalLocations, loading, error } = useDashboardStats();

  useEffect(() => {
    // Simple check - if no admin data in localStorage, redirect
    const adminData = localStorage.getItem('adminAuth');
    if (!adminData) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Don't render anything while checking auth
  const adminDataRaw = localStorage.getItem('adminAuth');
  if (!adminDataRaw) {
    return null;
  }

  // Parse admin data from localStorage
  const adminData = JSON.parse(adminDataRaw);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const dashboardItems = [
    {
      title: 'إدارة العقارات',
      description: 'إضافة وتعديل وحذف العقارات',
      icon: Building,
      path: '/admin/properties',
      color: 'bg-blue-500'
    },
    {
      title: 'إدارة المواقع',
      description: 'إضافة وتعديل وحذف المواقع',
      icon: MapPin,
      path: '/admin/locations',
      color: 'bg-green-500'
    },
    {
      title: 'الرسائل والاستفسارات',
      description: 'عرض وإدارة رسائل العملاء',
      icon: MessageSquare,
      path: '/admin/inquiries',
      color: 'bg-purple-500'
    },
    {
      title: 'إعدادات التواصل',
      description: 'إدارة بيانات التواصل والشركة',
      icon: Settings,
      path: '/admin/contact-settings',
      color: 'bg-orange-500'
    }
  ];

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
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">لوحة التحكم</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="text-left order-2 sm:order-1">
                <p className="text-sm font-medium text-foreground break-all">{adminData.email}</p>
                <p className="text-xs text-muted-foreground">مشرف النظام</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="order-1 sm:order-2 w-full sm:w-auto">
                <LogOut className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
                <span className="sm:hidden">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">مرحباً بك في لوحة التحكم</h2>
          <p className="text-sm sm:text-base text-muted-foreground">إدارة شاملة لموقع إنسباير العقارية</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardItems.map((item) => (
            <Card 
              key={item.path}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 active:scale-95 sm:active:scale-100"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي العقارات</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '...' : totalProperties}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الرسائل الجديدة</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '...' : newInquiries}
                  </p>
                  {newInquiries > 0 && (
                    <Badge variant="destructive" className="text-xs">جديد</Badge>
                  )}
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">العقارات المميزة</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '...' : featuredProperties}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي المواقع</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? '...' : totalLocations}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate('/admin/properties')}
              >
                <Building className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </Button>
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate('/admin/locations')}
              >
                <MapPin className="w-4 h-4 ml-2" />
                إضافة موقع جديد
              </Button>
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate('/admin/inquiries')}
              >
                <MessageSquare className="w-4 h-4 ml-2" />
                عرض الرسائل
              </Button>
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate('/admin/contact-settings')}
              >
                <Settings className="w-4 h-4 ml-2" />
                إعدادات التواصل
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                إحصائيات النشاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">إجمالي العقارات النشطة</p>
                      <p className="text-sm text-muted-foreground">العقارات المتاحة للعرض</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{loading ? '...' : totalProperties}</p>
                    <p className="text-sm text-muted-foreground">عقار</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">الاستفسارات الجديدة</p>
                      <p className="text-sm text-muted-foreground">تحتاج إلى مراجعة</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{loading ? '...' : newInquiries}</p>
                    <p className="text-sm text-muted-foreground">رسالة</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">العقارات المميزة</p>
                      <p className="text-sm text-muted-foreground">معروضة في الصفحة الرئيسية</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{loading ? '...' : featuredProperties}</p>
                    <p className="text-sm text-muted-foreground">عقار</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
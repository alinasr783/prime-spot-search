import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  MapPin, 
  MessageSquare, 
  Settings, 
  Users,
  BarChart3,
  Plus,
  LogOut
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  if (!admin) {
    return null;
  }

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
                <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">مرحباً، {admin.email}</p>
                <p className="text-xs text-muted-foreground">مشرف النظام</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">مرحباً بك في لوحة التحكم</h2>
          <p className="text-muted-foreground">إدارة شاملة لموقع إنسباير العقارية</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardItems.map((item) => (
            <Card 
              key={item.path}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
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
                onClick={() => navigate('/admin/properties/new')}
              >
                <Building className="w-4 h-4 ml-2" />
                إضافة عقار جديد
              </Button>
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => navigate('/admin/locations/new')}
              >
                <MapPin className="w-4 h-4 ml-2" />
                إضافة موقع جديد
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                إحصائيات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي العقارات</span>
                  <span className="font-semibold">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الرسائل الجديدة</span>
                  <span className="font-semibold">--</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">العقارات المميزة</span>
                  <span className="font-semibold">--</span>
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
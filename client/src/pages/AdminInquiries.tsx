import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useInquiries } from '@/hooks/useInquiries';
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone,
  Mail,
  Calendar,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';

const AdminInquiries = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inquiries, loading } = useInquiries();
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      // Here you would make an API call to update the inquiry status
      console.log('Updating inquiry status:', inquiryId, newStatus);
      
      toast({
        title: "تم تحديث الحالة بنجاح",
        description: `تم تغيير حالة الاستفسار إلى: ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في تحديث حالة الاستفسار",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'جديد':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'قيد المراجعة':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'تم الرد':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'جديد':
        return 'bg-red-100 text-red-800';
      case 'قيد المراجعة':
        return 'bg-yellow-100 text-yellow-800';
      case 'تم الرد':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const sortedInquiries = [...filteredInquiries].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const inquiryStats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'جديد').length,
    pending: inquiries.filter(i => i.status === 'قيد المراجعة').length,
    replied: inquiries.filter(i => i.status === 'تم الرد').length
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
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة الاستفسارات</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">شركة إنسباير العقارية</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 ml-2" />
              <span className="hidden sm:inline">العودة للوحة التحكم</span>
              <span className="sm:hidden">العودة</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الاستفسارات</p>
                  <p className="text-2xl font-bold">{inquiryStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">جديدة</p>
                  <p className="text-2xl font-bold">{inquiryStats.new}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                  <p className="text-2xl font-bold">{inquiryStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تم الرد عليها</p>
                  <p className="text-2xl font-bold">{inquiryStats.replied}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              الفلاتر والترتيب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">تصفية حسب الحالة</label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الاستفسارات</SelectItem>
                    <SelectItem value="جديد">جديدة</SelectItem>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="تم الرد">تم الرد عليها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">ترتيب حسب</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                    <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                    <SelectItem value="name">الاسم أبجدياً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <div className="space-y-4">
          {sortedInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{inquiry.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        نوع الاستفسار: {inquiry.inquiry_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <Badge className={`${getStatusColor(inquiry.status)} text-xs`}>
                      {getStatusIcon(inquiry.status)}
                      <span className="mr-1">{inquiry.status}</span>
                    </Badge>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="جديد">جديد</SelectItem>
                        <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                        <SelectItem value="تم الرد">تم الرد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  {inquiry.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span dir="ltr">{inquiry.phone}</span>
                    </div>
                  )}
                  
                  {inquiry.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span dir="ltr">{inquiry.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(inquiry.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-2">الرسالة:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{inquiry.message}</p>
                </div>

                {inquiry.property_id && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <p className="text-sm text-muted-foreground">
                      متعلق بعقار: {inquiry.property_id}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/property/${inquiry.property_id}`)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      عرض العقار
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedInquiries.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'all' ? 'لا توجد استفسارات' : `لا توجد استفسارات ${filter}`}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'لم يتم استلام أي استفسارات حتى الآن'
                  : 'جرب تغيير الفلتر لعرض استفسارات أخرى'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminInquiries;
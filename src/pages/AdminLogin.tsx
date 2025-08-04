import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import inspireLogo from '@/assets/inspire-logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (admin) {
      console.log('🔄 Already logged in, redirecting to dashboard...');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });
        console.log('🎉 Login successful, useEffect will handle navigation');
        // Don't navigate here - let useEffect handle it when admin state updates
      } else {
        setError(result.error || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-white rounded-full p-3 shadow-lg flex items-center justify-center mx-auto mb-4">
            <img 
              src={inspireLogo} 
              alt="شركة إنسباير العقارية" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            لوحة التحكم
          </CardTitle>
          <p className="text-muted-foreground">
            تسجيل دخول المشرف
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  placeholder="أدخل البريد الإلكتروني"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 شركة إنسباير العقارية</p>
            <p>جميع الحقوق محفوظة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
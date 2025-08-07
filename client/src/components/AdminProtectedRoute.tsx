import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { getStoredAdmin, isLoading } = useAuth();
  const admin = getStoredAdmin();

  console.log('🛡️ AdminProtectedRoute - Current state:', { admin, isLoading });

  if (isLoading) {
    console.log('⏳ Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    console.log('❌ No admin found, redirecting to login');
    return <Redirect to="/admin/login" />;
  }

  console.log('✅ Admin authenticated, showing dashboard');
  return <>{children}</>;
};

export default AdminProtectedRoute;
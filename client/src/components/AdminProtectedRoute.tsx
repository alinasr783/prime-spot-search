import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { admin, loading } = useAuth();

  console.log('🛡️ AdminProtectedRoute - Current state:', { admin, loading });

  if (loading) {
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
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ Admin authenticated, showing dashboard');
  return <>{children}</>;
};

export default AdminProtectedRoute;
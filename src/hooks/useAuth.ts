import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Admin {
  id: number;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuth = (): AuthContextType => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminData = localStorage.getItem('adminAuth');
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
      } catch (error) {
        localStorage.removeItem('adminAuth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Query the admins table
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, password')
        .eq('email', email)
        .single();

      if (error) {
        return { success: false, error: 'البيانات غير صحيحة' };
      }

      if (!data || data.password !== password) {
        return { success: false, error: 'البيانات غير صحيحة' };
      }

      const adminData = { id: data.id, email: data.email };
      setAdmin(adminData);
      localStorage.setItem('adminAuth', JSON.stringify(adminData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminAuth');
  };

  return { admin, loading, login, logout };
};
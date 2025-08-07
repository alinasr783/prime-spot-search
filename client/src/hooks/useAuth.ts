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
    console.log('🚀 useAuth: Checking localStorage for existing admin...');
    // Check if admin is already logged in
    const adminData = localStorage.getItem('adminAuth');
    console.log('📱 Raw localStorage data:', adminData);
    
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        console.log('✅ Found existing admin:', parsedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.log('❌ Error parsing admin data:', error);
        localStorage.removeItem('adminAuth');
      }
    } else {
      console.log('ℹ️ No admin data in localStorage');
    }
    setLoading(false);
    console.log('✅ useAuth initialization complete');
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔍 Starting login process for:', email);
      
      // Query the admins table
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, password')
        .eq('email', email)
        .single();

      console.log('📊 Database response:', { data, error });

      if (error) {
        console.log('❌ Database error:', error);
        return { success: false, error: 'البيانات غير صحيحة' };
      }

      if (!data || data.password !== password) {
        console.log('❌ Invalid credentials');
        return { success: false, error: 'البيانات غير صحيحة' };
      }

      const adminData = { id: data.id, email: data.email };
      console.log('✅ Login successful, saving admin data:', adminData);
      
      // Update state and localStorage
      setAdmin(adminData);
      localStorage.setItem('adminAuth', JSON.stringify(adminData));
      
      // Verify data was saved
      const savedData = localStorage.getItem('adminAuth');
      console.log('💾 Data saved in localStorage:', savedData);
      
      return { success: true };
    } catch (error) {
      console.log('💥 Login error:', error);
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
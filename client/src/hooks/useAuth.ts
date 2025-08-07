import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AdminData {
  id: number;
  email: string;
  created_at: string;
}

interface LoginResult {
  success: boolean;
  admin?: AdminData;
  error?: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const result = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.success && result.admin) {
        // Store admin data in localStorage
        localStorage.setItem('adminAuth', JSON.stringify(result.admin));
        return { success: true, admin: result.admin };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminAuth');
  }, []);

  const getStoredAdmin = useCallback((): AdminData | null => {
    const stored = localStorage.getItem('adminAuth');
    return stored ? JSON.parse(stored) : null;
  }, []);

  return {
    login,
    logout,
    getStoredAdmin,
    isLoading,
  };
};
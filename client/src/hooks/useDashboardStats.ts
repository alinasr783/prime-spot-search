import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalProperties: number;
  newInquiries: number;
  featuredProperties: number;
  totalLocations: number;
  loading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    newInquiries: 0,
    featuredProperties: 0,
    totalLocations: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Get total properties count
      const { count: totalProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (propertiesError) {
        throw propertiesError;
      }

      // Get featured properties count
      const { count: featuredProperties, error: featuredError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_featured', true);

      if (featuredError) {
        throw featuredError;
      }

      // Get new inquiries count (status = 'جديد')
      const { count: newInquiries, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'جديد');

      if (inquiriesError) {
        throw inquiriesError;
      }

      // Get total locations count
      const { count: totalLocations, error: locationsError } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (locationsError) {
        throw locationsError;
      }

      setStats({
        totalProperties: totalProperties || 0,
        featuredProperties: featuredProperties || 0,
        newInquiries: newInquiries || 0,
        totalLocations: totalLocations || 0,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'حدث خطأ أثناء تحميل الإحصائيات'
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    refreshStats: fetchStats
  };
};
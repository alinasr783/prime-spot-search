import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Location {
  id: string;
  name: string;
  city: string;
  governorate: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');

      if (error) {
        setError(error.message);
        return;
      }

      setLocations(data || []);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المواقع');
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert(locationData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setLocations(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'حدث خطأ أثناء إضافة الموقع' };
    }
  };

  const updateLocation = async (id: string, locationData: Partial<Location>) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update(locationData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setLocations(prev => 
        prev.map(location => 
          location.id === id ? data : location
        )
      );
      
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'حدث خطأ أثناء تحديث الموقع' };
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      setLocations(prev => prev.filter(location => location.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'حدث خطأ أثناء حذف الموقع' };
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    refreshLocations: fetchLocations
  };
};
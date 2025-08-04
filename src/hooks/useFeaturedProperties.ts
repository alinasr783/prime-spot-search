import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  price_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  property_type: string;
  special_type: string;
}

export const useFeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('special_type', 'مميزة جدا')
          .eq('is_active', true)
          .limit(6);

        if (error) {
          throw error;
        }

        setProperties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return { properties, loading, error };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  price: number;
  price_type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking?: number;
  area?: number;
  build_year?: number;
  floor_number?: string;
  images: string[];
  features: string[];
  amenities: string[];
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_image?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  special_type?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  price_per_sqm?: number;
}

// نوع للفلاتر المستخدمة في البحث
interface PropertyFilters {
  location?: string;
  propertyType?: string;
  priceType?: string;
  bedrooms?: string;
  bathrooms?: string;
  priceMin?: string;
  priceMax?: string;
  governorate?: string;
  city?: string;
}

const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id, fetchProperty]);

  return { property, loading, error, refetch: fetchProperty };
};

const useProperties = (filters: PropertyFilters = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);

      // تطبيق الفلاتر
      if (filters.location) query = query.ilike('location', `%${filters.location}%`);
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
      if (filters.priceType) query = query.eq('price_type', filters.priceType);
      if (filters.bedrooms) query = query.eq('bedrooms', parseInt(filters.bedrooms));
      if (filters.bathrooms) query = query.eq('bathrooms', parseInt(filters.bathrooms));
      if (filters.priceMin) query = query.gte('price', parseInt(filters.priceMin));
      if (filters.priceMax) query = query.lte('price', parseInt(filters.priceMax));
      if (filters.governorate) query = query.eq('governorate', filters.governorate);
      if (filters.city) query = query.eq('city', filters.city);

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب العقارات');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
};

const useRelatedProperties = (propertyId: string) => {
  const [data, setData] = useState<{
    nearbyProperties: Property[];
    similarPriceProperties: Property[];
    similarAreaProperties: Property[];
  }>({
    nearbyProperties: [],
    similarPriceProperties: [],
    similarAreaProperties: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;
      if (!property) return;

      // جلب العقارات المجاورة
      const nearbyQuery = supabase
        .from('properties')
        .select('*')
        .neq('id', propertyId)
        .eq('is_active', true)
        .limit(6);

      if (property.governorate) nearbyQuery.eq('governorate', property.governorate);
      if (property.city) nearbyQuery.eq('city', property.city);

      // جلب العقارات متقاربة السعر
      const priceRange = property.price * 0.2;
      const similarPriceQuery = supabase
        .from('properties')
        .select('*')
        .neq('id', propertyId)
        .eq('is_active', true)
        .gte('price', property.price - priceRange)
        .lte('price', property.price + priceRange)
        .limit(6);

      // جلب العقارات متقاربة المساحة
      let similarAreaQuery = null;
      if (property.area) {
        const areaRange = property.area * 0.2;
        similarAreaQuery = supabase
          .from('properties')
          .select('*')
          .neq('id', propertyId)
          .eq('is_active', true)
          .gte('area', property.area - areaRange)
          .lte('area', property.area + areaRange)
          .limit(6);
      }

      // تنفيذ جميع الاستعلامات بشكل متوازي
      const [
        { data: nearby, error: nearbyError },
        { data: similarPrice, error: similarPriceError },
        { data: similarArea, error: similarAreaError }
      ] = await Promise.all([
        nearbyQuery,
        similarPriceQuery,
        similarAreaQuery || Promise.resolve({ data: [], error: null })
      ]);

      if (nearbyError) throw nearbyError;
      if (similarPriceError) throw similarPriceError;
      if (similarAreaError) throw similarAreaError;

      setData({
        nearbyProperties: nearby || [],
        similarPriceProperties: similarPrice || [],
        similarAreaProperties: similarArea || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب العقارات ذات الصلة');
      console.error('Error fetching related properties:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) fetchRelatedProperties();
  }, [propertyId, fetchRelatedProperties]);

  return { 
    ...data,
    loading, 
    error,
    refetch: fetchRelatedProperties
  };
};

const useFeaturedProperties = (limit = 6) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(limit);

      if (supabaseError) throw supabaseError;
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب العقارات المميزة');
      console.error('Error fetching featured properties:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  return { properties, loading, error, refetch: fetchFeaturedProperties };
};

const useRecentProperties = (limit = 6) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (supabaseError) throw supabaseError;
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في جلب أحدث العقارات');
      console.error('Error fetching recent properties:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentProperties();
  }, [fetchRecentProperties]);

  return { properties, loading, error, refetch: fetchRecentProperties };
};

export {
  useProperty,
  useProperties,
  useRelatedProperties,
  useFeaturedProperties,
  useRecentProperties
};
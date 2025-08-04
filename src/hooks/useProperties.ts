import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SearchFilters } from "@/components/SearchFilters";

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
  description: string;
  features: string[];
  amenities: string[];
  is_featured: boolean;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  created_at: string;
}

export const useProperties = (filters?: SearchFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters) {
        if (filters.location && filters.location !== "" && filters.location !== "all") {
          query = query.eq('location', filters.location);
        }
        
        if (filters.propertyType && filters.propertyType !== "" && filters.propertyType !== "all") {
          query = query.eq('property_type', filters.propertyType);
        }
        
        if (filters.priceType && filters.priceType !== "" && filters.priceType !== "all") {
          query = query.eq('price_type', filters.priceType);
        }
        
        if (filters.bedrooms && filters.bedrooms !== "" && filters.bedrooms !== "all") {
          if (filters.bedrooms === "5+") {
            query = query.gte('bedrooms', 5);
          } else {
            query = query.eq('bedrooms', parseInt(filters.bedrooms));
          }
        }
        
        if (filters.bathrooms && filters.bathrooms !== "" && filters.bathrooms !== "all") {
          if (filters.bathrooms === "4+") {
            query = query.gte('bathrooms', 4);
          } else {
            query = query.eq('bathrooms', parseInt(filters.bathrooms));
          }
        }
        
        if (filters.priceMin && filters.priceMin !== "") {
          query = query.gte('price', parseFloat(filters.priceMin));
        }
        
        if (filters.priceMax && filters.priceMax !== "") {
          query = query.lte('price', parseFloat(filters.priceMax));
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
};

export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
};
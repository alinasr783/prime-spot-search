import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/pages/PropertyDetails';

export const useRelatedProperties = (propertyId: string) => {
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

  useEffect(() => {
    if (!propertyId) return;

    const fetchRelatedProperties = async () => {
      try {
        setLoading(true);

        // 1. Get the current property details
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (propertyError) throw propertyError;
        if (!property) return;

        // 2. Fetch nearby properties (same governorate and city)
        const { data: nearby, error: nearbyError } = await supabase
          .from('properties')
          .select('*')
          .neq('id', propertyId)
          .eq('governorate', property.governorate)
          .eq('city', property.city)
          .limit(6);

        if (nearbyError) throw nearbyError;

        // 3. Fetch similar price properties (±20% of current price)
        const priceRange = property.price * 0.2;
        const { data: similarPrice, error: similarPriceError } = await supabase
          .from('properties')
          .select('*')
          .neq('id', propertyId)
          .gte('price', property.price - priceRange)
          .lte('price', property.price + priceRange)
          .limit(6);

        if (similarPriceError) throw similarPriceError;

        // 4. Fetch similar area properties (±20% of current area)
        let similarArea: Property[] = [];
        if (property.area) {
          const areaRange = property.area * 0.2;
          const { data: areaData, error: similarAreaError } = await supabase
            .from('properties')
            .select('*')
            .neq('id', propertyId)
            .gte('area', property.area - areaRange)
            .lte('area', property.area + areaRange)
            .limit(6);

          if (similarAreaError) throw similarAreaError;
          similarArea = areaData || [];
        }

        setData({
          nearbyProperties: nearby || [],
          similarPriceProperties: similarPrice || [],
          similarAreaProperties: similarArea
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [propertyId]);

  return { 
    nearbyProperties: data.nearbyProperties, 
    similarPriceProperties: data.similarPriceProperties, 
    similarAreaProperties: data.similarAreaProperties,
    loading, 
    error 
  };
};
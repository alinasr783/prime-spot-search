import { useQuery } from '@tanstack/react-query';

export interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  price: string;
  price_type?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  parking?: number;
  images: string[];
  features?: string[];
  amenities?: string[];
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  agent_image?: string;
  is_featured: boolean;
  is_active: boolean;
  special_type?: string;
  floor_number?: string;
  build_year?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SearchFilters {
  location?: string;
  propertyType?: string;
  priceType?: string;
  bedrooms?: string;
  bathrooms?: string;
  priceMin?: string;
  priceMax?: string;
}

export const useProperties = (filters?: SearchFilters) => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/properties?${queryString}` : '/api/properties';

  const { data: properties, isLoading: loading, error, refetch } = useQuery({
    queryKey: [url],
  });

  return {
    properties: properties as Property[] || [],
    loading,
    error,
    refetch,
  };
};

export const useProperty = (id: string) => {
  const { data: property, isLoading: loading, error } = useQuery({
    queryKey: [`/api/properties/${id}`],
    enabled: !!id,
  });

  return {
    property: property as Property | undefined,
    loading,
    error,
  };
};

export const useFeaturedProperties = () => {
  const { data: properties, isLoading: loading, error } = useQuery({
    queryKey: ['/api/properties/featured'],
  });

  return {
    properties: properties as Property[] || [],
    loading,
    error,
  };
};
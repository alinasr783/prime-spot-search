import { useQuery } from '@tanstack/react-query';

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
  const { data: properties, isLoading: loading, error } = useQuery({
    queryKey: ['/api/properties/featured'],
  });

  return {
    properties: properties as Property[] || [],
    loading,
    error,
  };
};
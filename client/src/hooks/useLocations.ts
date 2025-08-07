import { useQuery } from '@tanstack/react-query';

interface Location {
  id: string;
  name: string;
  city: string;
  governorate: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLocations = () => {
  const { data: locations, isLoading: loading, error } = useQuery({
    queryKey: ['/api/admin/locations'],
  });

  return {
    locations: locations as Location[] || [],
    loading,
    error,
  };
};
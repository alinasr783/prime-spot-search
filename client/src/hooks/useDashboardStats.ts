import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  newInquiries: number;
  totalLocations: number;
}

export const useDashboardStats = () => {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  return {
    totalProperties: data?.totalProperties || 0,
    featuredProperties: data?.featuredProperties || 0,
    newInquiries: data?.newInquiries || 0,
    totalLocations: data?.totalLocations || 0,
    loading,
    error,
  };
};
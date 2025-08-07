import { useQuery } from '@tanstack/react-query';

interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  property_id?: string;
  inquiry_type?: string;
  status: string;
  created_at: string;
}

export const useInquiries = () => {
  const { data: inquiries, isLoading: loading, error } = useQuery({
    queryKey: ['/api/admin/inquiries'],
  });

  return {
    inquiries: inquiries as Inquiry[] || [],
    loading,
    error,
  };
};
import { useQuery } from '@tanstack/react-query';

interface ContactSettings {
  id: string;
  phone?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  whatsapp_number?: string;
  address?: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export const useContactSettings = () => {
  const { data: settings, isLoading: loading, error } = useQuery({
    queryKey: ['/api/contact-settings'],
  });

  return {
    settings: settings as ContactSettings | undefined,
    loading,
    error,
  };
};
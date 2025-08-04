import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContactSettings {
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
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setSettings(data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل إعدادات التواصل');
    } finally {
      setLoading(false);
    }
  };

  const updateContactSettings = async (updatedSettings: Partial<ContactSettings>) => {
    try {
      if (!settings) return { success: false, error: 'لا توجد إعدادات للتحديث' };

      const { data, error } = await supabase
        .from('contact_settings')
        .update(updatedSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setSettings(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' };
    }
  };

  useEffect(() => {
    fetchContactSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateContactSettings,
    refreshSettings: fetchContactSettings
  };
};
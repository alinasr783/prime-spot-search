import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Inquiry {
  id: string;
  property_id?: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  inquiry_type: string;
  status: string;
  created_at: string;
}

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setInquiries(data || []);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الاستفسارات');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: 'حدث خطأ أثناء تحديث حالة الاستفسار' };
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return {
    inquiries,
    loading,
    error,
    updateInquiryStatus,
    refreshInquiries: fetchInquiries
  };
};
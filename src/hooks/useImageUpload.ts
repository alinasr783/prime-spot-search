import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type BucketName = 'property-images' | 'location-images' | 'logos' | 'general-uploads';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (
    file: File, 
    bucketName: BucketName, 
    folder?: string
  ): Promise<string | null> => {
    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى رفع ملف صورة صحيح');
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return null;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('فشل في رفع الصورة');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      toast.success('تم رفع الصورة بنجاح');
      return publicUrl;

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('حدث خطأ أثناء رفع الصورة');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (bucketName: BucketName, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('فشل في حذف الصورة');
        return false;
      }

      toast.success('تم حذف الصورة بنجاح');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('حدث خطأ أثناء حذف الصورة');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading
  };
};
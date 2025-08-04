-- إنشاء جدول إعدادات التواصل
CREATE TABLE public.contact_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT,
  email TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  whatsapp_number TEXT,
  address TEXT,
  company_name TEXT NOT NULL DEFAULT 'شركة إنسباير العقارية',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء Storage bucket للصور
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- إنشاء policies للـ Storage bucket
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Anyone can update property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can delete property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images');

-- تمكين RLS على جدول إعدادات التواصل
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- إنشاء policy للقراءة العامة لإعدادات التواصل
CREATE POLICY "Contact settings are publicly readable" 
ON public.contact_settings 
FOR SELECT 
USING (true);

-- إدراج البيانات الافتراضية لإعدادات التواصل
INSERT INTO public.contact_settings (
  phone, 
  email, 
  facebook_url, 
  instagram_url, 
  whatsapp_number,
  address,
  company_name
) VALUES (
  '+20 100 123 4567',
  'info@inspire-realestate.com',
  'https://facebook.com/inspire-realestate',
  'https://instagram.com/inspire-realestate',
  '+20 100 123 4567',
  'القاهرة الجديدة، التجمع الخامس',
  'شركة إنسباير العقارية'
);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_contact_settings_updated_at
BEFORE UPDATE ON public.contact_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
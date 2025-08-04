-- Create locations table for neighborhoods/areas
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  governorate TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to active locations
CREATE POLICY "Active locations are viewable by everyone" 
ON public.locations 
FOR SELECT 
USING (is_active = true);

-- Insert sample Egyptian locations
INSERT INTO public.locations (name, city, governorate) VALUES
('المعادي', 'القاهرة', 'القاهرة'),
('الزمالك', 'القاهرة', 'القاهرة'),
('مدينة نصر', 'القاهرة', 'القاهرة'),
('التجمع الخامس', 'القاهرة الجديدة', 'القاهرة'),
('التجمع الأول', 'القاهرة الجديدة', 'القاهرة'),
('الشيخ زايد', 'الجيزة', 'الجيزة'),
('أكتوبر', 'الجيزة', 'الجيزة'),
('الدقي', 'الجيزة', 'الجيزة'),
('ستانلي', 'الإسكندرية', 'الإسكندرية'),
('سيدي جابر', 'الإسكندرية', 'الإسكندرية'),
('العجمي', 'الإسكندرية', 'الإسكندرية'),
('مامورة', 'الإسكندرية', 'الإسكندرية');

-- Add a special_type field to properties table to mark featured properties
ALTER TABLE public.properties ADD COLUMN special_type TEXT DEFAULT 'عادي';

-- Update some existing properties to be "مميزة جدا" if they exist
UPDATE public.properties SET special_type = 'مميزة جدا' WHERE is_featured = true;

-- Create trigger for timestamps
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
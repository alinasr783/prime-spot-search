-- Create buckets for different types of images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('property-images', 'property-images', true),
  ('location-images', 'location-images', true),
  ('logos', 'logos', true),
  ('general-uploads', 'general-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for property images bucket
CREATE POLICY "Anyone can view property images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Admins can update property images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can delete property images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images');

-- Create policies for location images bucket
CREATE POLICY "Anyone can view location images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'location-images');

CREATE POLICY "Admins can upload location images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'location-images');

CREATE POLICY "Admins can update location images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'location-images');

CREATE POLICY "Admins can delete location images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'location-images');

-- Create policies for logos bucket
CREATE POLICY "Anyone can view logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Admins can update logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos');

CREATE POLICY "Admins can delete logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos');

-- Create policies for general uploads bucket
CREATE POLICY "Anyone can view general uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'general-uploads');

CREATE POLICY "Admins can upload general files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'general-uploads');

CREATE POLICY "Admins can update general files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'general-uploads');

CREATE POLICY "Admins can delete general files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'general-uploads');
-- Fix RLS for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create admin access policy for admins table
CREATE POLICY "Admin users can access admin data" 
ON public.admins 
FOR ALL 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_image_urls(image_urls text[])
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
DECLARE
    url text;
BEGIN
    FOREACH url IN ARRAY image_urls LOOP
        -- Check if URL starts with http/https
        IF NOT (url LIKE 'http://%' OR url LIKE 'https://%') THEN
            RAISE EXCEPTION 'Invalid image URL: % - must start with http:// or https://', url;
        END IF;
        
        -- Check for common image extensions
        IF NOT (
            url LIKE '%.jpg' OR url LIKE '%.jpeg' OR 
            url LIKE '%.png' OR url LIKE '%.gif' OR 
            url LIKE '%.webp' OR url LIKE '%.svg'
        ) THEN
            RAISE WARNING 'Image URL % may not point to an actual image (missing common image extension)', url;
        END IF;
    END LOOP;
    
    RETURN true;
END;
$$;
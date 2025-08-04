-- Fix the remaining function search path issue
CREATE OR REPLACE FUNCTION public.validate_property_images()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
BEGIN
    -- Check if images array is not empty
    IF NEW.images IS NULL OR array_length(NEW.images, 1) = 0 THEN
        RAISE EXCEPTION 'At least one image is required for the property';
    END IF;
    
    -- Validate each image URL
    PERFORM validate_image_urls(NEW.images);
    
    -- Validate agent image if provided
    IF NEW.agent_image IS NOT NULL THEN
        PERFORM validate_image_urls(ARRAY[NEW.agent_image]);
    END IF;
    
    RETURN NEW;
END;
$$;
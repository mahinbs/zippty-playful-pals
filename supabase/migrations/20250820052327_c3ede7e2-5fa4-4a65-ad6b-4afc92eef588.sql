-- Update products table to support multiple images
-- Change image column from text to text[] to store multiple image URLs
ALTER TABLE public.products 
ALTER COLUMN image TYPE text[] USING CASE 
  WHEN image IS NULL OR image = '' THEN '{}'::text[]
  ELSE ARRAY[image]
END;
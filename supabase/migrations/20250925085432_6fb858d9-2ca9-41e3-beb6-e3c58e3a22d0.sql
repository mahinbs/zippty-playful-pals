-- Add mobile and desktop image columns to banners table
ALTER TABLE public.banners 
ADD COLUMN mobile_image TEXT,
ADD COLUMN desktop_image TEXT;

-- Migrate existing background_image data to desktop_image
UPDATE public.banners 
SET desktop_image = background_image 
WHERE background_image IS NOT NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.banners.mobile_image IS 'Image URL optimized for mobile devices';
COMMENT ON COLUMN public.banners.desktop_image IS 'Image URL optimized for desktop and tablet devices';
COMMENT ON COLUMN public.banners.background_image IS 'Legacy image field - kept for backward compatibility';
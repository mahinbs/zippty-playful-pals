-- Create banners table for managing hero section banners
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/shop',
  background_image TEXT,
  overlay_opacity INTEGER DEFAULT 30 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  text_color TEXT DEFAULT 'white',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for banner access
CREATE POLICY "Public read access to active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin full access to banners" 
ON public.banners 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();